module.exports = function(restapi, db) {
 
     var db = db;

    restapi.get('/bestlegs', function(request, response) {

        var json_obj_response = { bestlegs: [], count: 0};

         db.each("SELECT best_leg_tbl.id, best_leg_tbl.number_of_darts, " +
         "w.name AS week_name, " +
         "p.forename AS p_forename, p.surname AS p_surname " +
         "FROM best_leg_tbl " +
         "JOIN player_tbl AS p ON p.id = best_leg_tbl.player_id " +
         "JOIN fixture_tbl AS f ON f.id = best_leg_tbl.fixture_id " +
         "JOIN week_tbl AS w ON w.id = f.week_id",
        function(err, row) {
            var bestleg = { id: '', numberOfDarts: 0, player: '', week: ''};

            bestleg.id = row.id;
            bestleg.numberOfDarts = row.number_of_darts;
            bestleg.week = row.week_name;
            bestleg.player = row.p_forename + ' ' + row.p_surname;
            json_obj_response.bestlegs.push(bestleg);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.bestlegs.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/bestlegs/duplicatesremoved', function(request, response) {

        var json_obj_response = { bestlegs: [], count: 0};

         db.each("SELECT best_leg_tbl.id, MIN(best_leg_tbl.number_of_darts) AS min_number_of_darts, " +
         "w.name AS week_name, " +
         "p.forename AS p_forename, p.surname AS p_surname " +
         "FROM best_leg_tbl " +
         "JOIN player_tbl AS p ON p.id = best_leg_tbl.player_id " +
         "JOIN fixture_tbl AS f ON f.id = best_leg_tbl.fixture_id " +
         "JOIN week_tbl AS w ON w.id = f.week_id " +
         "GROUP BY best_leg_tbl.player_id",
        function(err, row) {
            var bestleg = { id: '', numberOfDarts: 0, player: '', week: ''};

            bestleg.id = row.id;
            bestleg.numberOfDarts = row.min_number_of_darts;
            bestleg.week = row.week_name;
            bestleg.player = row.p_forename + ' ' + row.p_surname;
            json_obj_response.bestlegs.push(bestleg);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.bestlegs.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/bestlegs/:player', function(request, response) {
        var player_id = request.params.player;

        var json_obj_response = { bestlegs: [], count: 0};

         db.each("SELECT best_leg_tbl.id, best_leg_tbl.number_of_darts, " +
         "w.name AS week_name, " +
         "p.forename AS p_forename, p.surname AS p_surname " +
         "FROM best_leg_tbl " +
         "JOIN player_tbl AS p ON p.id = best_leg_tbl.player_id " +
         "JOIN fixture_tbl AS f ON f.id = best_leg_tbl.fixture_id " +
         "JOIN week_tbl AS w ON w.id = f.week_id " +
         "WHERE best_leg_tbl.player_id = " + player_id,
        function(err, row) {
            var bestleg = { id: '', numberOfDarts: 0, player: '', week: ''};

            if (row.id) {
                bestleg.id = row.id;
                bestleg.numberOfDarts = row.number_of_darts;
                bestleg.week = row.week_name;
                bestleg.player = row.p_forename + ' ' + row.p_surname;
                json_obj_response.bestlegs.push(bestleg);
            }
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.bestlegs.length;
            response.json(json_obj_response);
        });
    });

    restapi.post('/bestleg/:numberofdarts/:fixture/:player', function(request, response) {
        var new_best_leg = request.params.numberofdarts;
        var new_fixture = request.params.fixture;
        var new_player = request.params.player;

        db.run("INSERT INTO best_leg_tbl (number_of_darts, fixture_id, player_id) VALUES (?, ?, ?)",
         [new_best_leg, new_fixture, new_player],
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
}