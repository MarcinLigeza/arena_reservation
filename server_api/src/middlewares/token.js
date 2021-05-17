const jwt = require('jsonwebtoken')
const config = require("../config")
const { getOneByEmail } = require('../api/users/model')

const check_token = (req, res, next, roles) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {maxAge: config.jwtExpiration});

        getOneByEmail(decoded.email, (err, row) => {
            if(err) {
                res.status(400).json({"error":err.message});
                return;
            }
            if (typeof(row) == 'undefined') {
                console.log("row is undefined ");
                res.status(400).json({"error":"cannot get inforamtion about user from database"});
                return;
            }
            if (decoded.role != row.role){
                res.status(401).json("Uprawnienia użytkownika zostały zmienione, " +
                    "proszę zalogować się ponownie").end();
                return;
            }
            if (roles.indexOf(row.role) >= 0) {
                req.user = {id: decoded.id, role: decoded.role};
                next();
            } else {
                console.error("User nie ma uprawnień administratora");
                res.status(401).json({"Error":"Uzytkownik nie ma uprawnień administratora"}).end()
            }
        })
    } catch (error) {
        console.error(`Użyto niepoprawny token: ${req.headers.authorization}`);
        res.status(401).end()
    }
}

const token_user = (req, res, next) => {
    check_token(req, res, next, ['user', 'mode', 'admin']);
};

const token_mode = (req, res, next) => {
    check_token(req, res, next, ['mode', 'admin']);
};

const token_admin = (req, res, next) => {
    check_token(req, res, next, ['admin']);
};

module.exports = {token_mode, token_admin, token_user};