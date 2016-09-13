var express = require('express'),
    app = express();
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('test.db'),
    fs = require('fs'),
    html = fs.readFileSync('./tweet.html'),
    createtweet = fs.readFileSync('./createtweet.html'),
    addUser = fs.readFile('./user.html'),
    dbInsertTweet = require('./tweetdb.js').insertTweet,
    dbDeleteTweet = require('./tweetdb.js').deleteRec,
    dbSelectUserTweets = require('./tweetdb.js').selectUserTweets,  
    dbAllTweets = require('./tweetdb.js').selectRec,
    dbAddUser = require('./userdb.js').addUser,
    dbSelectUserFeeds = require('./tweetdb.js').selectUserFeeds,
    dbGetUserIDByName = require('./userdb.js').getUserIDByName,
    dbGetReplies = require('./tweetdb.js').getReplies,
    bodyParser = require('body-parser');
    ejs = require('ejs');
    os = require('os');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
    extended: true
})); 

 
app.use(express.static('/public'));

 
app.post('/tweet', function (req, res) {
    console.log("tweet");
    var user = {
        userid: req.body.userid,
    }
    console.log("tweet userid:" + user.userid);
    fs.readFile('createtweet.html', 'utf-8', function (err, content) {
        if (err) {
            res.end('error occurred');
            return;
        }

        var renderedHtml = ejs.render(content, { userid: user.userid });
        console.log("renderedHtml:" + renderedHtml);
        res.end(renderedHtml);
    });
});

app.post('/user', function(req, res) {    
    console.log("user");
     var user = {
        userid: req.body.userid,
     }       
     console.log("user userid:" + user.userid);   
     fs.readFile('user.html', 'utf-8', function(err, content) {
         if (err) {
             res.end('error occurred');
             return;
         } 

     var renderedHtml = ejs.render(content, {userid: user.userid});
     res.end(renderedHtml);  
   });  
});

 
app.get('/getUserFeeds/:userId', function(req, res) {
     var useid = req.params.userId
     console.log("userid:" + useid);   
     var p = dbSelectUserFeeds(useid);
     p.then(
        (val) => {
            res.send(val);
            }
        ).catch(
            (err) => {
            res.send(err);
        });       
});



app.get('/getUserTweets/:userId/', function(req, res) {
     var userid = req.params.userId;     
     console.log("getUserTweets userid:" + userid);   
     var p = dbSelectUserTweets(userid);
     p.then(
        (val) => {
             fs.readFile('user.html', 'utf-8', function(err, content) {
                if (err) {
                    res.end('error occurred');
                    return;
                } 

            var renderedHtml = ejs.render(content, {userTweets: val});
            res.end(renderedHtml);  
            });
       });       
});

app.get('/getReplies/:tweetID', function(req, res) {
     var tweetID = req.params.tweetID
     console.log("tweetID:" + tweetID);   
     var p = dbGetReplies(tweetID);
     p.then(
        (val) => {
            res.send(val);
          }
        ).catch(
            (err) => {
            res.send(err);
        });         
}); 



app.post('/addUser', function(req, res) {
    console.log("adding user");     
     var newUser = {
         UserName: req.body.userName,
         UserProfile: req.body.userProfile        
     };
    jSONStr = '[' + JSON.stringify(newUser) + ']'; 
    dbAddUser(jSONStr);
    res.send('user added');        
});

app.post('/createtweet', function (req, res) {
    console.log("createtweet");

    return new Promise(
        (resolve, reject) => {
                var id = dbGetUserIDByName(req.body.userid);
                resolve(id);
            ;
        }).then(
        (id) => {
            var createTweet = {
        tweetText: req.body.tweettext,
        authorID: id,
    };
    console.log("createtweet:" + createTweet.userid + "," + createTweet.tweettext);
    jSONStr = '[' + JSON.stringify(createTweet) + ']';
    console.log("jSONStr: " + jSONStr);
    dbInsertTweet(jSONStr);
    res.send('Tweeted!');
        }
        ).catch(
        (err) => {
            console.log(err);
        });  
});

app.post('/deletetweet', function (req, res) {
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


app.post('/selecttweet', function (req, res) {
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


app.post('/tweetLike', function (req, res) {
    console.log("tweetLike");
    var tweetLikeRec = {
        tweetid: req.body.tweetid,
        userid: req.body.userid
    };
    var p = updateAnyColumnWithExistingData('retweeter_userid', tweetLikeRec.tweetid, tweetLikeRec.userid);
    p.then(
        (val) => {
            res.send(true);
        }
    ).catch(
        (err) => {
            res.send(err);
        });
});


app.post('/selectRecForTweet', function (req, res) {
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

 app.get('/', function (req, res) {
    res.send(html);

});  


app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});

 