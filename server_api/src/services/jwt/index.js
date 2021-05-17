const jwt = require("jsonwebtoken")
const config = require("../../config")

const sign = (user) => {
    const options = {
        expiresIn: config.jwtExpiration
    };
    
    return jwt.sign({
        email: user.email,
        id: user.id,
        role: user.role
    }, process.env.JWT_SECRET, options)
}

module.exports = { sign };
