const sqlite = require('sqlite3')
const config = require('../../config')
const { token_mode, token_user } = require('../../middlewares/token')

const db = new sqlite.Database(config.databaseFile)

const getAll = (req, res, next) => {
    const table = 'reservations'
    const sql = "SELECT * FROM " + table;
    db.all(sql, [], (err, rows) => {
        if(err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows)
    });
}

const getById = (req, res, next) => {
    const sql = "SELECT * FROM reservations WHERE id = ?"
    const params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(row)
    });
}

const getByFieldId = (req, res, next) => {
    const sql = "SELECT * FROM reservations WHERE field_id = ?"
    const params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(row)
    });
}

const getByDate = (req, res, next) => {
    const sql = "SELECT * FROM reservations WHERE date = ?"
    const params = [req.params.date]
    db.get(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(row)
    });
}

const create = (req, res, next) => {
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
    db.run(sql, params, (err, result) => {
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
}

const update = (req, res, next) => {
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
        (err, result) => {
            if(err) {
                res.status(400).json({"error":err.message});
                return;
            }
            res.json({
                message: "success",
                changes: this.changes
            })
        });
}

const remove = (req, res, next) => {
    db.run(
        'DELETE FROM reservations WHERE id = ?',
        req.params.id,
        (err,result) => {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
        });
}

module.exports = { getAll, getById, create, update, remove, getByFieldId, getByDate };