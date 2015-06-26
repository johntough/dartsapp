module.exports = function(restapi, db) {
 
    var db = db;

    restapi.get('/weeks', function(request, response) {
        var json_obj_response = { weeks : [], count: 0};

        db.each("SELECT * FROM week_tbl", function(err, row) {
            var week = { id: '', name: '', date: ''};
            week.id = row.id;
            week.name = row.name;
            week.date = row.date;
            json_obj_response.weeks.push(week);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.weeks.length;
            response.json(json_obj_response);
        });
    });

    restapi.post('/week/:name/:date', function(request, response) {
        var new_week_name = request.params.name;
        var new_week_date = request.params.date;
        db.run("INSERT INTO week_tbl (name, date) VALUES (?, ?)", new_week_name, new_week_date, function(err, row) {
            if (err) {
                response.status(500);
            }
            else {
                response.status(202);
            }
            response.end();
        });
    });

    restapi.put('/week/:id/:name/:date', function(request, response) {
        var week_id = request.params.id;
        var updated_week_name = request.params.name;
        var updated_week_date = request.params.date;

        db.run("UPDATE week_tbl SET name = (?), date = (?) WHERE id = (?)", updated_week_name, updated_week_date, week_id, function(err, row) {
            if (err) {
                response.status(500);
            }
            else {
                response.status(204);
            }
            response.end();
        });
    });

   restapi.delete('/week/:id', function(request, response) {
        var week_id = request.params.id;

        db.run("DELETE FROM week_tbl WHERE id = (?)", week_id, function(err, row) {
            if (err) {
                response.status(500);
            }
            else {
                response.status(204);
            }
            response.end();
        });
    });
}