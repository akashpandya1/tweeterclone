var main = require('../tweetdb.js');
var assert = require('assert');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();


describe('::TweetDB Test::', function () {
    it('for insert tweet', function () {
        var tempJsonObj = '[{"tweetText" : "second tweet", "authorID" : "2"}]';
        var st = main.insertTweet(tempJsonObj);
        assert.equal(st, true);
    });


    it('for tweet table pass in tweet userid or likeid', function (done) {
        var st = main.updateAnyColumnWithExistingData("retweeter_userid", 3, 4);
        st.then(function (data) {
            try {
                assert.equal(data, true);
                done();

            } catch (err) {
                done(err);
            }
        }, function (err) {
            done(err);
        });

    });


    it('for tweet table pass in tweet userid or likeid', function () {
        var st = main.updateAnyColumnWithExistingData("retweeter_userid", 3, 4);
        return st.should.eventually.equal(true);
    });


     it('select all from tweet', function () {
        var st = main.selectRec();         
        return st.should.eventually.equal().tempJsonObj;
    });

    it('delete from tweet', function () {
        var st = main.deleteRec(7);         
        assert.equal(st, true);
    });
    
});