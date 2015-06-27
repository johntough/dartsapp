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
}