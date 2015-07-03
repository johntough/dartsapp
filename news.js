module.exports = function(restapi, db) {
 
    var db = db;

    restapi.get('/news', function(request, response) {
        var json_obj_response = { newsItems : [], count: 0};

        db.each("SELECT * FROM news_tbl", function(err, row) {
            var newsItem = { id: '', title: '', date: '', content: ''};
            newsItem.id = row.id;
            newsItem.title = row.title;
            newsItem.date = row.date;
            newsItem.content = row.content;
            json_obj_response.newsItems.push(newsItem);
        }, 
        function complete(err, found) {
            json_obj_response.count = json_obj_response.newsItems.length;
            response.json(json_obj_response);
            response.status(200);
        });
    });

    restapi.post('/newsItem/:title/:date/:content', function(request, response) {
        var new_news_title = request.params.title;
        var new_news_date = request.params.date;
        var new_news_content = request.params.content;

        db.run("INSERT INTO news_tbl (title, date, content) VALUES (?, ?, ?)", new_news_title, new_news_date, new_news_content, function(err, row) {
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

    restapi.put('/newsItem/:id/:title/:content', function(request, response) {
        var news_id = request.params.id;
        var updated_news_title = request.params.title;
        var updated_news_content = request.params.content;

        db.run("UPDATE news_tbl SET title = (?), content = (?) WHERE id = (?)", updated_news_title, updated_news_content, news_id, function(err, row) {
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