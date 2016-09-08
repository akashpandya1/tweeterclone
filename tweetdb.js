
var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('test.db');

//var tempJsonObj = '[{"tweetText" : "first tweet", "authorID" : "1"}]';
//insertTweet(tempJsonObj);
//selectRec();
updateTweetLikeUserIDs(3, 4);

function updateTweetwithColumn(column, id, data) {
    db.run("UPDATE tweet SET " + column + "  = ? WHERE tweetid = ?", data, id, function (err) {
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


function updateTweetLikeUserIDs(tweetid, userid) {
    return new Promise(
        (resolve, reject) => {
            db.each("SELECT userlikeids FROM tweet where tweetid = ?", tweetid, function (err, row) {
                if (err) {
                    console.log(err);
                    reject(err);
                    return false;
                }
                resolve(row)
                console.log("row:" + row.userlikeids);
            })
        }).then(
        (row) => {
            console.log("updateTweetLikeUserIDs within then: " + row.userlikeids);
             var finalUserLikeids = row.userlikeids + "," + userid;
            console.log("updateTweetLikeUserIDs after adding new user : " + finalUserLikeids);
            db.run("UPDATE tweet SET userlikeids= ? WHERE tweetid = ?", finalUserLikeids, tweetid, function (err) {
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
        ).catch(
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
    db.run("DELETE FROM tweet WHERE id=(?)", idRec, function (err) {
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
            return rows;
        }
        ).catch(
        (err) => {
            console.log(err);
        });
}




