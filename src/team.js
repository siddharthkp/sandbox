const user = require('./user');

let getUser = (token, callback) => user.get(token, (user) => callback(user));

let getTeam = (user, callback) => {
    let username = user.login;
    let query = `SELECT * from teams join team_members on teams.id = team_members.team_id WHERE team_members.username = '${username}' LIMIT 1`;
    db.query(query, (team) => callback(team));
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
            if (!team) res.render('team');
        });
    });

};

let save = (req, res) => res.render('team');

module.exports = {render, save};

