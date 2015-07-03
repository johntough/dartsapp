module.exports = function(restapi, db) {
 
     var db = db;

    restapi.get('/results', function(request, response) {

        var json_obj_response = { results: [], count: 0};

         db.each("SELECT result_tbl.id, result_tbl.player_one_legs_won, result_tbl.player_two_legs_won, " +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "week_tbl.name AS week_name, week_tbl.date AS week_date, " +
         "group_tbl.name AS group_name " +
         "FROM result_tbl " +
         "JOIN fixture_tbl AS f ON f.id = result_tbl.fixture_id " +
         "JOIN week_tbl ON week_tbl.id = f.week_id " +
         "JOIN player_tbl AS p1 ON p1.id = f.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = f.player_two_id " +
         "JOIN group_tbl ON group_tbl.id = p1.group_id",
        function(err, row) {
            var result = { id: '', weekNumber: '', weekDate: '', group: '', playerOneLegsWon: '', playerTwoLegsWon: '', playerOne: '', playerTwo: ''};

            result.id = row.id;
            result.playerOneLegsWon = row.player_one_legs_won;
            result.playerTwoLegsWon = row.player_two_legs_won;
            result.weekNumber = row.week_name;
            result.weekDate = row.week_date;
            result.group = row.group_name;
            result.playerOne = row.p1_forename + ' ' + row.p1_surname;            
            result.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            json_obj_response.results.push(result);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.results.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/results/week/:week', function(request, response) {

        var json_obj_response = { results: [], count: 0};

         db.each("SELECT result_tbl.id, result_tbl.player_one_legs_won, result_tbl.player_two_legs_won, " +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "week_tbl.name AS week_name, week_tbl.date AS week_date, " +
         "group_tbl.name AS group_name " +
         "FROM result_tbl " +
         "JOIN fixture_tbl AS f ON f.id = result_tbl.fixture_id " +
         "JOIN week_tbl ON week_tbl.id = f.week_id " +
         "JOIN player_tbl AS p1 ON p1.id = f.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = f.player_two_id " +
         "JOIN group_tbl ON group_tbl.id = p1.group_id " +
         "WHERE f.week_id = " + request.params.week,
        function(err, row) {
            var result = { id: '', weekNumber: '', weekDate: '', group: '', playerOneLegsWon: '', playerTwoLegsWon: '', playerOne: '', playerTwo: ''};

            result.id = row.id;
            result.playerOneLegsWon = row.player_one_legs_won;
            result.playerTwoLegsWon = row.player_two_legs_won;
            result.weekNumber = row.week_name;
            result.weekDate = row.week_date;
            result.group = row.group_name;
            result.playerOne = row.p1_forename + ' ' + row.p1_surname;            
            result.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            json_obj_response.results.push(result);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.results.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/results/group/:group', function(request, response) {

        var json_obj_response = { results: [], count: 0};

         db.each("SELECT result_tbl.id, result_tbl.player_one_legs_won, result_tbl.player_two_legs_won, " +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "week_tbl.name AS week_name, week_tbl.date AS week_date, " +
         "group_tbl.name AS group_name " +
         "FROM result_tbl " +
         "JOIN fixture_tbl AS f ON f.id = result_tbl.fixture_id " +
         "JOIN week_tbl ON week_tbl.id = f.week_id " +
         "JOIN player_tbl AS p1 ON p1.id = f.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = f.player_two_id " +
         "JOIN group_tbl ON group_tbl.id = p1.group_id " +
         "WHERE group_tbl.id = " + request.params.group,
        function(err, row) {
            var result = { id: '', weekNumber: '', weekDate: '', group: '', playerOneLegsWon: '', playerTwoLegsWon: '', playerOne: '', playerTwo: ''};

            result.id = row.id;
            result.playerOneLegsWon = row.player_one_legs_won;
            result.playerTwoLegsWon = row.player_two_legs_won;
            result.weekNumber = row.week_name;
            result.weekDate = row.week_date;
            result.group = row.group_name;
            result.playerOne = row.p1_forename + ' ' + row.p1_surname;            
            result.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            json_obj_response.results.push(result);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.results.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/results/player/:player', function(request, response) {

        var json_obj_response = { results: [], count: 0};

         db.each("SELECT result_tbl.id, result_tbl.player_one_legs_won, result_tbl.player_two_legs_won, " +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "week_tbl.name AS week_name, week_tbl.date AS week_date, " +
         "group_tbl.name AS group_name " +
         "FROM result_tbl " +
         "JOIN fixture_tbl AS f ON f.id = result_tbl.fixture_id " +
         "JOIN week_tbl ON week_tbl.id = f.week_id " +
         "JOIN player_tbl AS p1 ON p1.id = f.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = f.player_two_id " +
         "JOIN group_tbl ON group_tbl.id = p1.group_id " +
         "WHERE p1.id = " + request.params.player + " OR " +
         "p2.id = " + request.params.player,
        function(err, row) {
            var result = { id: '', weekNumber: '', weekDate: '', group: '', playerOneLegsWon: '', playerTwoLegsWon: '', playerOne: '', playerTwo: ''};

            result.id = row.id;
            result.playerOneLegsWon = row.player_one_legs_won;
            result.playerTwoLegsWon = row.player_two_legs_won;
            result.weekNumber = row.week_name;
            result.weekDate = row.week_date;
            result.group = row.group_name;
            result.playerOne = row.p1_forename + ' ' + row.p1_surname;            
            result.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            json_obj_response.results.push(result);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.results.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/results/group/:group/week/:week', function(request, response) {

        var json_obj_response = { results: [], count: 0};

         db.each("SELECT result_tbl.id, result_tbl.player_one_legs_won, result_tbl.player_two_legs_won, " +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "week_tbl.name AS week_name, week_tbl.date AS week_date, " +
         "group_tbl.name AS group_name " +
         "FROM result_tbl " +
         "JOIN fixture_tbl AS f ON f.id = result_tbl.fixture_id " +
         "JOIN week_tbl ON week_tbl.id = f.week_id " +
         "JOIN player_tbl AS p1 ON p1.id = f.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = f.player_two_id " +
         "JOIN group_tbl ON group_tbl.id = p1.group_id " +
         "WHERE group_tbl.id = " + request.params.group + " " +
         "AND week_tbl.id = " + request.params.week,
        function(err, row) {
            var result = { id: '', weekNumber: '', weekDate: '', group: '', playerOneLegsWon: '', playerTwoLegsWon: '', playerOne: '', playerTwo: ''};

            result.id = row.id;
            result.playerOneLegsWon = row.player_one_legs_won;
            result.playerTwoLegsWon = row.player_two_legs_won;
            result.weekNumber = row.week_name;
            result.weekDate = row.week_date;
            result.group = row.group_name;
            result.playerOne = row.p1_forename + ' ' + row.p1_surname;            
            result.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            json_obj_response.results.push(result);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.results.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/results/group/:group/player/:player', function(request, response) {

        var json_obj_response = { results: [], count: 0};

         db.each("SELECT result_tbl.id, result_tbl.player_one_legs_won, result_tbl.player_two_legs_won, " +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "week_tbl.name AS week_name, week_tbl.date AS week_date, " +
         "group_tbl.name AS group_name " +
         "FROM result_tbl " +
         "JOIN fixture_tbl AS f ON f.id = result_tbl.fixture_id " +
         "JOIN week_tbl ON week_tbl.id = f.week_id " +
         "JOIN player_tbl AS p1 ON p1.id = f.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = f.player_two_id " +
         "JOIN group_tbl ON group_tbl.id = p1.group_id " +
         "WHERE group_tbl.id = " + request.params.group + " " +
         "AND (p1.id = " + request.params.player + " OR p2.id = " + request.params.player + ")",
        function(err, row) {
            var result = { id: '', weekNumber: '', weekDate: '', group: '', playerOneLegsWon: '', playerTwoLegsWon: '', playerOne: '', playerTwo: ''};

            result.id = row.id;
            result.playerOneLegsWon = row.player_one_legs_won;
            result.playerTwoLegsWon = row.player_two_legs_won;
            result.weekNumber = row.week_name;
            result.weekDate = row.week_date;
            result.group = row.group_name;
            result.playerOne = row.p1_forename + ' ' + row.p1_surname;            
            result.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            json_obj_response.results.push(result);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.results.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/results/week/:week/player/:player', function(request, response) {

        var json_obj_response = { results: [], count: 0};

         db.each("SELECT result_tbl.id, result_tbl.player_one_legs_won, result_tbl.player_two_legs_won, " +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "week_tbl.name AS week_name, week_tbl.date AS week_date, " +
         "group_tbl.name AS group_name " +
         "FROM result_tbl " +
         "JOIN fixture_tbl AS f ON f.id = result_tbl.fixture_id " +
         "JOIN week_tbl ON week_tbl.id = f.week_id " +
         "JOIN player_tbl AS p1 ON p1.id = f.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = f.player_two_id " +
         "JOIN group_tbl ON group_tbl.id = p1.group_id " +
         "WHERE week_tbl.id = " + request.params.week + " " +
         "AND (p1.id = " + request.params.player + " OR p2.id = " + request.params.player + ")",
        function(err, row) {
            var result = { id: '', weekNumber: '', weekDate: '', group: '', playerOneLegsWon: '', playerTwoLegsWon: '', playerOne: '', playerTwo: ''};

            result.id = row.id;
            result.playerOneLegsWon = row.player_one_legs_won;
            result.playerTwoLegsWon = row.player_two_legs_won;
            result.weekNumber = row.week_name;
            result.weekDate = row.week_date;
            result.group = row.group_name;
            result.playerOne = row.p1_forename + ' ' + row.p1_surname;            
            result.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            json_obj_response.results.push(result);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.results.length;
            response.json(json_obj_response);
        });
    });

    restapi.get('/results/group/:group/week/:week/player/:player', function(request, response) {

        var json_obj_response = { results: [], count: 0};

         db.each("SELECT result_tbl.id, result_tbl.player_one_legs_won, result_tbl.player_two_legs_won, " +
         "p1.forename AS p1_forename, p1.surname AS p1_surname, " +
         "p2.forename AS p2_forename, p2.surname AS p2_surname, " +
         "week_tbl.name AS week_name, week_tbl.date AS week_date, " +
         "group_tbl.name AS group_name " +
         "FROM result_tbl " +
         "JOIN fixture_tbl AS f ON f.id = result_tbl.fixture_id " +
         "JOIN week_tbl ON week_tbl.id = f.week_id " +
         "JOIN player_tbl AS p1 ON p1.id = f.player_one_id " +
         "JOIN player_tbl AS p2 ON p2.id = f.player_two_id " +
         "JOIN group_tbl ON group_tbl.id = p1.group_id " +
         "WHERE group_tbl.id = " + request.params.group + " " +
         "AND week_tbl.id = " + request.params.week + " " +
         "AND (p1.id = " + request.params.player + " OR p2.id = " + request.params.player + ")",
        function(err, row) {
            var result = { id: '', weekNumber: '', weekDate: '', group: '', playerOneLegsWon: '', playerTwoLegsWon: '', playerOne: '', playerTwo: ''};

            result.id = row.id;
            result.playerOneLegsWon = row.player_one_legs_won;
            result.playerTwoLegsWon = row.player_two_legs_won;
            result.weekNumber = row.week_name;
            result.weekDate = row.week_date;
            result.group = row.group_name;
            result.playerOne = row.p1_forename + ' ' + row.p1_surname;            
            result.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            json_obj_response.results.push(result);
        }, 
        function complete(err, found) {
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

    restapi.put('/result/:id/:p1legs/:p2legs', function(request, response) {
        var result_id = request.params.id;
        var updated_player_1_legs = request.params.p1legs;
        var updated_player_2_legs = request.params.p2legs;

        db.run("UPDATE result_tbl SET player_one_legs_won = (?), player_two_legs_won = (?) WHERE id = (?)", updated_player_1_legs, updated_player_2_legs, result_id, function(err, row) {
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

    restapi.delete('/result/:id', function(request, response) {
        var result_id = request.params.id;

        db.run("DELETE FROM result_tbl WHERE id = (?)", result_id, function(err, row) {
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