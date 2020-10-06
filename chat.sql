DROP TABLE IF EXISTS chat;

CREATE TABLE chat (
id SERIAL PRIMARY KEY,
userid INT REFERENCES users(id) NOT NULL,
message VARCHAR NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- add 3 test messages at the end of this file
INSERT INTO chat (userid, message) VALUES (
    1,
  'brings back back back .....'
);
INSERT INTO chat (userid, message) VALUES (
    2,
    'This chat brings back so many great memories.'
);
INSERT INTO chat (userid, message) VALUES (
    1,
    '....so many great memories.'
);