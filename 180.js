module.exports = function(restapi, db) {
 
     var db = db;

    restapi.get('/180s', function(request, response) {

        var json_obj_response = { player180s: [], count: 0};

         db.each("SELECT player_180_tbl.id, player_180_tbl.no_of_180s, " +
         "f.week_number, " +
         "p.forename AS p_forename, p.surname AS p_surname " +
         "FROM player_180_tbl " +
         "JOIN player_tbl AS p ON p.id = player_180_tbl.player_id " +
         "JOIN result_tbl AS r ON r.id = player_180_tbl.result_id " +
         "JOIN fixture_tbl AS f ON f.id = r.fixture_id",
        function(err, row) {
            console.log("Callback on /180s");
            var player180 = { id: '', noOf180s: 0, player: '', week: ''};

            player180.id = row.id;
            player180.week = row.week_number;
            player180.noOf180s = row.no_of_180s;
            player180.player = row.p_forename + ' ' + row.p_surname;
            json_obj_response.player180s.push(player180);
        }, 
        function complete(err, found) {
            console.log("Complete on /180s");
            json_obj_response.count = json_obj_response.player180s.length;
            response.json(json_obj_response);
        });
    });

    restapi.post('/180/:number180s/:result/:player', function(request, response) {
        var new_number180s = request.params.number180s;
        var new_result = request.params.result;
        var new_player = request.params.player;

        db.run("INSERT INTO player_180_tbl (no_of_180s, result_id, player_id) VALUES (?, ?, ?)",
         [new_number180s, new_result, new_player],
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
 
    console.log('180.js included');
    console.log('GET endpoint: http://localhost:3000/180s');
    console.log('POST endpoint: http://localhost:3000/180/:number180s/:result/:player');
}