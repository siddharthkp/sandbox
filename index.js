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

app.get('/', (req, res) => res.render('home', {client_id: process.env.GITHUB_ID}));

app.get('/team', team.render);
app.post('/team', team.save);

app.get('/auth', user.auth);

app.listen(process.env.PORT);

