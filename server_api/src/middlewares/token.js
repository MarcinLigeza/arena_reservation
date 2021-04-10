const jwt = require('jsonwebtoken')
const config = require("../config")
const { getOneById } = require('../api/users/model')

// Jeśli użytkownik jest w bazie to nie trzeba sprawdzać czy ma jakiekolwiek uprawnienia

const token_mode = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {maxAge: config.jwtExpiration});

        //TO DO: sprawdzanie czy user jest w bazie i ma te same uprawnienia
        getOneById(decoded.id, (err, row) => {
            if(err) {
                res.status(400).json({"error":err.message});
                return;
            }
            if (decoded.role != row.role){
                res.status(401).json("Uprawnienia użytkownika zostały zmienione, " +
                                     "proszę zalogować się ponownie").end();
                return;
            }
            if( row.role == 'mode' || row.role == 'admin') {
                req.user = {id: decoded.id, role: decoded.role};
                next();
            } else {
                console.error("User nie ma uprawnień moderatora");
                res.status(401).json("Uzytkownik nie ma uprawnień moderatora").end();
                return;
            }
        })
    } catch (error) {
        console.error(`Użyto niepoprawny token: ${req.headers.authorization}`);
        res.status(401).end()
    }
};

const token_admin = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {maxAge: config.jwtExpiration});

        //TO DO: sprawdzanie czy user ma te same uprawnienia co w bazie
        getOneById(decoded.id, (err, row) => {
            if(err) {
                res.status(400).json({"error":err.message});
            }
            if (decoded.role != row.role){
                res.status(401).json("Uprawnienia użytkownika zostały zmienione, " +
                    "proszę zalogować się ponownie").end();
                return;
            }
            if(row.role == 'admin') {
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
};

module.exports = {token_mode, token_admin};