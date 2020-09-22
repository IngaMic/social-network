const spicedPg = require("spiced-pg");
var db = spicedPg(process.env.DATABASE_URL || 'postgres:postgres:postgres@localhost:5432/users');

module.exports.registerUser = (first, last, email, password) => {
    return db.query(`
    INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4) RETURNING id `, [first, last, email, password]
    );
};
module.exports.getLogin = (email) => {
    return db.query(`
        SELECT * FROM users WHERE email = ($1)`, [email]
    );
};