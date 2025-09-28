// In-memory token blacklist
// In a production environment, consider using Redis or a database for this
const blacklist = new Set();

/**
 * Add a token to the blacklist
 * @param {string} token - The JWT token to blacklist
 * @param {number} expiresIn - Token expiration time in seconds (default: 24 hours)
 */
function addToBlacklist(token, expiresIn = 24 * 60 * 60) {
    blacklist.add(token);
    
    // Automatically remove the token from the blacklist after it expires
    setTimeout(() => {
        blacklist.delete(token);
    }, expiresIn * 1000); // Convert to milliseconds
}

/**
 * Check if a token is blacklisted
 * @param {string} token - The JWT token to check
 * @returns {boolean} True if the token is blacklisted, false otherwise
 */
function isBlacklisted(token) {
    return blacklist.has(token);
}

module.exports = {
    addToBlacklist,
    isBlacklisted
};
