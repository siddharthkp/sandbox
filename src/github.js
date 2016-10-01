if (!process.env.production) require('dotenv').config();
const request = require('request');

const client_id = process.env.GITHUB_ID;
const client_secret = process.env.GITHUB_SECRET;

let token = (code, callback) => {
    let options = {
        url:'https://github.com/login/oauth/access_token',
        headers: {
            'Accept': 'application/json'
        },
        form: {
            client_id,
            client_secret,
            code,
            scope: 'user'
        }
    };
    request.post(options, (err, httpResponse, body) => {
        let token = JSON.parse(body).access_token;
        callback(token);
    });
};

let user = (token, callback) => {
    let options = {
        url: 'https://api.github.com/user?access_token=' + token,
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'cronduty'
        }
    };
    request.get(options, (err, httpResponse, body) => {
        callback(body);
    });
};

module.exports = {user, token}
