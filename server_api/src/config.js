
const config = {
    env: process.env.NODE_ENV || 'development',
    port: 3000,
    ip: '127.0.0.1',
    apiRoot: '/api', // http://localhost:3000/api/
    databaseFile: './server_db',
    jwtExpiration:'30d'
}

module.exports = config