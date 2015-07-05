module.exports = function(restapi, db) {
 
     var db = db;

    restapi.get('/fixtures', function(request, response) {

        var json_obj_response = { fixtures: [], count: 0};

         db.each("SELECT fixture_tbl.id, fixture_tbl.week_id, week_tbl.name AS week_name, week_tbl.date AS week_date, fixture_tbl.order_of_play, fixture_tbl.complete, " +
         "fixture_tbl.venue_id, venue_tbl.name AS venue_name," +
         "fixture_tbl.group_id, group_tbl.name AS group_name," +
         "fixture_tbl.player_one_id, fixture_tbl.player_two_id," +
         "fixture_tbl.marker_one_id, fixture_tbl.marker_two_id," +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "m1.forename AS m1_forename, m1.surname AS m1_surname, " +
         "m2.forename AS m2_forename, m2.surname AS m2_surname " +
         "FROM fixture_tbl " +
         "JOIN week_tbl ON week_tbl.id = fixture_tbl.week_id " +
         "JOIN venue_tbl ON venue_tbl.id = fixture_tbl.venue_id " +
         "JOIN group_tbl ON group_tbl.id = fixture_tbl.group_id " +
         "JOIN player_tbl AS p1 ON p1.id = fixture_tbl.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = fixture_tbl.player_two_id " +
         "JOIN player_tbl AS m1 ON m1.id = fixture_tbl.marker_one_id " +
         "JOIN player_tbl AS m2 ON m2.id = fixture_tbl.marker_two_id",
        function(err, row) {
            var fixture = { id: '', weekId: '', weekNumber: '', weekDate: '', orderOfPlay: '', venueId: '', venue: '', groupId: '', group: '', playerOne: '', playerOneId: '', playerTwo: '', playerTwoId: '', markerOne: '', markerTwo: '', complete: ''};

            fixture.id = row.id;
            fixture.weekId = row.week_id;
            fixture.weekNumber = row.week_name;
            fixture.weekDate = row.week_date;
            fixture.orderOfPlay = row.order_of_play;
            fixture.venueId = row.venue_id;
            fixture.venue = row.venue_name;
            fixture.groupId = row.group_id;
            fixture.group = row.group_name;
            fixture.playerOne = row.p1_forename + ' ' + row.p1_surname;
            fixture.playerOneId = row.player_one_id;
            fixture.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            fixture.markerOne = row.m1_forename + ' ' + row.m1_surname;
            fixture.markerOneId = row.marker_one_id;
            fixture.playerTwoId = row.player_two_id;
            fixture.markerTwo = row.m2_forename + ' ' + row.m2_surname;
            fixture.markerTwoId = row.marker_two_id;
            fixture.complete = row.complete;
            json_obj_response.fixtures.push(fixture);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.fixtures.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/fixtures/week/:week', function(request, response) {

        var json_obj_response = { fixtures: [], count: 0};

         db.each("SELECT fixture_tbl.id, week_tbl.name AS week_name, week_tbl.date AS week_date, fixture_tbl.order_of_play, fixture_tbl.complete, " +
         "venue_tbl.name AS venue_name," +
         "group_tbl.name AS group_name," +
         "fixture_tbl.player_one_id, fixture_tbl.player_two_id," +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "m1.forename AS m1_forename, m1.surname AS m1_surname, " +
         "m2.forename AS m2_forename, m2.surname AS m2_surname " +
         "FROM fixture_tbl " +
         "JOIN week_tbl ON week_tbl.id = fixture_tbl.week_id " +
         "JOIN venue_tbl ON venue_tbl.id = fixture_tbl.venue_id " +
         "JOIN group_tbl ON group_tbl.id = fixture_tbl.group_id " +
         "JOIN player_tbl AS p1 ON p1.id = fixture_tbl.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = fixture_tbl.player_two_id " +
         "JOIN player_tbl AS m1 ON m1.id = fixture_tbl.marker_one_id " +
         "JOIN player_tbl AS m2 ON m2.id = fixture_tbl.marker_two_id " +
         "WHERE fixture_tbl.week_id = " + request.params.week,
        function(err, row) {
            var fixture = { id: '', weekNumber: '', weekDate: '', orderOfPlay: '', venue: '', group: '', playerOne: '', playerOneId: '', playerTwo: '', playerTwoId: '', markerOne: '', markerTwo: '', complete: ''};

            fixture.id = row.id;
            fixture.weekNumber = row.week_name;
            fixture.weekDate = row.week_date;
            fixture.orderOfPlay = row.order_of_play;
            fixture.venue = row.venue_name;
            fixture.group = row.group_name;
            fixture.playerOne = row.p1_forename + ' ' + row.p1_surname;
            fixture.playerOneId = row.player_one_id;
            fixture.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            fixture.markerOne = row.m1_forename + ' ' + row.m1_surname;
            fixture.playerTwoId = row.player_two_id;
            fixture.markerTwo = row.m2_forename + ' ' + row.m2_surname;
            fixture.complete = row.complete;
            json_obj_response.fixtures.push(fixture);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.fixtures.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/fixtures/group/:group', function(request, response) {

        var json_obj_response = { fixtures: [], count: 0};

         db.each("SELECT fixture_tbl.id, week_tbl.name AS week_name, week_tbl.date AS week_date, fixture_tbl.order_of_play, fixture_tbl.complete, " +
         "venue_tbl.name AS venue_name," +
         "group_tbl.name AS group_name," +
         "fixture_tbl.player_one_id, fixture_tbl.player_two_id," +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "m1.forename AS m1_forename, m1.surname AS m1_surname, " +
         "m2.forename AS m2_forename, m2.surname AS m2_surname " +
         "FROM fixture_tbl " +
         "JOIN week_tbl ON week_tbl.id = fixture_tbl.week_id " +
         "JOIN venue_tbl ON venue_tbl.id = fixture_tbl.venue_id " +
         "JOIN group_tbl ON group_tbl.id = fixture_tbl.group_id " +
         "JOIN player_tbl AS p1 ON p1.id = fixture_tbl.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = fixture_tbl.player_two_id " +
         "JOIN player_tbl AS m1 ON m1.id = fixture_tbl.marker_one_id " +
         "JOIN player_tbl AS m2 ON m2.id = fixture_tbl.marker_two_id " +
         "WHERE fixture_tbl.group_id = " + request.params.group,
        function(err, row) {
            var fixture = { id: '', weekNumber: '', weekDate: '', orderOfPlay: '', venue: '', group: '', playerOne: '', playerOneId: '', playerTwo: '', playerTwoId: '', markerOne: '', markerTwo: '', complete: ''};

            fixture.id = row.id;
            fixture.weekNumber = row.week_name;
            fixture.weekDate = row.week_date;
            fixture.orderOfPlay = row.order_of_play;
            fixture.venue = row.venue_name;
            fixture.group = row.group_name;
            fixture.playerOne = row.p1_forename + ' ' + row.p1_surname;
            fixture.playerOneId = row.player_one_id;
            fixture.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            fixture.markerOne = row.m1_forename + ' ' + row.m1_surname;
            fixture.playerTwoId = row.player_two_id;
            fixture.markerTwo = row.m2_forename + ' ' + row.m2_surname;
            fixture.complete = row.complete;
            json_obj_response.fixtures.push(fixture);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.fixtures.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/fixtures/player/:player', function(request, response) {

        var json_obj_response = { fixtures: [], count: 0};

         db.each("SELECT fixture_tbl.id, week_tbl.name AS week_name, week_tbl.date AS week_date, fixture_tbl.order_of_play, fixture_tbl.complete, " +
         "venue_tbl.name AS venue_name," +
         "group_tbl.name AS group_name," +
         "fixture_tbl.player_one_id, fixture_tbl.player_two_id," +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "m1.forename AS m1_forename, m1.surname AS m1_surname, " +
         "m2.forename AS m2_forename, m2.surname AS m2_surname " +
         "FROM fixture_tbl " +
         "JOIN week_tbl ON week_tbl.id = fixture_tbl.week_id " +
         "JOIN venue_tbl ON venue_tbl.id = fixture_tbl.venue_id " +
         "JOIN group_tbl ON group_tbl.id = fixture_tbl.group_id " +
         "JOIN player_tbl AS p1 ON p1.id = fixture_tbl.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = fixture_tbl.player_two_id " +
         "JOIN player_tbl AS m1 ON m1.id = fixture_tbl.marker_one_id " +
         "JOIN player_tbl AS m2 ON m2.id = fixture_tbl.marker_two_id " +
         "WHERE (p1.id = " + request.params.player + " OR p2.id = " + request.params.player + ")",
        function(err, row) {
            var fixture = { id: '', weekNumber: '', weekDate: '', orderOfPlay: '', venue: '', group: '', playerOne: '', playerOneId: '', playerTwo: '', playerTwoId: '', markerOne: '', markerTwo: '', complete: ''};

            fixture.id = row.id;
            fixture.weekNumber = row.week_name;
            fixture.weekDate = row.week_date;
            fixture.orderOfPlay = row.order_of_play;
            fixture.venue = row.venue_name;
            fixture.group = row.group_name;
            fixture.playerOne = row.p1_forename + ' ' + row.p1_surname;
            fixture.playerOneId = row.player_one_id;
            fixture.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            fixture.markerOne = row.m1_forename + ' ' + row.m1_surname;
            fixture.playerTwoId = row.player_two_id;
            fixture.markerTwo = row.m2_forename + ' ' + row.m2_surname;
            fixture.complete = row.complete;
            json_obj_response.fixtures.push(fixture);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.fixtures.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/fixtures/week/:week/group/:group', function(request, response) {

        var json_obj_response = { fixtures: [], count: 0};

         db.each("SELECT fixture_tbl.id, week_tbl.name AS week_name, week_tbl.date AS week_date, fixture_tbl.order_of_play, fixture_tbl.complete, " +
         "venue_tbl.name AS venue_name," +
         "group_tbl.name AS group_name," +
         "fixture_tbl.player_one_id, fixture_tbl.player_two_id," +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "m1.forename AS m1_forename, m1.surname AS m1_surname, " +
         "m2.forename AS m2_forename, m2.surname AS m2_surname " +
         "FROM fixture_tbl " +
         "JOIN week_tbl ON week_tbl.id = fixture_tbl.week_id " +
         "JOIN venue_tbl ON venue_tbl.id = fixture_tbl.venue_id " +
         "JOIN group_tbl ON group_tbl.id = fixture_tbl.group_id " +
         "JOIN player_tbl AS p1 ON p1.id = fixture_tbl.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = fixture_tbl.player_two_id " +
         "JOIN player_tbl AS m1 ON m1.id = fixture_tbl.marker_one_id " +
         "JOIN player_tbl AS m2 ON m2.id = fixture_tbl.marker_two_id " +
         "WHERE fixture_tbl.week_id = " + request.params.week + " " +
         "AND fixture_tbl.group_id = " + request.params.group,
        function(err, row) {
            var fixture = { id: '', weekNumber: '', weekDate: '', orderOfPlay: '', venue: '', group: '', playerOne: '', playerOneId: '', playerTwo: '', playerTwoId: '', markerOne: '', markerTwo: '', complete: ''};

            fixture.id = row.id;
            fixture.weekNumber = row.week_name;
            fixture.weekDate = row.week_date;
            fixture.orderOfPlay = row.order_of_play;
            fixture.venue = row.venue_name;
            fixture.group = row.group_name;
            fixture.playerOne = row.p1_forename + ' ' + row.p1_surname;
            fixture.playerOneId = row.player_one_id;
            fixture.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            fixture.markerOne = row.m1_forename + ' ' + row.m1_surname;
            fixture.playerTwoId = row.player_two_id;
            fixture.markerTwo = row.m2_forename + ' ' + row.m2_surname;
            fixture.complete = row.complete;
            json_obj_response.fixtures.push(fixture);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.fixtures.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/fixtures/group/:group/player/:player', function(request, response) {

        var json_obj_response = { fixtures: [], count: 0};

         db.each("SELECT fixture_tbl.id, week_tbl.name AS week_name, week_tbl.date AS week_date, fixture_tbl.order_of_play, fixture_tbl.complete, " +
         "venue_tbl.name AS venue_name," +
         "group_tbl.name AS group_name," +
         "fixture_tbl.player_one_id, fixture_tbl.player_two_id," +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "m1.forename AS m1_forename, m1.surname AS m1_surname, " +
         "m2.forename AS m2_forename, m2.surname AS m2_surname " +
         "FROM fixture_tbl " +
         "JOIN week_tbl ON week_tbl.id = fixture_tbl.week_id " +
         "JOIN venue_tbl ON venue_tbl.id = fixture_tbl.venue_id " +
         "JOIN group_tbl ON group_tbl.id = fixture_tbl.group_id " +
         "JOIN player_tbl AS p1 ON p1.id = fixture_tbl.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = fixture_tbl.player_two_id " +
         "JOIN player_tbl AS m1 ON m1.id = fixture_tbl.marker_one_id " +
         "JOIN player_tbl AS m2 ON m2.id = fixture_tbl.marker_two_id " +
         "WHERE group_tbl.id = " + request.params.group + " " +
         "AND (p1.id = " + request.params.player + " OR p2.id = " + request.params.player + ")",
        function(err, row) {
            var fixture = { id: '', weekNumber: '', weekDate: '', orderOfPlay: '', venue: '', group: '', playerOne: '', playerOneId: '', playerTwo: '', playerTwoId: '', markerOne: '', markerTwo: '', complete: ''};

            fixture.id = row.id;
            fixture.weekNumber = row.week_name;
            fixture.weekDate = row.week_date;
            fixture.orderOfPlay = row.order_of_play;
            fixture.venue = row.venue_name;
            fixture.group = row.group_name;
            fixture.playerOne = row.p1_forename + ' ' + row.p1_surname;
            fixture.playerOneId = row.player_one_id;
            fixture.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            fixture.markerOne = row.m1_forename + ' ' + row.m1_surname;
            fixture.playerTwoId = row.player_two_id;
            fixture.markerTwo = row.m2_forename + ' ' + row.m2_surname;
            fixture.complete = row.complete;
            json_obj_response.fixtures.push(fixture);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.fixtures.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/fixtures/week/:week/player/:player', function(request, response) {

        var json_obj_response = { fixtures: [], count: 0};

         db.each("SELECT fixture_tbl.id, week_tbl.name AS week_name, week_tbl.date AS week_date, fixture_tbl.order_of_play, fixture_tbl.complete, " +
         "venue_tbl.name AS venue_name," +
         "group_tbl.name AS group_name," +
         "fixture_tbl.player_one_id, fixture_tbl.player_two_id," +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "m1.forename AS m1_forename, m1.surname AS m1_surname, " +
         "m2.forename AS m2_forename, m2.surname AS m2_surname " +
         "FROM fixture_tbl " +
         "JOIN week_tbl ON week_tbl.id = fixture_tbl.week_id " +
         "JOIN venue_tbl ON venue_tbl.id = fixture_tbl.venue_id " +
         "JOIN group_tbl ON group_tbl.id = fixture_tbl.group_id " +
         "JOIN player_tbl AS p1 ON p1.id = fixture_tbl.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = fixture_tbl.player_two_id " +
         "JOIN player_tbl AS m1 ON m1.id = fixture_tbl.marker_one_id " +
         "JOIN player_tbl AS m2 ON m2.id = fixture_tbl.marker_two_id " +
         "WHERE week_tbl.id = " + request.params.week + " " +
         "AND (p1.id = " + request.params.player + " OR p2.id = " + request.params.player + ")",
        function(err, row) {
            var fixture = { id: '', weekNumber: '', weekDate: '', orderOfPlay: '', venue: '', group: '', playerOne: '', playerOneId: '', playerTwo: '', playerTwoId: '', markerOne: '', markerTwo: '', complete: ''};

            fixture.id = row.id;
            fixture.weekNumber = row.week_name;
            fixture.weekDate = row.week_date;
            fixture.orderOfPlay = row.order_of_play;
            fixture.venue = row.venue_name;
            fixture.group = row.group_name;
            fixture.playerOne = row.p1_forename + ' ' + row.p1_surname;
            fixture.playerOneId = row.player_one_id;
            fixture.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            fixture.markerOne = row.m1_forename + ' ' + row.m1_surname;
            fixture.playerTwoId = row.player_two_id;
            fixture.markerTwo = row.m2_forename + ' ' + row.m2_surname;
            fixture.complete = row.complete;
            json_obj_response.fixtures.push(fixture);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.fixtures.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/fixtures/group/:group/week/:week/player/:player', function(request, response) {

        var json_obj_response = { fixtures: [], count: 0};

         db.each("SELECT fixture_tbl.id, week_tbl.name AS week_name, week_tbl.date AS week_date, fixture_tbl.order_of_play, fixture_tbl.complete, " +
         "venue_tbl.name AS venue_name," +
         "group_tbl.name AS group_name," +
         "fixture_tbl.player_one_id, fixture_tbl.player_two_id," +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "m1.forename AS m1_forename, m1.surname AS m1_surname, " +
         "m2.forename AS m2_forename, m2.surname AS m2_surname " +
         "FROM fixture_tbl " +
         "JOIN week_tbl ON week_tbl.id = fixture_tbl.week_id " +
         "JOIN venue_tbl ON venue_tbl.id = fixture_tbl.venue_id " +
         "JOIN group_tbl ON group_tbl.id = fixture_tbl.group_id " +
         "JOIN player_tbl AS p1 ON p1.id = fixture_tbl.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = fixture_tbl.player_two_id " +
         "JOIN player_tbl AS m1 ON m1.id = fixture_tbl.marker_one_id " +
         "JOIN player_tbl AS m2 ON m2.id = fixture_tbl.marker_two_id " +
         "WHERE group_tbl.id = " + request.params.group + " " +
         "AND week_tbl.id = " + request.params.week + " " +
         "AND (p1.id = " + request.params.player + " OR p2.id = " + request.params.player + ")",
        function(err, row) {
            var fixture = { id: '', weekNumber: '', weekDate: '', orderOfPlay: '', venue: '', group: '', playerOne: '', playerOneId: '', playerTwo: '', playerTwoId: '', markerOne: '', markerTwo: '', complete: ''};

            fixture.id = row.id;
            fixture.weekNumber = row.week_name;
            fixture.weekDate = row.week_date;
            fixture.orderOfPlay = row.order_of_play;
            fixture.venue = row.venue_name;
            fixture.group = row.group_name;
            fixture.playerOne = row.p1_forename + ' ' + row.p1_surname;
            fixture.playerOneId = row.player_one_id;
            fixture.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            fixture.markerOne = row.m1_forename + ' ' + row.m1_surname;
            fixture.playerTwoId = row.player_two_id;
            fixture.markerTwo = row.m2_forename + ' ' + row.m2_surname;
            fixture.complete = row.complete;
            json_obj_response.fixtures.push(fixture);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.fixtures.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/fixtures/player/:player/completed', function(request, response) {

        var json_obj_response = { fixtures: [], count: 0};

         db.each("SELECT fixture_tbl.id, week_tbl.name AS week_name, week_tbl.date AS week_date, " +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname " +
         "FROM fixture_tbl " +
         "JOIN week_tbl ON week_tbl.id = fixture_tbl.week_id " +
         "JOIN player_tbl AS p1 ON p1.id = fixture_tbl.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = fixture_tbl.player_two_id " +
         "WHERE (p1.id = " + request.params.player + " OR p2.id = " + request.params.player + ") " +
         "AND fixture_tbl.complete = 1",
        function(err, row) {
            var fixture = { id: '', weekName: '', date: '', player1: '', player2: ''};

            fixture.id = row.id;
            fixture.weekName = row.week_name;
            fixture.date = row.week_date;
            fixture.player1 = row.p1_forename + " " + row.p1_surname;
            fixture.player2 = row.p2_forename + " " + row.p2_surname;
            json_obj_response.fixtures.push(fixture);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.fixtures.length;
            response.json(json_obj_response);
        });
    });

    restapi.post('/fixture/:week/:order/:venue/:group/:player1/:player2/:marker1/:marker2', function(request, response) {
        var new_week = request.params.week;
        var new_order_of_play = request.params.order;
        var new_venue = request.params.venue;
        var new_group = request.params.group;
        var new_player_1 = request.params.player1;
        var new_player_2 = request.params.player2;
        var new_marker_1 = request.params.marker1;
        var new_marker_2 = request.params.marker2;

        db.run("INSERT INTO fixture_tbl (week_id, order_of_play, venue_id, group_id, player_one_id, player_two_id, marker_one_id, marker_two_id, complete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)",
         [new_week, new_order_of_play, new_venue, new_group, new_player_1, new_player_2, new_marker_1, new_marker_2],
         function(err, row) {
            if (err) {
                console.log(err);
                response.status(500);
            }
            else {
                response.status(202);
            }
            response.end();
        });
    });

    restapi.put('/fixture/complete/:id', function(request, response) {
        var fixture_id = request.params.id;

        db.run("UPDATE fixture_tbl SET complete = 1 WHERE id = (?)", fixture_id, function(err, row) {
            if (err) {
                console.log(err);
                response.status(500);
            }
            else {
                response.status(204);
            }
            response.end();
        });
    });

    restapi.put('/fixture/:id/', function(request, response) {
        var fixture_id = request.params.id;

        db.run("UPDATE fixture_tbl SET complete = 1 WHERE id = (?)", fixture_id, function(err, row) {
            if (err) {
                console.log(err);
                response.status(500);
            }
            else {
                response.status(204);
            }
            response.end();
        });
    });

    restapi.put('/fixture/:id/:week/:order/:venue/:player1/:player2/:marker1/:marker2', function(request, response) {
        var fixture_id = request.params.id;
        var week_id = request.params.week;
        var order_of_play = request.params.order;
        var venue_id = request.params.venue;
        var player1_id = request.params.player1;
        var player2_id = request.params.player2;
        var marker1_id = request.params.marker1;
        var marker2_id = request.params.marker2;

        db.run("UPDATE fixture_tbl SET week_id = (?), order_of_play = (?), venue_id = (?), player_one_id = (?), player_two_id = (?), " +
        "marker_one_id = (?), marker_two_id = (?) WHERE id = (?)",
        week_id, order_of_play, venue_id, player1_id, player2_id, marker1_id, marker2_id, fixture_id,
        function(err, row) {
            if (err) {
                console.log(err);
                response.status(500);
            }
            else {
                response.status(204);
            }
            response.end();
        });
    });

   restapi.delete('/fixture/:id', function(request, response) {
        var fixture_id = request.params.id;

        db.run("DELETE FROM fixture_tbl WHERE id = (?)", fixture_id, function(err, row) {
            if (err) {
                response.status(500);
            }
            else {
                response.status(204);
            }
            response.end();
        });
    });
}