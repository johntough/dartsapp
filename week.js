module.exports = function(restapi, db) {
 
    var db = db;

    restapi.get('/weeks', function(request, response) {
        var json_obj_response = { weeks : [], count: 0};

        db.each("SELECT * FROM week_tbl", function(err, row) {
            var week = { id: '', name: ''};
            week.id = row.id;
            week.name = row.name;
            json_obj_response.weeks.push(week);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.weeks.length;
            response.json(json_obj_response);
        });
    });

    restapi.post('/week/:name', function(request, response) {
        var new_week_name = request.params.name;

        db.run("INSERT INTO week_tbl (name) VALUES (?)", new_week_name, function(err, row) {
            if (err) {
                console.err(err);
                response.status(500);
            }
            else {
                response.status(202);
            }
            response.end();
        });
    });
 
    console.log('week.js included');
}