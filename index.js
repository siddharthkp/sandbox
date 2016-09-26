if (!process.env.production) {
    require('dotenv').config();
}

const express = require('express');
const pug = require('pug');

const app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => res.render('home', {client_id: process.env.CLIENT_ID}));

app.get('/team', (req, res) => res.render('team'));
app.get('/auth', (req, res) => res.redirect('/team'));

app.listen(process.env.PORT);

