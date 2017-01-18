# theverge-parser
Parse article data from The Verge home page (http://www.theverge.com)

## Usage
```javascript
var request = require("request");
VergeParser = require("theverge-parser"),
var vergeParser = new VergeParser(request);

vergeParser.parseFeaturedArticles(function(featuredArticles) {
  console.log(featuredArticles);
});
```
