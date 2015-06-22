module.exports = function(restapi, db) {
 
     var db = db;

    restapi.get('/results', function(request, response) {

        var json_obj_response = { results: [], count: 0};

         db.each("SELECT result_tbl.id, result_tbl.player_one_legs_won, result_tbl.player_two_legs_won, " +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "f.week_number " +
         "FROM result_tbl " +
         "JOIN fixture_tbl AS f ON f.id = result_tbl.fixture_id " +
         "JOIN player_tbl AS p1 ON p1.id = f.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = f.player_two_id",
        function(err, row) {
            console.log("Callback on /results");
            var result = { id: '', weekNumber: '', playerOneLegsWon: '', playerTwoLegsWon: '', playerOne: '', playerTwo: ''};

            result.id = row.id;
            result.playerOneLegsWon = row.player_one_legs_won;
            result.playerTwoLegsWon = row.player_two_legs_won;
            result.weekNumber = row.week_number;
            result.playerOne = row.p1_forename + ' ' + row.p1_surname;            
            result.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            json_obj_response.results.push(result);
        }, 
        function complete(err, found) {
            console.log("Complete on /results");
            json_obj_response.count = json_obj_response.results.length;
            response.json(json_obj_response);
        });
    });

    restapi.post('/result/:fixture/:p1legs/:p2legs', function(request, response) {
        var new_fixture = request.params.fixture;
        var new_player_1_legs = request.params.p1legs;
        var new_player_2_legs = request.params.p2legs;

        db.run("INSERT INTO result_tbl (fixture_id, player_one_legs_won, player_two_legs_won) VALUES (?, ?, ?)",
         [new_fixture, new_player_1_legs, new_player_2_legs],
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
 
    console.log('result.js included');
    console.log('GET endpoint: http://localhost:3000/results');
    console.log('POST endpoint: http://localhost:3000/result/:fixture/:p1legs/:p2legs');
}