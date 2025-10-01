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
});

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
});
// signup 
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
            isEmailVerified: false,  // Email not verified yet
            studentId: data.studentId || ''
        };
        
        // Save user to database
        await createUser(userData);
        
        // Send verification email
        await sendVerificationEmail(data.username, `${data.firstName} ${data.lastName}`);
        
        res.status(201).json({
            success: true,
            message: "Registration successful! Please check your email to verify your account.",
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

	try {
		const existingUser = await findUserByUsername(data.username);

		// Check if user exists in the database
                message: "Invalid input format. Please provide a valid email and password."
            });
        }

        console.log('Looking up user:', data.username);
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
        // if (!user.isEmailVerified) {
        //     return res.status(403).json({
        //         success: false,
        //         message: "Please verify your email address before logging in. Check your email for a verification link."
        //     });
        // }

        // Log the user object to see what we're working with
        console.log('User data from sheet:', user);
        
        // Check if password hash exists
        const passwordHash = user.password || '';
        if (!passwordHash || passwordHash.trim() === '') {
            console.log('No password set for user:', data.username);
            return res.status(401).json({
                message: "No password set for this account. Please contact support."
            });
        }

        console.log('Comparing passwords...');
        const isPasswordValid = await bcrypt.compare(data.password, passwordHash);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password. Please try again."
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user.email,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login successful for user:', user.email);
        
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
        // The authMiddlware adds the user to req.user
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

// Admin endpoint to create a new user
if (process.env.NODE_ENV === 'development') {
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
            
            // Create the user with the hashed password
            const userData = {
                username,
                firstName: firstName || '',
                lastName: lastName || '',
                password: hashedPassword
            };
            
            // If studentId is provided, add it to the user data
            if (studentId) {
                userData.studentId = studentId;
            }
            
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

// Admin endpoint to set initial password (for testing/development only)
if (process.env.NODE_ENV === 'development') {
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
}

/**
 * @swagger
 * /api/v1/user/logout:
 *   post:
 *     summary: Log out the current user
 *     description: Invalidates the current authentication token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully logged out"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
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

module.exports = router;