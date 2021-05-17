const { Router } = require('express')
const { token_mode, token_user } = require('../../middlewares/token')
const { getAll, getById, create, update, remove, getByFieldId, getByDate, getByUsername } = require('./controller')

const router = Router()

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

router.get('/byusername/:username',
    token_user,
    getByUsername)

router.post('/',
    token_user,
    create)

router.put("/:id",
    token_mode,
    update)

router.delete("/:id",
    token_user,
    remove)

module.exports = router