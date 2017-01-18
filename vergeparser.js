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
		console.error(response, error);
        callback([]);
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
