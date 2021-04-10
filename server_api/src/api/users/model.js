const sqlite = require('sqlite3')
const config = require('../../config')
const bcrypt = require('bcrypt')

const db = new sqlite.Database(config.databaseFile)

const rounds = 10;

const getOneByEmail =  (email, callback) => {
    sql = 'SELECT * FROM users where email = ?'
    const params = [email]
    db.get(sql, params, callback);
}

const getOneById = (id, callback) => {
    sql = 'SELECT * FROM users where id = ?'
    const params = [id]
    db.get(sql, params, callback);
}

const authenticate = (password, user) => {
    console.log("authenticating")
    console.log(password)
    console.log(user)
    return bcrypt.compare(password, user.password).then((valid) => valid ? user : false)
}

module.exports = { authenticate, getOneByEmail, getOneById};