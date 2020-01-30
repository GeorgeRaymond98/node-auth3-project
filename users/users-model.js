const db = require('../database/dbConfig')

module.exports = {
    get,
    getBy,
    getById,
    insert
}

function get() {
    return db('users')
    .select('id', 'username', 'password')
}

function getBy(filter) {
    return db('users')
    .where(filter)
}

function getById(id) {
    return db('users')
    .where({ id })
    .first();
}

function insert(user) {
    return db('users')
    .insert( user, 'id')
    .then(ids => {
        const [id] = ids;
        return getById(id)
    })
}