if (!process.env.production) require('dotenv').config();
const github = require('./github');

let get = (token, callback) => {
    github.user(token, (user) => {
        callback(JSON.parse(user));
    });
};

let save = () => {

};

let auth = (req, res) => {
    let code = req.query.code;
    github.token(code, (token) => {
        let week = 7 * 24 * 60 * 60 * 1000; //milliseconds
        res.cookie('token', token, {maxAge: week});
        github.user(token, (user) => {
            user = JSON.parse(user);
            let github_id = user.id;
            let username = user.login;
            let name = user.name;
            let email = user.email;
            let query = `INSERT INTO users (github_id, username, token, name, email) VALUES('${github_id}', '${username}', '${token}', '${name}', '${email}')`;
            db.query(query, (err, result) => {
                if (err) throw err;
                res.redirect('/team');
            });
        });
    });
};

module.exports = {get, save, auth};
