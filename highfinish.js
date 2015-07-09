module.exports = function(restapi, db) {
 
     var db = db;

    restapi.get('/highfinishes', function(request, response) {

        var json_obj_response = { highfinishes: [], count: 0};

         db.each("SELECT high_finish_tbl.id, high_finish_tbl.checkout, " +
         "w.name AS week_name, " +
         "p.forename AS p_forename, p.surname AS p_surname " +
         "FROM high_finish_tbl " +
         "JOIN player_tbl AS p ON p.id = high_finish_tbl.player_id " +
         "JOIN fixture_tbl AS f ON f.id = high_finish_tbl.fixture_id " +
         "JOIN week_tbl AS w ON w.id = f.week_id",
        function(err, row) {
            var highfinish = { id: '', checkout: 0, player: '', week: ''};

            highfinish.id = row.id;
            highfinish.checkout = row.checkout;
            highfinish.week = row.week_name;
            highfinish.player = row.p_forename + ' ' + row.p_surname;
            json_obj_response.highfinishes.push(highfinish);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.highfinishes.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/highfinishes/duplicatesremoved', function(request, response) {

        var json_obj_response = { highfinishes: [], count: 0};

         db.each("SELECT high_finish_tbl.id, MAX(high_finish_tbl.checkout) AS max_checkout, " +
         "w.name AS week_name, " +
         "p.forename AS p_forename, p.surname AS p_surname " +
         "FROM high_finish_tbl " +
         "JOIN player_tbl AS p ON p.id = high_finish_tbl.player_id " +
         "JOIN fixture_tbl AS f ON f.id = high_finish_tbl.fixture_id " +
         "JOIN week_tbl AS w ON w.id = f.week_id " +
         "GROUP BY high_finish_tbl.player_id",
        function(err, row) {
            var highfinish = { id: '', checkout: 0, player: '', week: ''};

            highfinish.id = row.id;
            highfinish.checkout = row.max_checkout;
            highfinish.week = row.week_name;
            highfinish.player = row.p_forename + ' ' + row.p_surname;
            json_obj_response.highfinishes.push(highfinish);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.highfinishes.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/highfinishes/players', function(request, response) {

        var json_obj_response = { players: [], count: 0};

         db.each("SELECT high_finish_tbl.player_id, " +
         "p.forename AS p_forename, p.surname AS p_surname " +
         "FROM high_finish_tbl " +
         "JOIN player_tbl AS p ON p.id = high_finish_tbl.player_id " +
         "GROUP BY high_finish_tbl.player_id",
        function(err, row) {
            var player = { id: '', forename: '', surname: ''};

            player.id = row.player_id;
            player.forename = row.p_forename;
            player.surname = row.p_surname;
            json_obj_response.players.push(player);
        },
        function complete(err, found) {
            json_obj_response.count = json_obj_response.players.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/highfinishes/player/:player', function(request, response) {
        var player_id = request.params.player;

        var json_obj_response = { highfinishes: [], count: 0};

         db.each("SELECT high_finish_tbl.id, high_finish_tbl.checkout, " +
         "w.date AS date, " +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname " +
         "FROM high_finish_tbl " +
         "JOIN fixture_tbl AS f ON f.id = high_finish_tbl.fixture_id " +
         "JOIN player_tbl AS p1 ON p1.id = high_finish_tbl.player_id " +
         "JOIN player_tbl AS p2 ON p2.id = " +
         "CASE WHEN (high_finish_tbl.player_id = f.player_one_id) THEN f.player_two_id ELSE f.player_one_id END " +
         "JOIN week_tbl AS w ON w.id = f.week_id " +
         "WHERE high_finish_tbl.player_id = " + player_id,
        function(err, row) {
            var highfinish = { id: '', checkout: 0, player1: '', date: '', player2: ''};

            if (row.id) {
                highfinish.id = row.id;
                highfinish.checkout = row.checkout;
                highfinish.date = row.date;
                highfinish.player1 = row.p1_forename + ' ' + row.p1_surname;
                highfinish.player2 = row.p2_forename + ' ' + row.p2_surname;
                json_obj_response.highfinishes.push(highfinish);
            }
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.highfinishes.length;
            response.json(json_obj_response);
        });
    });

    restapi.post('/highfinish/:checkout/:fixture/:player', function(request, response) {
        var new_checkout = request.params.checkout;
        var new_fixture = request.params.fixture;
        var new_player = request.params.player;

        db.run("INSERT INTO high_finish_tbl (checkout, fixture_id, player_id) VALUES (?, ?, ?)",
         [new_checkout, new_fixture, new_player],
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

   restapi.delete('/highfinish/:id', function(request, response) {
        var highfinish_id = request.params.id;

        db.run("DELETE FROM high_finish_tbl WHERE id = (?)", highfinish_id, function(err, row) {
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
}