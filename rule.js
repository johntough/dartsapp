module.exports = function(restapi, db) {
 
    var db = db;

    restapi.get('/rules', function(request, response) {
        var json_obj_response = { ruleItems : [], count: 0};

        db.each("SELECT * FROM rule_tbl", function(err, row) {
            var ruleItem = { id: '', title: '', date: '', content: ''};
            ruleItem.id = row.id;
            ruleItem.title = row.title;
            ruleItem.date = row.date;
            ruleItem.content = row.content;
            json_obj_response.ruleItems.push(ruleItem);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.ruleItems.length;
            response.json(json_obj_response);
            response.status(200);
        });
    });

    restapi.post('/ruleItem/:title/:date/:content', function(request, response) {
        var new_rule_title = request.params.title;
        var new_rule_date = request.params.date;
        var new_rule_content = request.params.content;

        db.run("INSERT INTO rule_tbl (title, date, content) VALUES (?, ?, ?)", new_rule_title, new_rule_date, new_rule_content, function(err, row) {
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

    restapi.put('/ruleItem/:id/:title/:content', function(request, response) {
        var rule_id = request.params.id;
        var updated_rule_title = request.params.title;
        var updated_rule_content = request.params.content;

        db.run("UPDATE rule_tbl SET title = (?), content = (?) WHERE id = (?)", updated_rule_title, updated_rule_content, rule_id, function(err, row) {
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

    restapi.delete('/ruleItem/:id', function(request, response) {
        var rule_id = request.params.id;

        db.run("DELETE FROM rule_tbl WHERE id = (?)", rule_id, function(err, row) {
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