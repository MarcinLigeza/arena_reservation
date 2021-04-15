console.log("Starting Server");

const config = require('./config')
const sqlDatabase = require('./services/sqlite')

let db = new sqlDatabase(config.databaseFile)

module.exports = require('./app')