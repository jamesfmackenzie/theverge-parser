// vergeparser.js
var request,
htmlparser = require('htmlparser2');

var VergeParser = function (request) {
	this.request = request;
};

VergeParser.prototype.parseFeaturedArticles = function (callback) {
  this.request('http://www.theverge.com/', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	callback(parseFeaturedArticlesFromHtml(body));
      }
	  else {
        callback(error);
	  }
    });
}

function parseFeaturedArticlesFromHtml(html) {
	var parsedArticles = [],
	insideHeaderSection = false,
	insideHeadlineTag = false,
	tagCount = 0,
			parser = new htmlparser.Parser({
    			onopentag: function(name, attribs){
        			if(name == "div" && attribs.class === "c-seven-up__main"){
						//console.log("entering header section");
						insideHeaderSection = true;
        			}
					if (insideHeaderSection) {
						tagCount++;
						//console.log(tagCount);
					}
					if (name == "h2" && insideHeaderSection && attribs.class === "c-entry-box--compact__title") {
						//console.log("entering h2");
						insideHeadlineTag = true;	
					}
					if (name == "a" && insideHeaderSection && insideHeadlineTag) {
						parsedArticles.push(attribs.href);
					}
    			},
    			ontext: function(text){
					if (insideHeadlineTag) {
						var url = parsedArticles.pop();
						parsedArticles.push({ url: url, title: text });
					}
    			},
    			onclosetag: function(tagname){
					if (insideHeaderSection) {
						tagCount--;
					}	
					if (tagCount <= 0 && insideHeaderSection) {
						//console.log("exiting header section");
						insideHeaderSection = false;
					}
					if (tagname == "h2") {
						//console.log("exiting h2");
						insideHeadlineTag = false;
					}
        		}
			}, {decodeEntities: true});
			
			parser.write(html);
			parser.end();

			return parsedArticles;
}

module.exports = VergeParser;



/*
// TODO: try to make this purely functional so I don't depend on share mutable state
// TODO: accept URL as a parameter

"use strict";

var request = require('request'),
    _ = require('lodash'),
    oauth = require('../oauth.json'),
	jsonfile = require('jsonfile'),
	Entities = require('html-entities').XmlEntities,
	htmlparser = require('htmlparser2'),
    articles = [],
	articleIdsAlreadySeen = [];

function getArticleId(article) {
  return article.url;
}

function getArticle(id) {
	return _.find(articles, function(article) {
	  return article.url == id;
  });
}

function startArrayWatch(array) {
console.log("initial population of articles");
	// load from textfile
	articleIdsAlreadySeen = jsonfile.readFileSync('articles.json');

	//load from the internet
	//articleIdsAlreadySeen = _.map(array, getArticleId);
	console.log(articleIdsAlreadySeen);
}

function watchArray(updatedArray, arrayCallBack) {
	var currentArticleIds = _.map(updatedArray, getArticleId),
	diffs = _.difference(currentArticleIds, articleIdsAlreadySeen);

	if (diffs.length > 0) {
		console.log("NEW ARTICLES FOUND!");
		console.log("New ids: " + diffs);
		_.forEach(diffs, arrayCallBack);	
	}
	else {
		console.log("No new articles found");
	}

	articleIdsAlreadySeen = _.union(currentArticleIds, articleIdsAlreadySeen);
	// add file to database
	jsonfile.writeFileSync('articles.json', articleIdsAlreadySeen);
}

function tweet(id) {
	var article = getArticle(id);
	tweetArticle(article);
}

function tweetArticle(article) {
	var title = shortenTitleIfNecessary(article.title),
	status = title + " " + article.url;

	console.log("Posting tweet! " + status);
	
	request.post({
			url: 'https://api.twitter.com/1.1/statuses/update.json',
			oauth: oauth,
			form: {
				status: status
			}
		}
		, function(e, r, body) {
			if (e) {
				return console.error('post status failed:' + e);
			}
			console.log('post succesful!');
		}
	);
}

function shortenTitleIfNecessary(title) {
	var entities = new Entities();
	var decodedTitle = entities.decode(title);
	
	if (decodedTitle.length > 115) {
		return decodedTitle.substring(0, 114).trim() + "…";
	}

	return decodedTitle;
}

function getArticles(firstRun) {
	request('http://www.theverge.com/', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	console.log("fetched new articles");
		articles = parseArticlesFromHtml(body);
		
		if (articles.length > 20) {
			console.error("irregular article count received: " + articles.length);
		}
		else if (firstRun) {
			startArrayWatch(articles);
		} else {
			watchArray(articles, tweet);
		}
      }
	  else {
		  console.error(response, error);
	  }
	  
	  console.log("finished loop. setting timeout for 60s");
		
		setTimeout(function() {
			console.log("starting another loop");
			getArticles(null, false);
		}, 60000);
    });
}

function parseArticlesFromHtml(html) {

} 

getArticles(true);

*/

