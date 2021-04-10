console.log("Starting Server");

const config = require('./config')
const sqlDatabase = require('./services/sqlite')

let db = new sqlDatabase(config.databaseFile)

let email = "latifi@gmail.com"
let password = "dsaaasdf"
let role = "mode"

// db.run(`INSERT INTO users (email, password, role)
//             VALUES (?, ?, ?)`,
//             [email, password, role])

// db.run(`DELETE FROM users WHERE id = ?`,
//         [3])

// db.all('SELECT * FROM users').then((users) => {
//     console.log(users)
// })

module.exports = require('./app')