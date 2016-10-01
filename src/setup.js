if (!process.env.production) require('dotenv').config();
const pg = require('pg');

let database;

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, (err, client) => {
    if (err) throw err;
    database = client;

    let query = 'SELECT * FROM pg_catalog.pg_tables';
    database.query(query, (err, result) => {
        if (err) throw err;
        console.log(result);
    });

    let query = 'CREATE TABLE users(ID INT PRIMARY KEY NOT NULL)';
    database.query(query, (err, result) => {
        if (err) throw err;
        console.log(result);
    });


});
