var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('test.db');


var testUser = '[{"UserName" : "Mike", "UserProfile" : "efwiofhweiofhw vv"}]';
var testUser2 = '[{"UserName" : "Test", "UserProfile" : "efwiofefewfwefwefwefwfe vv"}]';
//updateUser(testUser);
//addUser(testUser);
//addUser(testUser2);
//updateFollowing(1, 2);
//getFollowUsers(1);
//getUserNameByID(7);
//getUserIDByName("Mike");


function addUser(data) {
    var stmt = db.prepare("INSERT INTO User (UserName, UserProfile) VALUES (?, ?)", function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            var jsonStr = JSON.parse(data);
            stmt.run(jsonStr[0].UserName, jsonStr[0].UserProfile);
            stmt.finalize();
        }
    });
    return true;
}

function updateUser(data) {
    var stmt = db.prepare("UPDATE User SET UserName = ?, UserProfile = ? WHERE UserID = ?", function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            var jsonStr = JSON.parse(data);
            stmt.run(jsonStr[0].UserName, jsonStr[0].UserProfile, jsonStr[0].UserID);
            stmt.finalize();
        }
    });
    return true;
}

function getUserNameByID(userID) {
    var userName;
    return new Promise(
        (resolve, reject) => {
            db.each("SELECT UserName FROM User where UserID = ?", userID,
                function (err, row) {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return false;
                    }
                    userName = row;
                },
                function (err, row) {
                    resolve(row);
                }

            );
        }).then(
        (rows) => {
            console.log("userName: " + JSON.stringify(userName));
            return JSON.stringify(userName);
        }
        ).catch(
        (err) => {
            console.log(err);
        });
}

exports.getUserIDByName = getUserIDByName;
function getUserIDByName(userName) {
    var userID;
    return new Promise(
        (resolve, reject) => {
            db.all("SELECT UserID FROM User where UserName = ?", userName,
                function (err, row) {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return false;
                    }
                    
                },
                function (err, row) {
                    resolve(row);
                }

            );
        }).then(
        (rows) => {
            userID = JSON.parse(JSON.stringify(rows));
            console.log(userID[0].UserID);
            return userID[0].UserID;
        }
        ).catch(
        (err) => {
            console.log(err);
        });
}

 


function updateFollowing(UserID, UserToFollow) {
    return new Promise(
        (resolve, reject) => {
            db.each("SELECT UserFollowing FROM User where UserID = ?", UserID, function (err, row) {
                if (err) {
                    console.log(err);
                    reject(err);
                    return false;
                }
                resolve(row)
                console.log("row:" + row.UserFollowing);
            })
        }).then(
        (row) => {
             var newUserFollowing = row.UserFollowing != null ? row.UserFollowing + ", " + UserToFollow : UserToFollow;
            db.run("UPDATE User SET UserFollowing= ? WHERE UserID = ?", newUserFollowing, UserID, function (err) {
                if (err) {
                    console.log(err);
                    return false;
                }
                else {
                    console.log("Success");
                }
            });
            return true;
        }
        ).catch(
        (err) => {
            console.log(err);
        });
}

function getFollowUsers(UserID) {
    return new Promise(
        (resolve, reject) => {
            db.each("SELECT UserFollowing FROM User WHERE UserID = ?", UserID, function (err, row) {
                if (err) {
                    console.log(err);
                    reject(err);
                    return false;
                }
                resolve(row)
            })
        }).then(
        (row) => {
            console.log(row.UserFollowing);
            db.run("SELECT UserName FROM User WHERE UserID IN ", row.UserFollowing, function (err, row) {
                if (err) {
                    console.log(err);
                    reject(err);
                    return false;
                }
                resolve(row)
            }).then(
                (row) => {
                    console.log(row.UserID);
                }
            )
        }
        ).catch(
        (err) => {
            console.log(err);
        });
}


exports.addUser = addUser;
exports.getUserIDByName = getUserIDByName;