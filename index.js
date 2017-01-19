if (!process.env.production) {
    require('dotenv').config();
}

const express = require('express');
const pug = require('pug');

const user = require('./src/user');
const team = require('./src/team');

const app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/static'));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

const database = require('./src/database');
database.get((connection) => {
    global.db = connection;
    app.listen(process.env.PORT, () => console.log('App is active'));
});

app.get('*', (req, res) => res.render('home'));

