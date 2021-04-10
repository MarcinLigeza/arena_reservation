const { Router } = require('express')
const { token_user, token_mode } = require('../../middlewares/token')
const { getAll, getById, create, update, remove } = require('./controller')

const router = Router()

router.get('/',
    token_user,
    getAll);

router.get('/:id',
    token_user,
    getById);

router.post('/',
    token_mode,
    create);

router.put('/:id',
    token_mode,
    update);

router.delete('/:id',
    token_mode,
    remove);

module.exports = router