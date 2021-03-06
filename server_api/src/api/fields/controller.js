const sqlite = require('sqlite3')
const config = require('../../config')
const { token_mode } = require('../../middlewares/token')

const db = new sqlite.Database(config.databaseFile)

const getAll = (req, res, next) => {
    var sql = "select * from fields"
    var params = []
    db.all(sql, params, (err, rows) => {
        if(err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows)
    });
}

const getById = (req, res, next) => {
    var sql = "select * from fields where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(row)
    });
}

const create = (req, res, next) => {
    var errors = []
    if(!req.body.name) {
        errors.push("No name specified");
    }
    if(!req.body.address) {
        errors.push("No address specified");
    }
    if(errors.length) {
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    var data = {
        name: req.body.name,
        address: req.body.address
    }
    var sql = 'INSERT INTO fields (name, address) VALUES (?,?)'
    var params = [data.name, data.address]
    db.run(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({"error":err.message})
            return;
        }
        res.json ({
            "name": data.name,
            "address": data.address,
            "id": this.lastID
        })
    });
}

const update = (req, res, next) => {
    var data = {
        name: req.body.name,
        address: req.body.address
    }
    db.run(     // COALESCE - wybiera pierwszy nie null parametr - zapobiega przypisaniu pustych pól
        `UPDATE fields SET
            name = COALESCE(?,name),    
            address = COALESCE(?, address)
            WHERE id = ?`,
        [data.name, data.address, req.params.id],
        (err,result) => {
            if(err) {
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
        });
}

const remove = (req, res, next) => {
    db.run('DELETE FROM fields WHERE id = ?', req.params.id, function (err, result) {
        if(err) {
            res.status(400).json({"error": err.message})
            return;
        }
        console.log("removing field id: " + req.params.id);
        res.json({"message": "deleted", changes: this.changes})
    });
}

module.exports = { getAll, getById, create, update, remove };