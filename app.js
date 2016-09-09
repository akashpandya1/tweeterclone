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
    user.userid = req.body.userid;
     console.log("tweet userid:" + user.userid);      
     res.render('createtweet');     
});

app.post('/createtweet', function(req, res) {
    console.log("createtweet");
     
     user.tweettext = req.body.tweettext;

    console.log("createtweet:" + user.userid + "," + user.tweettext);    

    var p = insertTweet(createTweet);
    p.then(
        (val) => {
            res.send('Tweeted!');
        }
    ).catch(
        (err) => {
            res.send(err);
        });        
});

app.post('/deletetweet', function(req, res) {
    console.log("deletetweet");
     
     var deleteTweet = {
        tweetid: req.body.tweetid        
     }; 

    console.log("tweetid:" + deleteTweet.tweetid);    

    var p = deleteRec(deleteTweet.tweetid);
    p.then(
        (val) => {
            res.send('Deleted!');
        }
    ).catch(
        (err) => {
            res.send(err);
        });        
});


app.post('/selecttweet', function(req, res) {
    console.log("selecttweet");
    var p = selectRec();
    p.then(
        (val) => {
            res.send('selected all tweets!');
        }
    ).catch(
        (err) => {
            res.send(err);
        });        
});

 

app.post('/selectRecForTweet', function(req, res) {
    console.log("selectRecForTweet");

     var selectTweetRec = {
        tweetid: req.body.tweetid        
     }; 
    var p = selectRecForTweet(selectTweetRec.tweetid);
    p.then(
        (val) => {
            res.send('selected tweet record!');
        }
    ).catch(
        (err) => {
            res.send(err);
        });        
});

app.get('/', function(req, res) {    
    res.send(html);
   
});
 

app.listen(8080, function() {
    console.log('Example app listening on port 8080!');
});