module.exports = function(restapi, db) {
 
     var db = db;

    restapi.get('/venues', function(request, response) {

        var json_obj_response = { venues : [], count: 0};
        db.each("SELECT * FROM venue_tbl", function(err, row) {
            var venue = { id: '', name: ''};
            venue.id = row.id;
            venue.name = row.name;
            json_obj_response.venues.push(venue);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.venues.length;
            response.json(json_obj_response);
        });
    });

    restapi.post('/venue/:name', function(request, response) {

        var new_venue_name = request.params.name;

        db.run("INSERT INTO venue_tbl (name) VALUES (?)", new_venue_name, function(err, row) {
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
 
    restapi.put('/venue/:id/:name', function(request, response) {
        var venue_id = request.params.id;
        var updated_venue_name = request.params.name;

        db.run("UPDATE venue_tbl SET name = (?) WHERE id = (?)", updated_venue_name, venue_id, function(err, row) {
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

   restapi.delete('/venue/:id', function(request, response) {
        var venue_id = request.params.id;

        db.run("DELETE FROM venue_tbl WHERE id = (?)", venue_id, function(err, row) {
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