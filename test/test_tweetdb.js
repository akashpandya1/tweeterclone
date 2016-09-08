var main = require('../tweetdb.js');
var assert = require('assert');

describe('update AnyColumn With Existing Data', function () {
    it('for tweet table pass in tweet userid or likeid', function () {
        var st = main.updateAnyColumnWithExistingData();         
        updateAnyColumnWithExistingData("retweeter_userid", 3, 4);
    }); 
});