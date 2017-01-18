describe("VergeParser", function() {
  var VergeParser = require("../../vergeparser.js");  
    
  describe("parseFeaturedArticles", function() {
	it("known body, returns expected result", function(done) {
	  // arrange 
	  var requestThatAlwaysReturnsValidStatusCode = function(url, callback) {
		var error = null,
		  response = { statusCode: 200 },
		  body = `
              <div class="l-hero c-seven-up">
                  <div class="c-seven-up__main">
                      <div class="c-entry-box--compact c-entry-box--compact--article c-entry-box--compact--hero" data-chorus-optimize-id="14003941" data-chorus-optimize-module="entry-box" data-analytics-placement="hero:1">
                          <div class="c-entry-box--compact__body">
                              <h2 class="c-entry-box--compact__title"><a data-chorus-optimize-field="hed" data-analytics-link="article" href="http://www.theverge.com/2017/1/17/14239900/chelsea-manning-pardon-obama-wikileaks">President Obama has commuted Chelsea Manning’s sentence</a></h2>
                          </div>
                      </div>
                      <div class="c-entry-box--compact c-entry-box--compact--article c-entry-box--compact--hero" data-chorus-optimize-id="14062717" data-chorus-optimize-module="entry-box" data-analytics-placement="hero:2">
                          <div class="c-entry-box--compact__body">
                              <h2 class="c-entry-box--compact__title"><a data-chorus-optimize-field="hed" data-analytics-link="article" href="http://www.theverge.com/2017/1/17/14298676/oculus-trade-secrets-trial-mark-zuckerberg-palmer-luckey">Zuckerberg takes the stand in Oculus trade secrets trial</a></h2>
                          </div>
                      </div>
                  </div>
              </div>
		  `;
		callback(error, response, body);
	  }
	  
	  var vergeParser = new VergeParser(requestThatAlwaysReturnsValidStatusCode);
	  
	  // act
	  vergeParser.parseFeaturedArticles(function(result) {
		  
		// assert
  		expect(result.length).toEqual(2);
		expect(result[0].url).toEqual("http://www.theverge.com/2017/1/17/14239900/chelsea-manning-pardon-obama-wikileaks");
		expect(result[0].title).toEqual("President Obama has commuted Chelsea Manning’s sentence");
		expect(result[1].url).toEqual("http://www.theverge.com/2017/1/17/14298676/oculus-trade-secrets-trial-mark-zuckerberg-palmer-luckey");
		expect(result[1].title).toEqual("Zuckerberg takes the stand in Oculus trade secrets trial");
		done();
	  });
    });  
	
    it("response with ampersand, returns expected result", function(done) {
	  // arrange 
	  var requestThatAlwaysReturnsExactlyOneResultWithAmpersandInTitle = function(url, callback) {
		var error = null,
		  response = { statusCode: 200 },
		  body = `
              <div class="l-hero c-seven-up">
                  <div class="c-seven-up__main">
                      <div class="c-entry-box--compact c-entry-box--compact--article c-entry-box--compact--hero" data-chorus-optimize-id="14003941" data-chorus-optimize-module="entry-box" data-analytics-placement="hero:1">
                          <div class="c-entry-box--compact__body">
                              <h2 class="c-entry-box--compact__title"><a data-chorus-optimize-field="hed" data-analytics-link="article" href="http://www.theverge.com/2017/1/17/14298744/att-2g-network-shutdown-iphone">Your original iPhone won't work on AT&T anymore</a></h2>
                          </div>
                      </div>
                  </div>
              </div>
		  `;
		callback(error, response, body);
	  }
	  
	  var vergeParser = new VergeParser(requestThatAlwaysReturnsExactlyOneResultWithAmpersandInTitle);
	  
	  // act
	  vergeParser.parseFeaturedArticles(function(result) {
		  
		// assert
  		expect(result.length).toEqual(1);
		expect(result[0].url).toEqual("http://www.theverge.com/2017/1/17/14298744/att-2g-network-shutdown-iphone");
		expect(result[0].title).toEqual("Your original iPhone won't work on AT&T anymore");
		done();
	  });
    });  
	
    it("bad status code, returns empty array", function(done) {
	  // arrange 
	  var requestThatAlwaysReturnsBadStatusCode = function(url, callback) {
		var error = null,
		  response = { statusCode: 500 },
		  body = "";
		callback(error, response, body);
	  }
	  
	  var vergeParser = new VergeParser(requestThatAlwaysReturnsBadStatusCode);
	  
	  // act
	  vergeParser.parseFeaturedArticles(function(result) {  
		  
		// assert
  		expect(result).toEqual([]);
		done();
	  });
    }); 
  });
});