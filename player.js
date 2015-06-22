module.exports = function(restapi, db) {
 
     var db = db;

    restapi.get('/players', function(request, response) {
        var json_obj_response = { players : [], count: 0};

        db.each("SELECT player_tbl.id, player_tbl.forename, player_tbl.surname, player_tbl.phone_number, player_tbl.email_address, " +
        "g.name AS group_name " +
        "FROM player_tbl " +
        "JOIN group_tbl AS g ON g.id = player_tbl.group_id",
        function(err, row) {
            var player = { id: '', forename: '', surname: '', phoneNumber: '', emailAddress: '', group: ''};

            player.id = row.id;
            player.forename = row.forename;
            player.surname = row.surname;
            player.phoneNumber = row.phone_number;
            player.emailAddress = row.email_address;
            player.group = row.group_name;

            json_obj_response.players.push(player);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.players.length;
            response.json(json_obj_response);
        });
    });

    restapi.post('/player/:forename/:surname/:phone/:email/:group', function(request, response) {
        var new_forename = request.params.forename;
        var new_surname = request.params.surname;
        var new_phone = request.params.phone;
        var new_email = request.params.email;
        var group = request.params.group;

        db.run("INSERT INTO player_tbl (forename, surname, phone_number, email_address, group_id) VALUES (?, ?, ?, ?, ?)",
         [new_forename, new_surname, new_phone, new_email, group],
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
 
    console.log('player.js included');
    console.log('GET endpoint: http://localhost:3000/players');
    console.log('POST endpoint: http://localhost:3000/player/:forename/:surname/:phone/:email/:group');
}