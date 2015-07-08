module.exports = function(restapi, db) {
 
    var db = db;

    restapi.get('/contacts', function(request, response) {
        var json_obj_response = { contacts : [], count: 0};

        db.each("SELECT * FROM contacts_tbl", function(err, row) {
            var contact = { id: '', name: '', email: '', phone: ''};
            contact.id = row.id;
            contact.name = row.name;
            contact.email = row.email_address;
            contact.phone = row.phone_number;
            json_obj_response.contacts.push(contact);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.contacts.length;
            response.json(json_obj_response);
            response.status(200);
        });
    });

    restapi.post('/contact/:name/:email/:phone', function(request, response) {
        var new_name = request.params.name;
        var new_email = request.params.email;
        var new_phone = request.params.phone;

        db.run("INSERT INTO contacts_tbl (name, email_address, phone_number) VALUES (?, ?, ?)", new_name, new_email, new_phone, function(err, row) {
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

    restapi.put('/contact/:id/:name/:email/:phone', function(request, response) {
        var contact_id = request.params.id;
        var updated_name = request.params.name;
        var updated_email = request.params.email;
        var updated_phone = request.params.phone;

        db.run("UPDATE contacts_tbl SET name = (?), email_address = (?), phone_number = (?) WHERE id = (?)", updated_name, updated_email, updated_phone, contact_id, function(err, row) {
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

    restapi.delete('/contact/:id', function(request, response) {
        var contact_id = request.params.id;

        db.run("DELETE FROM contacts_tbl WHERE id = (?)", contact_id, function(err, row) {
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