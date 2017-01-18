describe("VergeParser", function() {
  var request = require("request"),
  VergeParser = require("../../vergeparser.js");  
  
  describe("parseFeaturedArticles", function() {
	it("returns expected results", function(done) {
	  // arrange 
	  var vergeParser = new VergeParser(request);
	  
	  // act
	  vergeParser.parseFeaturedArticles(function(result) {
		console.log(result);  
		  
		// assert
  		expect(result.length).toBeGreaterThan(0);
		for (var i = 0; i < result.length; i++) {
		  var singleResult = result[i];
		  expect(singleResult.url).toEqual(jasmine.any(String));
		  expect(singleResult.title).toEqual(jasmine.any(String));
        }
		done();
	  });
    });  
  });
});