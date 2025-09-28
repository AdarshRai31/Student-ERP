const nodemailer = require('nodemailer');
const { JWT_SECRET, EMAIL_SERVICE, EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_FROM, APP_URL } = require('../config');
const jwt = require('jsonwebtoken');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE || 'gmail',
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    }
});

/**
 * Generate an email verification token
 * @param {string} email - User's email address
 * @returns {string} JWT token for email verification
 */
function generateVerificationToken(email) {
    return jwt.sign(
        { email, purpose: 'email-verification' },
        JWT_SECRET,
        { expiresIn: '24h' } // Token expires in 24 hours
    );
}

/**
 * Send a verification email to the user
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient's name
 * @returns {Promise<Object>} Result of the email sending operation
 */
async function sendVerificationEmail(to, name) {
    try {
        const token = generateVerificationToken(to);
        const verificationUrl = `${APP_URL}/verify-email?token=${token}`;
        
        const mailOptions = {
            from: `"Student ERP" <${EMAIL_FROM || EMAIL_USERNAME}>`,
            to,
            subject: 'Verify Your Email Address',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Welcome to Student ERP, ${name}!</h2>
                    <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${verificationUrl}" 
                           style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
                                  color: white; text-decoration: none; border-radius: 4px;">
                            Verify Email Address
                        </a>
                    </div>
                    <p>Or copy and paste this link into your browser:</p>
                    <p>${verificationUrl}</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't create an account, you can safely ignore this email.</p>
                    <p>Best regards,<br>The Student ERP Team</p>
                </div>
            `
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
}

/**
 * Verify the email verification token
 * @param {string} token - JWT token from the verification link
 * @returns {Object} Decoded token payload if valid
 */
function verifyEmailToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.purpose !== 'email-verification') {
            throw new Error('Invalid token purpose');
        }
        return { success: true, email: decoded.email };
    } catch (error) {
        console.error('Error verifying email token:', error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    sendVerificationEmail,
    verifyEmailToken
};
