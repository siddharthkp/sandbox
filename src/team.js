const user = require('./user');

let getUser = (token, callback) => user.get(token, (user) => callback(user));

let getTeam = (user, callback) => {
    let username = user.login;
    let query = `SELECT teams.id, teams.name from teams join team_members on teams.id = team_members.team_id WHERE team_members.username = '${username}' LIMIT 1`;
    db.query(query, (err, result) => {
        if (err) throw err;
        let team = result.rows[0];
        callback(team);
    });
};

let getMembers = (team, callback) => {
    let query = `SELECT * from team_members where team_id = ${team.id}`;
    db.query(query, (members) => callback(members));
};

let render = (req, res) => {

    /*
     * Get user
     * Get team for the user
     * Get members for that team
     */

    getUser(req.cookies.token, (user) => {
        getTeam(user, (team) => {
            if (!team) team = {};
            res.render('team', {team});
        });
    });

};

let addMember = (team_id, user, callback) => {
    let username = user.login;
    let query = `INSERT INTO team_members (team_id, username, owner) VALUES (${team_id}, '${username}', true)`;
    db.query(query, (err, results) => {
        if (err) throw err;
        callback();
    });
};

let create = (name, user, res) => {
    let username = user.login;
    let query = `INSERT INTO teams (name) VALUES ('${name}') RETURNING id`;
    db.query(query, (err, results) => {
        if (err) throw err;
        let id = results.rows[0].id;
        addMember(id, user, () => res.end('Saved'));
    });
};

let update = (name, team, res) => {
    name = name.replace(/\'/g, '\'\''); // Handling single quotes
    query = `UPDATE teams SET name = '${name}' WHERE id = ${team.id}`;
    db.query(query, (err, result) => {
        if (err) throw err;
        res.end('Saved');
    });
};

let save = (req, res) => {
    let name = req.body.name;
    getUser(req.cookies.token, (user) => {
        getTeam(user, (team) => {
            if (!team) create(name, user, res);
            else update(name, team, res);
        });
    });
};

module.exports = {render, save};

