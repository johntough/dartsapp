module.exports = function(restapi, db) {
 
    var db = db;

    restapi.get('/contacts', function(request, response) {
        var json_obj_response = { contacts : [], count: 0};

        db.each("SELECT * FROM contacts_tbl", function(err, row) {
            var contact = { id: '', name: '', email: '', phone: ''};
            contact.id = row.id;
            contact.name = row.forename + ' ' + row.surname;
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

    restapi.post('/contact/:forename/:surname/:email/:phone', function(request, response) {
        var new_forename = request.params.forename;
        var new_surname = request.params.surname;
        var new_email = request.params.email;
        var new_phone = request.params.phone;

        db.run("INSERT INTO contacts_tbl (forename, surname, email_address, phone_number) VALUES (?, ?, ?, ?)", new_forename, new_surname, new_email, new_phone, function(err, row) {
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

    restapi.put('/contact/:id/:forename/:surname/:email/:phone', function(request, response) {
        var contact_id = request.params.id;
        var updated_forename = request.params.forename;
        var updated_surname = request.params.surname;
        var updated_email = request.params.email;
        var updated_phone = request.params.phone;

        db.run("UPDATE contacts_tbl SET forename = (?), surname = (?), email_address = (?), phone_number = (?) WHERE id = (?)", updated_forename, updated_surname, updated_email, updated_phone, contact_id, function(err, row) {
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

    restapi.delete('/newsItem/:id', function(request, response) {
        var news_id = request.params.id;

        db.run("DELETE FROM news_tbl WHERE id = (?)", news_id, function(err, row) {
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