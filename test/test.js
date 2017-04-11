var server = require('../server/server.js');
var request = require('supertest');
var expect = require('chai').expect;

describe ('GET /', function() {
    it('should respond with 200 OK status code', function(done){
        request(server)
            .get('/')
            .expect(200, done);
    });
});

describe ('GET /users/:user/expenses', function () {
    it('should respond with a JSON array of expenses', function(done){
        request(server)
            .get('/users/Wint/expenses')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe ('GET /users/:user/expenses', function() {
    it('should respond with a JSON expense object with dateTime, amount, and description properties', function(done){

        function hasProperties(res){
            console.log(res.body);
            if (!('date_time' in res.body)){
                throw new Error('missing dateTime property');
            }
            if (!('amount' in res.body)){
                throw new Error('missing amount property');
            }
            if (!('description' in res.body)){
                throw new Error('missing description property');
            }
        }

        request(server)
            .get('/users/Wint/expenses/1')
            .set('Accept', 'application')
            .expect('Content-Type', /json/)
            .expect(hasProperties)
            .end(done);
    });
});