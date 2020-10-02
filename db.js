const spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/users"
);

module.exports.registerUser = (first, last, email, password) => {
    return db.query(
        `
    INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4) RETURNING id `,
        [first, last, email, password]
    );
};
module.exports.getUser = (userId) => {
    return db.query(
        `SELECT * FROM users 
    WHERE id = ($1)
    `,
        [userId]
    );
};
module.exports.getLogin = (email) => {
    return db.query(
        `
        SELECT * FROM users WHERE email = ($1)`,
        [email]
    );
};

module.exports.addCode = (email, code) => {
    //maybe use timestamp here
    return db.query(
        `
    INSERT INTO codes (email, code)
    VALUES ($1, $2) RETURNING * `,
        [email, code]
    );
};

module.exports.getCode = (email) => {
    return db.query(
        `
        SELECT * FROM codes WHERE email = ($1) AND
        CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
        ORDER BY created_at DESC LIMIT 1`,
        [email]
    );
};

module.exports.updatePassword = (email, password) => {
    return db.query(
        `UPDATE users
    SET password = ($2)
    WHERE email = ($1) RETURNING *
    `,
        [email, password]
    );
};

module.exports.updateImage = (imageUrl, userId) => {
    return db.query(
        `UPDATE users
    SET imageUrl = ($1)
    WHERE id = ($2) RETURNING *
    `,
        [imageUrl, userId]
    );
};

module.exports.updateBio = (bio, userId) => {
    return db.query(
        `UPDATE users
    SET bio = ($1)
    WHERE id = ($2) RETURNING *
    `,
        [bio, userId]
    );
};

module.exports.getUsers = () => {
    return db.query(
        `SELECT id, first, last, imageurl, bio FROM users 
    ORDER BY id DESC LIMIT 3
    `
    );
};

module.exports.getUserSearch = (val) => {
    return db.query(
        `SELECT id, first, last, imageurl, bio FROM users
         WHERE first ILIKE $1
        LIMIT 5 `,
        [val + "%"]
    );
};

module.exports.checkFriendship = (otherId, userId) => {
    return db.query(
        `
       SELECT * FROM friendships
  WHERE (recipient_id = ($1) AND sender_id = ($2))
  OR (recipient_id = ($2) AND sender_id = ($1))`,
        [otherId, userId]
    );
};
module.exports.addFriendRequest = (otherId, userId) => {
    return db.query(
        `
        INSERT INTO friendships (recipient_id, sender_id)
    VALUES ($1, $2) RETURNING *`,
        [otherId, userId]
    );
};
module.exports.friendshipUpdate = (otherId, userId) => {
    return db.query(
        `UPDATE friendships
    SET accepted = true
    WHERE recipient_id = ($2) AND sender_id = ($1)
    RETURNING *
    `,
        [otherId, userId]
    );
};
module.exports.endFriendship = (otherId, userId) => {
    return db.query(
        `
        DELETE FROM friendships
        WHERE (recipient_id = ($1) AND sender_id = ($2))
  OR (recipient_id = ($2) AND sender_id = ($1))`,
        [otherId, userId]
    );
};

module.exports.getFriends = (userId) => {
    return db.query(
        `
  SELECT users.id, first, last, imageurl, accepted
  FROM friendships
  JOIN users
  ON (accepted = false AND recipient_id = ($1) AND sender_id = users.id)
  OR (accepted = true AND recipient_id = ($1) AND sender_id = users.id)
  OR (accepted = true AND sender_id = ($1) AND recipient_id = users.id)
`,
        [userId]
    );
};
