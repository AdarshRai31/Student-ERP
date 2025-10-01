const express = require("express");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../config");
const { authMiddlware } = require("../middlewares");
const { addToBlacklist } = require("../utils/tokenBlacklist");
const { 
  findUserByUsername, 
  createUser, 
  updateUserPassword,
  updateUserVerificationStatus,
  USER_COLUMNS 
} = require("../goggle_apis/sheets");
const { sendVerificationEmail, verifyEmailToken } = require("../services/emailService");

const router = express.Router();
const saltRounds = 10;
const { authLimiter } = require('../middlewares/rateLimiter');

// Zod schemas for input validation
const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    firstName: zod.string().min(1),
    lastName: zod.string().min(1),
    studentId: zod.string().optional()
});

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

// Signup endpoint
router.post("/signup", authLimiter, async (req, res) => {
    try {
        const { success, data } = signupSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data"
            });
        }
        
        // Check if user already exists
        const existingUser = await findUserByUsername(data.username);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists."
            });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        
        // Create user with email not verified by default
        const userData = {
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            password: hashedPassword,
            isEmailVerified: false,
            studentId: data.studentId || ''
        };
        
        // Save user to database
        await createUser(userData);
        
        // In a real app, you would send a verification email here
        // For testing, we'll auto-verify the email
        await updateUserVerificationStatus(data.username, true);
        
        res.status(201).json({
            success: true,
            message: "Registration successful!",
            user: {
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName
            }
        });
        
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during registration.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Signin endpoint
router.post("/signin", authLimiter, async (req, res) => {
    try {
        const { success, data } = signinSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input format. Please provide a valid email and password."
            });
        }

        // Find user by username (email)
        const user = await findUserByUsername(data.username);
        if (!user) {
            console.log('User not found:', data.username);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password. Please try again."
            });
        }
        
        // Check if email is verified - temporarily disabled for development
        // const isVerified = user.isEmailVerified === true || user.isEmailVerified === 'TRUE';
        // if (!isVerified) {
        //     return res.status(403).json({
        //         success: false,
        //         message: "Please verify your email address before logging in."
        //     });
        // }

        // Check if password hash exists
        const passwordHash = user.password || '';
        if (!passwordHash || passwordHash.trim() === '') {
            console.log('No password set for user:', data.username);
            return res.status(401).json({
                success: false,
                message: "No password set for this account. Please contact support."
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(data.password, passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password. Please try again."
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user.email,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                studentId: user.studentId
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token: token,
            user: {
                username: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                studentId: user.studentId
            },
            message: "Login successful"
        });

    } catch (error) {
        console.error("Error during signin:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred. Please try again later.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Update password endpoint
router.put("/update-password", authMiddlware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required."
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters long."
            });
        }
        
        // Get user from database
        const user = await findUserByUsername(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        
        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password || '');
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        
        // Update password in database
        await updateUserPassword(req.userId, hashedPassword);
        
        res.json({
            success: true,
            message: "Password updated successfully."
        });
        
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the password.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get current user's profile
router.get("/me", authMiddlware, (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                username: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                studentId: req.user.studentId
            }
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching your profile.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Logout endpoint
router.post("/logout", authMiddlware, (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        
        // Add the token to the blacklist
        addToBlacklist(token);
        
        res.json({
            success: true,
            message: "Successfully logged out"
        });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during logout"
        });
    }
});

// Admin endpoints (only in development)
if (process.env.NODE_ENV === 'development') {
    // Admin endpoint to set initial password (for testing/development only)
    router.post("/admin/set-password", async (req, res) => {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required."
                });
            }
            
            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            // Update the password in the database
            await updateUserPassword(email, hashedPassword);
            
            res.json({
                success: true,
                message: `Password for ${email} has been set successfully.`
            });
            
        } catch (error) {
            console.error("Error setting password:", error);
            res.status(500).json({
                success: false,
                message: "An error occurred while setting the password.",
                error: error.message
            });
        }
    });

    // Admin endpoint to create a new user
    router.post("/admin/create-user", async (req, res) => {
        try {
            const { username, password, firstName, lastName, studentId } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Username and password are required."
                });
            }
            
            // Check if user already exists
            const existingUser = await findUserByUsername(username);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "User with this email already exists."
                });
            }
            
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            // Create the user with the hashed password and auto-verify email
            const userData = {
                username,
                firstName: firstName || '',
                lastName: lastName || '',
                password: hashedPassword,
                isEmailVerified: true, // Auto-verify for admin-created users
                studentId: studentId || ''
            };
            
            console.log('Creating user with data:', userData);
            
            // Call createUser with the user data
            await createUser(userData);
            
            res.status(201).json({
                success: true,
                message: `User ${username} created successfully.`
            });
            
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({
                success: false,
                message: "An error occurred while creating the user.",
                error: error.message
            });
        }
    });
}

module.exports = router;
