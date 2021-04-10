const { Router } = require('express')
const sqlite = require('sqlite3')
const config = require('../../config')
const bcrypt = require('bcrypt')
const { token_admin } = require('../../middlewares/token')

const router = Router()
const db = new sqlite.Database(config.databaseFile)

const rounds = 10;

router.get('/', (req, res, next) => {
    const sql = "SELECT id, email, role FROM users";
    const params = []
    db.all(sql, params, (err,rows) => {
        if(err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows)
    });
});

router.get('/:id', (req, res, next) => {
    const sql = "SELECT id, email, role FROM users where id = ?"
    const params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(row)
    });
});

router.post('/', (req, res, next) => {
    let errors = []
    if(!req.body.password){
        errors.push("No password specified");
    }
    if(!req.body.email) {
        errors.push("No email specified");
    }
    if(errors.length) {
        res.status(400).json({"error": errors.join(', ')});
        return;
    }

    const data = {
        email: req.body.email,
        role: 'user',
        password: bcrypt.hashSync(req.body.password, rounds)
    }
    const sql = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)'
    const params = [data.email, data.password, data.role]
    db.run(sql, params, function (err, result) {
        if(err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "email": data.email,
            "role": data.role,
            "id": this.lastID
        })
    });
})

router.put("/:id", token_admin, (req, res, next) => {
    const data = {
        email: req.body.email,
        role: req.body.role,
        password: req.body.password ? bcrypt.hashSync(req.body.password, rounds) : null
    }

    db.run(
        `UPDATE users SET
            email = COALESCE(?,email),
            role = COALESCE(?,role),
            password = COALESCE(?,password)
            WHERE id = ?`,
        [data.email, data.role, data.password, req.params.id],
        function (err, result) {
            if(err) {
                res.status(400).json({"error":err.message});
                return;
            }
            res.json({
                message: "success",
                changes: this.changes
            })
    });
})

router.delete("/:id", token_admin, (req, res, next) => {
    db.run(
        'DELETE FROM users WHERE id = ?',
        req.params.id,
        function (err,result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

module.exports = router