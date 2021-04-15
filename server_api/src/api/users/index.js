const { Router } = require('express')
const { token_admin, token_user } = require('../../middlewares/token')

const { getAll, getById, create, update, remove } = require('./controller')

const router = Router()

router.get('/', token_user, getAll );

router.get('/:id', token_user, getById );

router.post('/', create );

router.put("/:id",
    token_admin,
    update
);

router.delete("/:id",
    token_admin,
    remove
);

module.exports = router