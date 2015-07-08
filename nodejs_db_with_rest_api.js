var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/db01');

db.serialize(function() {

    db.run("CREATE TABLE IF NOT EXISTS contacts_tbl" +
    "(  id INTEGER PRIMARY KEY NOT NULL," +
    "   name CHAR(50) NOT NULL," +
    "   phone_number CHAR(11) NOT NULL," +
    "   email_address CHAR(50) NOT NULL" +
    ")");

    db.run("CREATE TABLE IF NOT EXISTS news_tbl" +
    "(  id INTEGER PRIMARY KEY NOT NULL," +
    "   title CHAR(50) NOT NULL," +
    "   date CHAR(50) NOT NULL," +
    "   content CHAR(400) NOT NULL" +
    ")");

    db.run("CREATE TABLE IF NOT EXISTS venue_tbl" +
    "(  id INTEGER PRIMARY KEY NOT NULL," +
    "   name CHAR(50) NOT NULL" +
    ")");

    db.run("CREATE TABLE IF NOT EXISTS week_tbl" +
    "(  id INTEGER PRIMARY KEY NOT NULL," +
    "   name CHAR(50) NOT NULL," +
    "   date CHAR(50) NOT NULL" +
    ")");

    db.run("CREATE TABLE IF NOT EXISTS group_tbl" +
    "(  id INTEGER PRIMARY KEY NOT NULL," +
    "   name CHAR(50) NOT NULL" +
    ")");

    db.run("CREATE TABLE IF NOT EXISTS player_tbl" +
    "(  id INTEGER PRIMARY KEY NOT NULL," +
    "   forename CHAR(50) NOT NULL," +
    "   surname CHAR(50) NOT NULL," +
    "   phone_number CHAR(11) NOT NULL," +
    "   email_address CHAR(50) NOT NULL," +
    "   group_id INTEGER NOT NULL," +
    "   FOREIGN KEY(group_id) REFERENCES group_tbl(id)" +
    ")");

    db.run("CREATE TABLE IF NOT EXISTS fixture_tbl" +
    "(  id INTEGER PRIMARY KEY NOT NULL," +
    "   week_id INTEGER NOT NULL," +
    "   order_of_play INTEGER NOT NULL," +
    "   venue_id INTEGER NOT NULL," +
    "   group_id INTEGER NOT NULL," +
    "   player_one_id INTEGER NOT NULL," +
    "   player_two_id INTEGER NOT NULL," +
    "   marker_one_id INTEGER NOT NULL," +
    "   marker_two_id INTEGER NOT NULL," +
    "   complete INTEGER NOT NULL," +
    "   FOREIGN KEY(week_id) REFERENCES week_tbl(id)," +
    "   FOREIGN KEY(group_id) REFERENCES group_tbl(id)," +
    "   FOREIGN KEY(venue_id) REFERENCES venue_tbl(id)," +
    "   FOREIGN KEY(player_one_id) REFERENCES player_tbl(id)," +
    "   FOREIGN KEY(player_two_id) REFERENCES player_tbl(id)," +
    "   FOREIGN KEY(marker_one_id) REFERENCES player_tbl(id)," +
    "   FOREIGN KEY(marker_two_id) REFERENCES player_tbl(id)" +
    ")");

    db.run("CREATE TABLE IF NOT EXISTS result_tbl" +
    "(  id INTEGER PRIMARY KEY NOT NULL," +
    "   fixture_id INTEGER NOT NULL," +
    "   player_one_legs_won INTEGER NOT NULL," +
    "   player_two_legs_won INTEGER NOT NULL," +
    "   FOREIGN KEY(fixture_id) REFERENCES fixture_tbl(id)" +
    ")");

    db.run("CREATE TABLE IF NOT EXISTS high_finish_tbl" +
    "(  id INTEGER PRIMARY KEY NOT NULL," +
    "   checkout INTEGER NOT NULL," +
    "   fixture_id INTEGER NOT NULL," +
    "   player_id INTEGER NOT NULL," +
    "   FOREIGN KEY(player_id) REFERENCES player_tbl(id)," +
    "   FOREIGN KEY(fixture_id) REFERENCES fixture_tbl(id)" +
    ")");

    db.run("CREATE TABLE IF NOT EXISTS best_leg_tbl" +
    "(  id INTEGER PRIMARY KEY NOT NULL," +
    "   number_of_darts INTEGER NOT NULL," +
    "   fixture_id INTEGER NOT NULL," +
    "   player_id INTEGER NOT NULL," +
    "   FOREIGN KEY(player_id) REFERENCES player_tbl(id)," +
    "   FOREIGN KEY(fixture_id) REFERENCES fixture_tbl(id)" +
    ")");

    db.run("CREATE TABLE IF NOT EXISTS player_180_tbl" +
    "(  id INTEGER PRIMARY KEY NOT NULL," +
    "   no_of_180s INTEGER NOT NULL," +
    "   fixture_id INTEGER NOT NULL," +
    "   player_id INTEGER NOT NULL," +
    "   FOREIGN KEY(player_id) REFERENCES player_tbl(id)," +
    "   FOREIGN KEY(fixture_id) REFERENCES fixture_tbl(id)" +
    ")");
});

var express = require('express');
var restapi = express();

require('./contact')(restapi, db);
require('./news')(restapi, db);
require('./week')(restapi, db);
require('./venue')(restapi, db);
require('./group')(restapi, db);
require('./player')(restapi, db);
require('./fixture')(restapi, db);
require('./result')(restapi, db);
require('./180')(restapi, db);
require('./highfinish')(restapi, db);
require('./bestleg')(restapi, db);

restapi.use(express.static(__dirname + '/app'));

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

restapi.listen(server_port, server_ip_address, function(){
    console.log("Listening on " + server_ip_address + ", port " + server_port);
});