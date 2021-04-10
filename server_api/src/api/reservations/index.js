const { Router } = require('express')
const sqlite = require('sqlite3')
const config = require('../../config')
const { token_mode, token_user } = require('../../middlewares/token')
const { getAll, getById, create, update, remove, getByFieldId, getByDate } = require('./controller')

const router = Router()
const db = new sqlite.Database(config.databaseFile)

router.get('/',
    token_user,
    getAll);

router.get('/:id',
    token_user,
    getById);

router.get('/byfield/:id',
    token_user,
    getByFieldId)

router.get('/bydate/:date',
    token_user,
    getByDate)

router.post('/',
    token_user,
    create)

router.put("/:id",
    token_mode,
    update)

router.delete("/:id",
    token_mode,
    remove)

module.exports = router