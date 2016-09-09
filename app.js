var express = require('express'),
    app = express(),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('test.db'),
    fs = require('fs'),
    html = fs.readFileSync('./tweet.html'),
    createtweet = fs.readFileSync('./createtweet.html'),
    dbInsertTweet = require('./tweetdb.js').insertTweet,
    dbDeleteTweet = require('./tweetdb.js').deleteRec,
    dbSelectTweets = require('./tweetdb.js').selectRecForTweet,  
    bodyParser = require('body-parser'),
    user;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.post('/tweet', function(req, res) {    
    console.log("tweet");
     user = {
        userid: req.body.userid,
     }       
     console.log("tweet userid:" + user.userid);  
     res.setHeader("userid", user.userid)   
     res.send(createtweet);      
});

 

app.post('/createtweet', function(req, res) {
    console.log("createtweet");
     
     user.tweettext = req.body.tweettext;

     dbInsertTweet(user,)
      console.log("createtweet:" + user.userid + "," + user.tweettext);       
});


app.get('/', function(req, res) {    
    res.send(html);
   
});


/*** 
app.get('/mainApp', function(req, res) {
    res.send('logged in');
})

app.get('/adduser', function(req, res) {

    var user = {
        userid: req.query.userid,
        password: req.query.password,
        firstname: req.query.firstname,
        lastname: req.query.lastname,
        email: req.query.email

    };
    var p = dbInsertUser(db, user);
    p.then(
        (val) => {
            res.send('User Added');
        }
    ).catch(
        (err) => {
            res.send(err);
        }
    )
});

app.get('/addtweet', function(req, res) {
    var tweet = {
        userid: req.query.userid,
        tweetcontent: req.query.tweetcontent,
        tweetts: new Date()
    };

    var p = dbInsertTweet(db, tweet);
    p.then(
        (val) => {
            res.send('Tweet Added');
        }
    ).catch(
        (err) => {
            res.send(err);
        }
    )
});

app.get('/gettweets', function(req, res) {
    var user = {
        userid: req.query.userid,
    };

    var p = dbGetTweets(db, user);
    p.then(
        (val) => {
            res.send(val);
        }
    ).catch(
        (err) => {
            res.send(err);
        }
    )
});

*/

app.listen(8080, function() {
    console.log('Example app listening on port 8080!');
});