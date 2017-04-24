/* eslint-env node, mocha */

var expect = require('chai').expect;
var sinon = require('sinon');
var Helpers = require('../server/helpers.js');

var t = {} //fake mariasql dependency
var helpers = new Helpers(t);

describe ('Content delivery', function() {
    var server = require('../server/server.js');
    var request = require('supertest');
    describe ('GET /', function() {
        it('should respond with 200 OK status code', function(done){
            request(server)
                .get('/')
                .expect(200, done);
        });
    });
});

describe ('Authorization', function() {
    describe('helpers.login', function() {
            var req;
            let res = {};
            res.send = sinon.spy();

        before(function() {
            //fake response for database query during login
            var queryResult = [{
                user_id: '77',
                name: 'Laertes',
                password: '123456',
                is_admin: '1'
            }];

            //fake function to replace the database query
            t.query = function(arg0, arg1, callback) {
                callback(null, queryResult);
            };
        });
        afterEach( function() {
            res.send.reset();
        });
        it('should respond with valid user info if the password matches the user', function() {
            var jwt = require('jsonwebtoken');

            req = {body: {
                user: 'Laertes',
                password: '123456'
            }};

            helpers.login(req, res);

            let data = res.send.args[0][0];
            let decoded = jwt.decode(data.token);

            expect(data.userId).to.equal('77');
            expect(data.name).to.equal('Laertes');
            expect(data.isAdmin).to.equal(true);
            expect(decoded.user).to.equal('Laertes'); //decoded token should contain user name
        });
        it('should not send a jwt if the password does not match', function() {
            req = {body: {
                user: 'Laertes',
                password: 'password'
            }};

            helpers.login(req, res);

            let data = res.send.args[0][0];

            expect(data.token).to.equal(undefined);
        });
    });
});

describe ('CRUD endpoints', function() {
    before(function() {
        t.query = sinon.spy();
        helpers.isAuthenticated = function(req, res, next) {
            next(); //authentication will be ignored for these tests
        };
    });

    afterEach(function() {
        t.query.reset();
    });

    describe ('helpers.getExpenses', function () {
        it('should pass in the correct user name to mariasql', function(){
            let req = {params: {user: 'Laertes'}};
            helpers.getExpenses(req);

            expect(t.query.args[0][1].name).to.equal('Laertes');
            //args[0][1] references the second argument from the first time the spy is called
        });
    });

    describe ('helpers.getAnExpenses', function () {
        it('should pass in the correct user name and expense ID to mariasql', function(){
            let req = {params: {user: 'Laertes', expenseId: '6'}};
            helpers.getAnExpense(req);

            expect(t.query.args[0][1].name).to.equal('Laertes');
            expect(t.query.args[0][1].expenseId).to.equal('6');
        });
    });

    describe ('helpers.getReport', function () {
        it('should pass in the correct user name and query dates to mariasql', function(){
            let req = {params: {user: 'Laertes'}, query: {minDate: "I_am_a_date", maxDate: "I_am_also_a_date"}};
            helpers.getReport(req);

            expect(t.query.args[0][1].name).to.equal('Laertes');
            expect(t.query.args[0][1].minDate).to.equal('I_am_a_date');
            expect(t.query.args[0][1].maxDate).to.equal('I_am_also_a_date');
        });
    });

    describe ('helpers.createExpense', function () {
        it('should pass in the correct user name and expense data to mariasql', function(){
            let req = {
                params: {
                    user: 'Laertes'
                }, 
                body: { 
                    expense: {
                        amount: '0.02',
                        description: 'Werther\'s Original'
                    } 
                } 
            };
            helpers.createExpense(req);

            expect(t.query.args[0][1].name).to.equal('Laertes');
            expect(t.query.args[0][1].amount).to.equal('0.02');
            expect(t.query.args[0][1].description).to.equal('Werther\'s Original');
        });
    });

    describe ('helpers.updateExpense', function () {
        it('should pass in the correct expense ID and expense data to mariasql', function(){
            let req = {
                params: {
                    expenseId: '6'
                }, 
                body: { 
                    expense: {
                        amount: '0.02',
                        description: 'Werther\'s Original'
                    } 
                } 
            };
            helpers.updateExpense(req);

            expect(t.query.args[0][1].expenseId).to.equal('6');
            expect(t.query.args[0][1].amount).to.equal('0.02');
            expect(t.query.args[0][1].description).to.equal('Werther\'s Original');
        });
    });

    describe ('helpers.deleteExpense', function () {
        it('should pass in the correct expense ID to mariasql', function(){
            let req = {
                params: {
                    expenseId: '6'
                },
            };
            helpers.deleteExpense(req);

            expect(t.query.args[0][1].expenseId).to.equal('6');
        });
    });
});