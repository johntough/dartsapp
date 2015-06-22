module.exports = function(restapi, db) {
 
    var db = db;

    restapi.get('/groups', function(request, response) {
        var json_obj_response = { groups : [], count: 0};

        db.each("SELECT * FROM group_tbl", function(err, row) {
            var group = { id: '', name: ''};
            group.id = row.id;
            group.name = row.name;
            json_obj_response.groups.push(group);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.groups.length;
            response.json(json_obj_response);
        });
    });

    restapi.post('/group/:name', function(request, response) {
        var new_group_name = request.params.name;

        db.run("INSERT INTO group_tbl (name) VALUES (?)", new_group_name, function(err, row) {
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
 
    console.log('group.js included');
    console.log('GET endpoint: http://localhost:3000/groups');
    console.log('POST endpoint: http://localhost:3000/group/:name');
}