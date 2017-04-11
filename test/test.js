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