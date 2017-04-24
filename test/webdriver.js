/*eslint-env node, mocha*/
var selenium = require("selenium-webdriver");
var expect = require("chai").expect;

var driver = new selenium.Builder()
    .withCapabilities(selenium.Capabilities.chrome())
    .build()

before(function() {
    this.timeout(10000)
    driver.getWindowHandle()
});

after(function() {
    driver.quit();
})

describe('Integration Tests', function() {
    beforeEach(function(){
        this.driver.get('http://localhost:6565')
    })
    driver.getTitle().then(title => console.log(title));
    expect(true).to.equal(true);
});
