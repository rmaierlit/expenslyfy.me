/*eslint-env node, mocha*/
var selenium = require("selenium-webdriver");
var By = selenium.By;
var expect = require("chai").expect;

var driver = new selenium.Builder()
    .withCapabilities(selenium.Capabilities.chrome())
    .build()

before(function() {
    this.timeout(10000)
    //return statements are used so that mocha will wait for promises to resolve
    return driver.getWindowHandle()
});

after(function() {
    return driver.quit();
});

describe('Integration Tests', function() {
    beforeEach(function(){
        return driver.get('localhost:6565');
    });
    it('should dislpay the title', function() {
        return driver.findElement(By.css('h1')).getText()
            .then(text => expect(text).to.equal("Expenslyfy.me"));
    });
    it('should begin at the login screen', function() {
        return driver.findElement(By.css('#login h2')).getText()
            .then(text => expect(text).to.equal("Login:"));
    });
    it('should allow the user to sign in with their username and password', function(){
        return driver.findElement(By.css('[data-name="user"]')).sendKeys('Wint')
            .then(_ => driver.findElement(By.css('[data-name="password"]')).sendKeys('@dril'))
            .then(_ => driver.findElement(By.css('#login button')).click())
            .then(_ => driver.findElement(By.css('#login h2')).getText())
            .then(text => expect(text).to.equal("Logged In As Wint"));
    });
    it('should allow the user to log out', function() {
        return driver.findElement(By.css('[data-name="user"]')).sendKeys('Wint')
            .then(_ => driver.findElement(By.css('[data-name="password"]')).sendKeys('@dril'))
            .then(_ => driver.findElement(By.css('#login button')).click()) //logging in
            .then(_ => driver.findElement(By.css('#login h2')).getText())
            .then(text => expect(text).to.equal("Logged In As Wint"))
            .then(_ => driver.findElement(By.css('#login button')).click()) //logging out
            .then(_ => driver.findElement(By.css('#login h2')).getText())
            .then(text => expect(text).to.equal("Login:"));
    });
});
