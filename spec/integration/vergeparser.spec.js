describe("VergeParser", function() {
  var request = require("request"),
  VergeParser = require("../../vergeparser.js");  
  
  describe("parseFeaturedArticles", function() {
	it("returns at least one result", function(done) {
	  // arrange 
	  var vergeParser = new VergeParser(request);
	  
	  // act
	  vergeParser.parseFeaturedArticles(function(result) {
		console.log(result);  
		  
		// assert
  		expect(result.length).toBeGreaterThan(0);
		done();
	  });
    });  
  });
});