module.exports = function(restapi, db) {
 
    var db = db;

    restapi.get('/logondetails/secretapi', function(request, response) {
        var json_obj_response = { username : undefined, password: undefined };

        db.each("SELECT * FROM logon_tbl", function(err, row) {
            json_obj_response.id = row.id;
            json_obj_response.username = row.username;
            json_obj_response.password = row.password;
        }, 
        function complete(err, found) {
            response.json(json_obj_response);
            response.status(200);
        });
    });

    restapi.get('/logoncheck/:username/:password', function(request, response) {
        var json_obj_response = { success : false};

        db.each("SELECT * FROM logon_tbl", function(err, row) {
            if ((row.username === request.params.username) && (row.password === request.params.password)) {
                json_obj_response.success = true;
            }
        }, 
        function complete(err, found) {
            response.json(json_obj_response);
            response.status(200);
        });
    });

    restapi.put('/logon/:username/:password', function(request, response) {
        var row_id = 1; // only ever 1 entry in table
        var updated_username = request.params.username;
        var updated_password = request.params.password;

        db.run("UPDATE logon_tbl SET username = (?), password = (?) WHERE id = (?)", updated_username, updated_password, row_id, function(err, row) {
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