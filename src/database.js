if (!process.env.production) require('dotenv').config();
const pg = require('pg');

let get = (callback) => {
    let database;

    pg.defaults.ssl = true;
    pg.connect(process.env.DATABASE_URL, (err, client) => {
        if (err) throw err;
        callback(client);
    });
};

module.exports = {get};

