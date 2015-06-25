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

    restapi.get('/players/group/:groupId', function(request, response) {
        var group_id = request.params.groupId;
        var json_obj_response = { players : [], count: 0};

        db.each("SELECT player_tbl.id, player_tbl.forename, player_tbl.surname, player_tbl.phone_number, player_tbl.email_address, " +
        "group_tbl.name AS group_name " +
        "FROM player_tbl " +
        "JOIN group_tbl ON group_tbl.id = player_tbl.group_id " +
        "WHERE group_tbl.id = " + group_id,
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
 
    restapi.put('/player/:id/:forename/:surname/:email/:phone', function(request, response) {
        var player_id = request.params.id;
        var updated_player_forname = request.params.forename;
        var updated_player_surname = request.params.surname;
        var updated_player_email = request.params.email;
        var updated_player_phone = request.params.phone;

        db.run("UPDATE player_tbl SET forename = (?), surname = (?), email_address = (?), phone_number = (?) WHERE id = (?)",
        updated_player_forname, updated_player_surname, updated_player_email, updated_player_phone, player_id, function(err, row) {
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

   restapi.delete('/player/:id', function(request, response) {
        var player_id = request.params.id;

        db.run("DELETE FROM player_tbl WHERE id = (?)", player_id, function(err, row) {
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