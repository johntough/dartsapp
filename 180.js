module.exports = function(restapi, db) {
 
     var db = db;

    restapi.get('/180s', function(request, response) {

        var json_obj_response = { player180s: [], count: 0};

         db.each("SELECT player_180_tbl.id, SUM(player_180_tbl.no_of_180s) AS total_no_of_180s, " +
         "p.forename AS p_forename, p.surname AS p_surname " +
         "FROM player_180_tbl " +
         "JOIN player_tbl AS p ON p.id = player_180_tbl.player_id " +
         "GROUP BY player_180_tbl.player_id",
        function(err, row) {
            var player180 = { id: '', noOf180s: 0, player: ''};

            player180.id = row.id;
            player180.noOf180s = row.total_no_of_180s;
            player180.player = row.p_forename + ' ' + row.p_surname;
            json_obj_response.player180s.push(player180);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.player180s.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/180s/players', function(request, response) {

        var json_obj_response = { players: [], count: 0};

         db.each("SELECT player_180_tbl.player_id, " +
         "p.forename AS p_forename, p.surname AS p_surname " +
         "FROM player_180_tbl " +
         "JOIN player_tbl AS p ON p.id = player_180_tbl.player_id " +
         "GROUP BY player_180_tbl.player_id",
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

    restapi.get('/180s/player/:player', function(request, response) {
        var player_id = request.params.player;

        var json_obj_response = { player180s: [], count: 0};

         db.each("SELECT player_180_tbl.id, player_180_tbl.no_of_180s, " +
         "w.date AS date, " +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname " +
         "FROM player_180_tbl " +
         "JOIN fixture_tbl AS f ON f.id = player_180_tbl.fixture_id " +
         "JOIN player_tbl AS p1 ON p1.id = player_180_tbl.player_id " +
         "JOIN player_tbl AS p2 ON p2.id = " +
         "CASE WHEN (player_180_tbl.player_id = f.player_one_id) THEN f.player_two_id ELSE f.player_one_id END " +
         "JOIN week_tbl AS w ON w.id = f.week_id " +
         "WHERE player_180_tbl.player_id = " + player_id,
        function(err, row) {
            var player180 = { id: '', noOf180s: 0, player1: '', date: '', player2: ''};

            if (row.id) {
                player180.id = row.id;
                player180.noOf180s = row.no_of_180s;
                player180.date = row.date;
                player180.player1 = row.p1_forename + ' ' + row.p1_surname;
                player180.player2 = row.p2_forename + ' ' + row.p2_surname;
                json_obj_response.player180s.push(player180);
            }
        },
        function complete(err, found) {
            json_obj_response.count = json_obj_response.player180s.length;
            response.json(json_obj_response);
        });
    });

    restapi.post('/180/:number180s/:fixture/:player', function(request, response) {
        var new_number180s = request.params.number180s;
        var new_fixture = request.params.fixture;
        var new_player = request.params.player;

        db.run("INSERT INTO player_180_tbl (no_of_180s, fixture_id, player_id) VALUES (?, ?, ?)",
         [new_number180s, new_fixture, new_player],
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

    restapi.put('/180/:id/:number180s', function(request, response) {
        var player_180_id = request.params.id;
        var updated_number180s = request.params.number180s;

        db.run("UPDATE player_180_tbl SET no_of_180s = (?) WHERE id = (?)", updated_number180s, player_180_id, function(err, row) {
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

   restapi.delete('/180/:id', function(request, response) {
        var player_180_id = request.params.id;

        db.run("DELETE FROM player_180_tbl WHERE id = (?)", player_180_id, function(err, row) {
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