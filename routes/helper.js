
/*
Gets the repo information for a Github User and calls the designated callback

@params username Name of the User
@params cb Callback with params (error, data)
@params https Https module, or injectable if testing
*/
var getGithubRepos = function(username, cb, https) {
  https.get({
    hostname: 'api.github.com',
    path: '/users/'+username+'/repos',
    headers: {
      'User-Agent': 'ghAnalyst'
    }
  }, function(response) {
    var dataStack = "";
    response.setEncoding('utf8');
    response.on('data', function(d) {
      dataStack += d;
    });
    response.on('end', function() {
      cb(null, dataStack);
    });
  }).on('error', function(e) {
    cb(e);
  });
};

/*
Turns the returned Github data into something more usable

@params data Parsed data from Github Repository API
@returns Returns object with properties: {
    languages: Array,
    avatar: String url,
    repositories: Array,
    popularity: Integer
  }
*/
function processGithubRepoData(data) {
  var languages = {},
      repositories = [],
      popularity = 0;
  data.forEach(function(repo, i) {
    if(repo.fork) {
      return;
    }
    if(repo.language) {
      if(repo.language in languages) {
        languages[repo.language]++;
      } else {
        languages[repo.language]=1;
      }
    }
    repositories.push(repo);
    popularity += repo.stargazers_count;
  });
  
  return {
    languages: sortLanguages(languages),
    avatar: data.length>0 ? data[0].owner.avatar_url : "",
    repositories: repositories,
    popularity: popularity
  };
};

/*
Turns the language map into a sorted list

@params list Object with keys as language name and value as times used
@returns Sorted Array
*/
function sortLanguages(list) {
  var sorted = [];
  for(var lang in list) {
    if (typeof(lang) !== "string") {
      continue;
    }
    sorted.push({
      language: lang,
      score: list[lang]
    });
  }
  
  return sorted.sort(function(a, b) {
    return b.score - a.score;
  });
};

module.exports = {
  getGithubRepos: getGithubRepos,
  processGithubRepoData: processGithubRepoData,
  sortLanguages: sortLanguages
}