module.exports = function(restapi, db) {
 
    var db = db;

    restapi.get('/information', function(request, response) {
        var json_obj_response = { informationItems : [], count: 0};

        db.each("SELECT * FROM information_tbl", function(err, row) {
            var informationItem = { id: '', title: '', date: '', content: ''};
            informationItem.id = row.id;
            informationItem.title = row.title;
            informationItem.date = row.date;
            informationItem.content = row.content;
            json_obj_response.informationItems.push(informationItem);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.informationItems.length;
            response.json(json_obj_response);
            response.status(200);
        });
    });

    restapi.post('/informationItem/:title/:date/:content', function(request, response) {
        var new_information_title = request.params.title;
        var new_information_date = request.params.date;
        var new_information_content = request.params.content;

        db.run("INSERT INTO information_tbl (title, date, content) VALUES (?, ?, ?)", new_information_title, new_information_date, new_information_content, function(err, row) {
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

    restapi.put('/informationItem/:id/:title/:content', function(request, response) {
        var information_id = request.params.id;
        var updated_information_title = request.params.title;
        var updated_information_content = request.params.content;

        db.run("UPDATE information_tbl SET title = (?), content = (?) WHERE id = (?)", updated_information_title, updated_information_content, information_id, function(err, row) {
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

    restapi.delete('/informationItem/:id', function(request, response) {
        var information_id = request.params.id;

        db.run("DELETE FROM information_tbl WHERE id = (?)", information_id, function(err, row) {
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