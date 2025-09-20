const express = require("express");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../config");
const { authMiddlware } = require("../middlewares");
const { findUserByUsername, createUser, updateUserPassword } = require("../goggle_apis/sheets");

const router = express.Router();
const saltRounds = 10;

const signupSchema = zod.object({
	username: zod.string().email(),
	password: zod.string(),
	firstName: zod.string(),
	lastName: zod.string(),
}) 
// user signin schema
const signinBody = zod.object({
	username: zod.string().email(),
	password: zod.string()
})

router.post("/signup", async (req, res) => {
	const { success, data } = signupSchema.safeParse(req.body);
	if (!success) {
		return res.status(411).json({
			message: "Incorrect inputs"
		});
	}

	try {
		const existingUser = await findUserByUsername(data.username);

		// Check if user exists in the database
		if (!existingUser) {
			return res.status(404).json({
				message: "Email not found in our records. Please contact administrator."
			});
		}

		// Check if user already has a password set
		if (existingUser.password && existingUser.password.trim() !== '') {
			return res.status(409).json({
				message: "Account already registered. Please sign in instead."
			});
		}

		const hashedPassword = await bcrypt.hash(data.password, saltRounds);

		// Update existing user with password instead of creating new user
		await updateUserPassword(data.username, hashedPassword);

		// Using the username as the unique identifier for the token payload
		const token = jwt.sign({
			userId: data.username 
		}, JWT_SECRET);

		res.json({
			message: "Account registered successfully",
			token: token,
			user: {
				username: existingUser.username,
				firstName: existingUser.firstName,
				lastName: existingUser.lastName
			}
		});

	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error while signing up." });
	}
});

// signin 
router.post("/signin", async (req, res) => {
	const { success } = signinBody.safeParse(req.body);
	if(!success) {
		return res.status(411).json({
			message: "Incorrect inputs"
		});
	}

	try {
		const user = await findUserByUsername(req.body.username);

		if (user && await bcrypt.compare(req.body.password, user.password)) {
			const token = jwt.sign({
				userId: user.username
			}, JWT_SECRET);
			return res.json({ token });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error while signing in." });
	}

	res.status(411).json({
		message: "Error while logging in"
	})
})

// get current user
router.get('/me', authMiddlware, async (req, res) => {
	try {
		const user = await findUserByUsername(req.userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		return res.json({
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error while fetching user.' });
	}
});

module.exports = router;