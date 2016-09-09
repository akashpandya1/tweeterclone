
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('test.db');

//var tempJsonObj = '[{"tweetText" : "first tweet", "authorID" : "1"}]';
//insertTweet(tempJsonObj);
//selectRec();
//updateAnyColumnWithExistingData("retweeter_userid", 3, 4);
//updateAnyColumnWithExistingData("retweeter_userid", 4, 1);
//updateAnyColumnWithExistingData("userlikeids", 5, 1);
//selectRecForTweet(5);
//deleteRec(7);

function updateTweetwithColumn(column, id, data) {
    db.run("UPDATE tweet SET " + column + "  = ? WHERE tweetid = ?", data, id, function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            console.log("Successful");
            return true;
            
        }
    });
    
}


function updateAnyColumnWithExistingData(columnName, tweetid, userid) {
    return new Promise(
        (resolve, reject) => {
            db.each("SELECT " + columnName + " FROM tweet where tweetid = ?", tweetid, function (err, row) {
                if (err) {
                    console.log(err);
                    reject(err);
                    return false;
                }
                resolve(row)
                console.log("row:" + row[columnName]);
            })
        }).then(
        (row) => {        
            console.log("updateAnyColumnWithExistingData within then: " + row[columnName]);
             var finalUserids = row[columnName] != null && row[columnName] != "" ? row[columnName] + "," + userid : userid;
            console.log("updateAnyColumnWithExistingData after adding new user : " + finalUserids);
            db.run("UPDATE tweet SET " + columnName + " = ? WHERE tweetid = ?", finalUserids, tweetid, function (err) {
                if (err) {
                    console.log(err);
                    return false;
                }
                else {
                    console.log("Successful Update userlikeids.");
                }
            });
            if (columnName == "retweeter_userid") {
            db.run("UPDATE tweet SET retweet= ? WHERE tweetid = ?", true,tweetid, function (err) {
                if (err) {
                    console.log(err);
                    return false;
                }
                else {
                    console.log("Successful update retweet.");
                }
            });
            } 
            return true;
        }).catch(
        (err) => {
            console.log(err);
        });
}

function insertTweet(data) {
    var stmt = db.prepare("INSERT INTO tweet (tweetText, authorID) VALUES (?, ?)", function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            console.log("data: " + data);
            var jsonStr = JSON.parse(data);
            stmt.run(jsonStr[0].tweetText, jsonStr[0].authorID);
            stmt.finalize();
            console.log("jsonStr: " + jsonStr[0].tweetText + "," + jsonStr[0].authorID);
        }
    });
    return true;
}

function deleteRec(idRec) {
    db.run("DELETE FROM tweet WHERE tweetID=(?)", idRec, function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            console.log("Successful");
        }
    });
    return true;
}

function selectRec() {
    return new Promise(
        (resolve, reject) => {
            var rows = [];
            db.each("SELECT * FROM tweet",
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
        }).then(
        (rows) => {
            console.log("tweet return rows: " + rows);
            var jsonrows = JSON.stringify(rows);
            console.log("tweet retun json: " + jsonrows);
            return jsonrows;
        }
        ).catch(
        (err) => {
            console.log(err);
        });
}

function selectRecForTweet(idRec) {
    return new Promise(
        (resolve, reject) => {           
            db.all("SELECT * FROM tweet where tweetID = ?", idRec,
                function (err, row) {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return false;
                    }
                    resolve(row);
                });
        }).then(
        (row) => {
            console.log("tweet return rows: " + row);
            var jsonrow = JSON.stringify(row);
            console.log("tweet retun json: " + jsonrow);
            return jsonrow;
        }
        ).catch(
        (err) => {
            console.log(err);
        });
}

exports.updateAnyColumnWithExistingData = updateAnyColumnWithExistingData;
exports.selectRec = selectRec;
exports.insertTweet = insertTweet;
exports.deleteRec = deleteRec;


/*

TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;
var db = new TransactionDatabase(
    new sqlite3.Database("test.sqlite", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
);

function updateAnyColumnWithExistingData(columnName, tweetid, userid) {
    var p;
    db.beginTransaction(function (err, transaction) {
        p = new Promise((resolve, reject) => {
            transaction.each("SELECT " + columnName + " FROM tweet where tweetid = ?", tweetid, function (err, row) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(row)
                console.log("row:" + row[columnName]);
            })
        }).then(
            (row) => {
                return updateUserLikeIds(transaction, columnName, tweeetid, userid);
            }
        ).then(
            (val) => {
                if (columnName == "retweeter_userid") {
                    return updateRetweetBool(transaction, tweetid);
                }
            }
        ).then(
            (val) => {
                transaction.commit(function (err) {
                    console.log('failed to commit');
                });
            }
        ).catch(
            (err) => {
                console.log(err);
                transaction.rollback();
            }
        );
    });
    return p;

}


function updateUserLikeIds(db, columnName, tweetid, userid) {
    return Promise(function (resolve, reject) {
        console.log("updateAnyColumnWithExistingData within then: " + row[columnName]);
        var finalUserids = row[columnName] != null && row[columnName] != "" ? row[columnName] + "," + userid : userid;
        console.log("updateAnyColumnWithExistingData after adding new user : " + finalUserids);
        db.run("UPDATE tweet SET " + columnName + " = ? WHERE tweetid = ?", finalUserids, tweetid, function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                console.log("Successful Update userlikeids.");
                resolve();
            }
        });
    });
}

*/


