# sandbox V



* Code to bootup SQL
```
create table teams (id serial NOT NULL PRIMARY KEY, name varchar, track varchar);
create table users (id SERIAL NOT NULL PRIMARY KEY, github_id varchar, username varchar, token varchar, name varchar, email varchar, tshirt varchar);
create table team_members (id SERIAL NOT NULL PRIMARY KEY, team_id int, username varchar);
```
