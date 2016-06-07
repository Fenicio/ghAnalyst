var express = require('express');
var https = require('https');
var helper = require('./helper');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Github Analyst' });
});

/* GET user page */
router.get('/user/:username', function(req, res, next) {
  helper.getGithubRepos(req.params.username, function(err, data) {
    if(err!==null) {
      return;
    }
    var parsedData = JSON.parse(data);
    if(parsedData.message) {
      res.render('notfound'); 
    } else {
      var processedData = helper.processGithubRepoData(parsedData),
          title="";
      if(processedData.languages.length>0) {
        title = "Experienced "+processedData.languages[0].language+" Developer";
      } else {
        title = "Newbie";
      }
      res.render('user', { 
        username: req.params.username, 
        content: data,
        popularity: processedData.popularity,
        languages: processedData.languages,
        avatar: processedData.avatar,
        importantRepo: processedData.repositories,
        title: title
      });
    }
  }, https);
});

/* POST */
router.post('/user', function(req, res, next) {
  if(req.body.user==="") {
    res.redirect('/');
  } else {
    res.redirect('user/'+req.body.user);
  }
});

module.exports = router;