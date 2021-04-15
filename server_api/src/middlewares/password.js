const {getOneByEmail, authenticate} = require("../api/users/model");

module.exports = (req,res, next) => {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({message: 'Missing Authorization Header'});
    }

    const base64Credentails = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentails, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');
    console.log("logging")

    getOneByEmail(email, (err, row) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }

        if (authenticate(password, row)) {
            delete row['password'];
            req.user = row;
            next();
        } else {
            res.status(400).json({"error":"wrong email or password"});
            return;
        }
    })

}