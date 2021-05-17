const sqlite = require('sqlite3')
const config = require('../../config')

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

const getWhere = (param, values, res) => {
    const sql = "SELECT * FROM reservations WHERE " + param + " = ?";
    db.get(sql, values, (err, row) => {
        if(err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(row)
    });
}

const getById = (req, res, next) => {
    getWhere('id', [req.params.id], res);
}

const getByFieldId = (req, res, next) => {
    getWhere('field_id', [req.params.id], res);
}

const getByDate = (req, res, next) => {
    getWhere('date', [req.params.id], res);
}

const getByUsername = (req, res, next) => {
    const sql = `SELECT reservations.id, users.email, fields.name, fields.address, reservations.date, reservations.hour
                from reservations 
                INNER JOIN users ON reservations.user_id = users.id
                INNER JOIN fields ON reservations.field_id = fields.id
                WHERE users.email = ?`;
    db.all(sql, [req.params.username], (err, rows) => {
        if(err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json(rows)
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
                console.log("error while deleting");
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
        });
}

module.exports = { getAll, getById, create, update, remove, getByFieldId, getByDate, getByUsername };