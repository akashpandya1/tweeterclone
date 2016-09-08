/* //Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT = 8080;

//We need a function which handles requests and send response
function handleRequest(request, response) {
    response.end('It Works!! Path Hit: ' + request.url);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
}); */

var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('test.db');

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/foo', function (req, res) {
    res.send('yo');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

if(!selectRec(db))  {
 initDB(db);
}

function initDB(db) {
    db.serialize(function () {
        db.run("CREATE TABLE lorem (info TEXT)", function (err, row) {
            if (err) {
                console.log(err);
            }
        });
        var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
        for (var i = 0; i < 10; i++) {
            stmt.run("Ipsum " + i);
        }
        stmt.finalize();
    });
    db.close();
    return true; 
}


function updateLorem(db, info, id) {
    db.run("UPDATE tbl SET info = ? WHERE id = ?", info, id, function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            console.log("Successful");
        }
    });
     db.close();
     return true; 
}

function insertRec(db) {
    var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();
    db.close();
    return true; 
}

function deleteRec(db, idRec) {
    db.run("DELETE FROM lorem WHERE id=(?)", idRec, function (err) {
        if (err) {
            console.log(err);
              return false;
        }
        else {         
            console.log("Successful");            
        }
    });
     db.close();
     return true; 
} 

function selectRec(db) {
            db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
                if (err) {
                    console.log(err);
                    return false;
                } 
                console.log(row.id + ": " + row.info);               
            });
           db.close();
           return true; 
 }
 