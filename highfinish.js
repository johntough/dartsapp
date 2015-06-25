module.exports = function(restapi, db) {
 
     var db = db;

    restapi.get('/highfinishes', function(request, response) {

        var json_obj_response = { highfinishes: [], count: 0};

         db.each("SELECT high_finish_tbl.id, high_finish_tbl.checkout, " +
         "w.name AS week_name, " +
         "p.forename AS p_forename, p.surname AS p_surname " +
         "FROM high_finish_tbl " +
         "JOIN player_tbl AS p ON p.id = high_finish_tbl.player_id " +
         "JOIN result_tbl AS r ON r.id = high_finish_tbl.result_id " +
         "JOIN fixture_tbl AS f ON f.id = r.fixture_id " +
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

    restapi.post('/highfinish/:checkout/:result/:player', function(request, response) {
        var new_checkout = request.params.checkout;
        var new_result = request.params.result;
        var new_player = request.params.player;

        db.run("INSERT INTO high_finish_tbl (checkout, result_id, player_id) VALUES (?, ?, ?)",
         [new_checkout, new_result, new_player],
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