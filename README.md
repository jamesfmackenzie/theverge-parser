# theverge-parser
Parse article data from The Verge home page (http://www.theverge.com)

## Usage
```javascript
var request = require("request");
var VergeParser = require("vergeparser");
var vergeParser = new VergeParser(request);

vergeParser.parseFeaturedArticles(function(featuredArticles) {
  console.log(featuredArticles);
});
```
