const { Router } = require('express')
const sqlite = require('sqlite3')
const config = require('../../config')
const { token_mode } = require('../../middlewares/token')

const router = Router()
const db = new sqlite.Database(config.databaseFile)

router.get('/', (req, res, next) => {
    const sql = "SELECT * FROM reservations";
    db.all(sql, [], (err, rows) => {
        if(err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows)
    });
});

router.get('/:id', (req, res, next) => {
    const sql = "SELECT * FROM reservations where id = ?"
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
    if(!req.body.user_id) {
        errors.push("No user_id specified")
    }
    if(!req.body.field_id) {
        errors.push("No field_id specified")
    }
    if(!req.body.date) {
        errors.push("No date specified")
    }
    if(!req.body.hour) {
        errors.push("No hour specified")
    }
    if(errors.length) {
        res.status(400).json({"error": errors.join(', ')});
        return;
    }

    const data = {
        user_id: req.body.user_id,
        field_id: req.body.field_id,
        date: req.body.date,
        hour: req.body.hour
    }
    const sql = 'INSERT INTO reservations (user_id, field_id, date, hour) VALUES (?, ?, ?, ?)'
    const params = [data.user_id, data.field_id, data.date, data.hour]
    db.run(sql, params, function (err, result) {
        if(err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "user_id": data.user_id,
            "field_id": data.field_id,
            "date": data.date,
            "hour": data.hour,
            "id": this.lastID
        })
    });
})

router.put("/:id", token_mode, (req, res, next) => {
    const data = {
        user_id: req.body.user_id,
        field_id: req.body.field_id,
        date: req.body.date,
        hour: req.body.hour
    }

    db.run(
        `UPDATE reservations SET
            user_id = COALESCE(?, user_id),
            field_id = COALESCE(?, field_id),
            date = COALESCE(?, date),
            hour = COALESCE(?, hour),
            WHERE id = ?`,
        [data.user_id, data.field_id, data.date, data.hour, req.params.id],
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


router.delete("/:id", token_mode,(req, res, next) => {
    db.run(
        'DELETE FROM reservations WHERE id = ?',
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