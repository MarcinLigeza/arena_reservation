const {Router} = require('express')
const fields = require('./fields')
const users = require('./users')
const reservations = require('./reservations')
const auth = require('./auth')

const router = Router()
router.use('/fields', fields)
router.use('/users', users)
router.use('/reservations', reservations)
router.use('/auth', auth)

module.exports = router
