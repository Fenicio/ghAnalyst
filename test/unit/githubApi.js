var expect = require("expect.js");
var helper = require('../../routes/helper');

describe('Can use Github Api', function() {
  it('getGithubRepos should call get', function() {
    //Manual mockup, should use Sinon
    var fakeHttps = {
      called: false,
      get: function(req, cb) {
        this.called=true;
        return {
          on: function() {
            ;
          }
        }
      }
    };
    helper.getGithubRepos('anyusername', function(err, data) {
      
    }, fakeHttps);
    expect(fakeHttps.called).to.be.ok();
  });
  
  it('processGithubRepoData shouldnt crash on empty array', function() {
    helper.propertyIsEnumerable([]);
  });
  
  it('sortLanguages should work on proper conditions', function() {
    var sorted = helper.sortLanguages({
      "A": 1,
      "B": 2,
      "C": 3
    });
    expect(sorted[0]).to.eql({ language: "C", score: 3 });
    expect(sorted[1]).to.eql({ language: "B", score: 2 });
    expect(sorted[2]).to.eql({ language: "A", score: 1 });
  });
  
  it('sortLanguages should not reorder if not orderable', function() {
    var sorted = helper.sortLanguages({
      "A": 1,
      "B": 1,
      "C": 1
    });
    expect(sorted[0]).to.eql({ language: "A", score: 1 });
    expect(sorted[1]).to.eql({ language: "B", score: 1 });
    expect(sorted[2]).to.eql({ language: "C", score: 1 });
  });
});