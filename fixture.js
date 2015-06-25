module.exports = function(restapi, db) {
 
     var db = db;

    restapi.get('/fixtures', function(request, response) {

        var json_obj_response = { fixtures: [], count: 0};

         db.each("SELECT fixture_tbl.id, week_tbl.name AS week_name, fixture_tbl.order_of_play, " +
         "venue_tbl.name AS venue_name," +
         "group_tbl.name AS group_name," +
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
            var fixture = { id: '', weekNumber: '', orderOfPlay: '', venue: '', group: '', playerOne: '', playerTwo: '', markerOne: '', markerTwo: ''};

            fixture.id = row.id;
            fixture.weekNumber = row.week_name;
            fixture.orderOfPlay = row.order_of_play;
            fixture.venue = row.venue_name;
            fixture.group = row.group_name;
            fixture.playerOne = row.p1_forename + ' ' + row.p1_surname;            
            fixture.playerTwo = row.p2_forename + ' ' + row.p2_surname;
            fixture.markerOne = row.m1_forename + ' ' + row.m1_surname;            
            fixture.markerTwo = row.m2_forename + ' ' + row.m2_surname;
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

        db.run("INSERT INTO fixture_tbl (week_id, order_of_play, venue_id, group_id, player_one_id, player_two_id, marker_one_id, marker_two_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
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
}