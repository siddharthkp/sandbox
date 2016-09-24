if (!process.env.production) {
    require('dotenv').config();
}

require('babel-register');

const express = require('express');
const React = require('react');
const ReactDOM = require('react-dom/server');
const pug = require('pug');

const app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(process.env.PORT);

