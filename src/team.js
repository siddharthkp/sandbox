const user = require('./user');
const btoa = require('btoa');

let getUser = (token, callback) => {
    let query = `SELECT * from users where token = '${token}' ORDER BY id DESC LIMIT 1`;
    db.query(query, (err, result) => {
        if (err) throw err;
        let user = result.rows[0];
        callback(user);
    });
};
//user.get(token, (user) => callback(user));

/* Get team for user */
let getTeam = (user, callback) => {
    if (!user) {
      callback(null);
      return;
    }
    let username = user.username;
    let query = `SELECT teams.id, teams.name, teams.track from teams join team_members on teams.id = team_members.team_id WHERE team_members.username = '${username}' LIMIT 1`;
    db.query(query, (err, result) => {
        if (err) throw err;
        let team = result.rows[0];
        callback(team);
    });
};

let getMembers = (team, callback) => {
    let query = `SELECT * from team_members JOIN users on team_members.username = users.username where team_id = ${team.id}`;
    db.query(query, (err, results) => {
        if (err) throw err;
        let members = results.rows;
        callback(members);
    });
};

let getInviteLink = (team, req) => {
    let host = req.get('host');
    let salt = 'teamid';
    let hash = btoa(`${salt}${team.id}`);
    return `${host}/join/${hash}`;
};

let render = (req, res) => {

    /*
     * Get user
     * Get team for the user
     * Get members for that team
     */

    getUser(req.cookies.token, (user) => {
        getTeam(user, (team) => {
            if (!team) {
                team = {};
                res.render('team', {team, user});
            } else {
                getMembers(team, (members) => {
                    team.members = members;
                    team.inviteLink = getInviteLink(team, req);
                    res.render('team', {team, user});
                });
            }
        });
    });

};

let addMember = (team_id, user, callback) => {
    let username = user.username;
    let query = `INSERT INTO team_members (team_id, username) VALUES (${team_id}, '${username}')`;
    db.query(query, (err, results) => {
        if (err) throw err;
        callback();
    });
};

let create = (name, user, res) => {
    let username = user.username;
    let query = `INSERT INTO teams (name) VALUES ('${name}') RETURNING id`;
    db.query(query, (err, results) => {
        if (err) throw err;
        let id = results.rows[0].id;
        addMember(id, user, () => res.end('Created'));
    });
};

let update = (name, track, team, res) => {
    name = name.replace(/\'/g, '\'\''); // Handling single quotes
    let query = `UPDATE teams SET name = '${name}', track = '${track}' WHERE id = ${team.id}`;
    db.query(query, (err, result) => {
        if (err) throw err;
        res.end('Saved');
    });
};

let save = (req, res) => {
    let name = req.body.name;
    let track = req.body.track || '';
    getUser(req.cookies.token, (user) => {
        getTeam(user, (team) => {
            if (!team) create(name, user, res);
            else update(name, track, team, res);
        });
    });
};

let leave = (req, res) => {
    getUser(req.cookies.token, (user) => {
        let query = `DELETE from team_members WHERE username = '${user.username}'`;
        db.query(query, (err, result) => {
            if (err) throw err;
            res.redirect('/team');
        });
    });
};

let join = (req, res) => {
    if (req.cookies.token) res.redirect(`/?intent=${req.url}`);
    /*else getUser(req.cookies.token, (user) => {
        getTeam(user, (team) => {
            if (!team) create(name, user, res);
            else update(name, track, team, res);
        });
    });
    res.render('join', {team, user});
    */
};

module.exports = {render, save, leave, join};
