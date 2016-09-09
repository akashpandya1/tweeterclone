var express = require('express'),
    app = express(),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('test.db'),
    fs = require('fs'),
    html = fs.readFileSync('./tweet.html'),
    createtweet = fs.readFileSync('./createtweet.html'),
    dbInsertTweet = require('./tweetdb.js').insertTweet,
    dbDeleteTweet = require('./tweetdb.js').deleteRec,
    dbSelectRecForTweet = require('./tweetdb.js').selectRecForTweet,  
    dbAllTweets = require('./tweetdb.js').selectRec
    bodyParser = require('body-parser');
    ejs = require('ejs');
    os = require('os');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
    extended: true
    }));
    
app.post('/tweet', function(req, res) {    
    console.log("tweet");
     var user = {
        userid: req.body.userid,
     }       
     console.log("tweet userid:" + user.userid);   
     fs.readFile('createtweet.html', 'utf-8', function(err, content) {
         if (err) {
             res.end('error occurred');
             return;
         } 

     var renderedHtml = ejs.render(content, {userid: user.userid});  
     console.log("renderedHtml:" + renderedHtml);  
     res.end(renderedHtml);  
   });  
});

app.post('/createtweet', function(req, res) {
    console.log("createtweet");
     
     var createTweet = {
         tweetText: req.body.tweettext,
         authorID: req.body.userid        
     };
    console.log("createtweet:" + createTweet.userid + "," + createTweet.tweettext);    
    jSONStr = '[' + JSON.stringify(createTweet) + ']';    
    console.log("jSONStr: " + jSONStr);
    dbInsertTweet(jSONStr);
    res.send('Tweeted!');        
});

app.post('/deletetweet', function(req, res) {
    console.log("deletetweet");
     
     var deleteTweet = {
        tweetid: req.body.tweetid        
     }; 

    console.log("tweetid:" + deleteTweet.tweetid);    

    var p = dbDeleteTweet(deleteTweet.tweetid);
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
    var p = dbAllTweets();
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
    var p = dbSelectRecForTweet(selectTweetRec.tweetid);
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