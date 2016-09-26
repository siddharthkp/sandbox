const pg = require('pg');

let database;

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, (err, client) => {
    if (err) throw err;
    database = client;
});

let get = () => {
    
};

let save = () => {

};

module.exports = {get, save};

