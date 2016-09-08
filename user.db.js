var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('test.db');

function selectRec() {    
    return new Promise(
        (resolve, reject) => {      
            var rows = [];     
            db.each("SELECT * FROM User", 
                function (err, row) {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return false;
                    }
                    rows.push(row);                    
                },
                function (err, nRows) {
                    resolve(rows);
                }
            
            );           
        });
}

var p = selectRec();
p.then(
    (rows) => {
         console.log("return rows: " + rows);
         var jsonrows= JSON.stringify(rows);
         console.log("retun json: " + jsonrows);  
         return rows;
    }
).catch(
    (err) => {
        console.log(err);
    }
    );