var assert = require('assert');
var restAPI = require('./../rest-api/rest-api');
var configResource = require('./../resources/configuration-resource');

restAPI.addResource(configResource.resourceName, configResource);
var server = require('./../server');
server.initialize(restAPI.handleRequest);

var address = 'http://localhost:3000';
var endpoint = require("supertest-as-promised").agent(address);

describe('Test Configurations Resource',function(){
    before(function () {
        server.listen(3000)
    });
    after(function () {
        server.close();
    });
    it('Create configuration, update it, get it, and check it for changes',function(done) {
        //Create a new configuration
        endpoint
            .post('/configurations')
            .send(
                {
                    "name": "resource",
                    "hostname": "192.168.1.1",
                    "port": 8080,
                    "username": "jzangari"
                }
            )
            .expect('Content-type', /json/)
            .expect(201)
            .then(
                //Update a field in the config.
                function(res){
                    var url = res.body.links.this;
                    var id = url.substr(url.lastIndexOf('/') + 1)
                    endpoint
                        .put('/configurations/'+ id)
                        .send(
                            {
                                "name":"resource-endpoint"
                            }
                        )
                        .expect("Content-type",/json/)
                        .expect(204)
                        .then(
                            //get the config.
                            function(res){
                                var url = res.request.url;
                                var id = url.substr(url.lastIndexOf('/') + 1)
                                endpoint
                                    .get('/configurations/'+ id)
                                    .expect('Content-type',/json/)
                                    .expect(200)
                                    .then(
                                    //Assert it looks how we expect.
                                    function(res){
                                        assert.equal('resource-endpoint', res.body.name, "The returned object's name did not match the expected on.");
                                        assert.equal('jzangari', res.body.username, "The returned object's name did not match the expected on.");
                                        assert.equal('192.168.1.1', res.body.hostname, "The returned object's name did not match the expected on.");
                                        assert.equal('resource-endpoint', res.body.name, "The returned object's name did not match the expected on.");
                                        assert.equal('resource-endpoint', res.body.name, "The returned object's name did not match the expected on.");

                                        done();
                                    });
                            });
                }
            )

            ;
    });
    it('Create configuration, get it, delete it, get it with 404',function(done) {
        //Create a new configuration
        endpoint
            .post('/configurations')
            .send(
                {
                    "name": "resource",
                    "hostname": "192.168.1.1",
                    "port": 8080,
                    "username": "jzangari"
                }
            )
            .expect('Content-type', /json/)
            .expect(201)
            .then(
                function(res) {
                    var url = res.body.links.this;
                    var id = url.substr(url.lastIndexOf('/') + 1)
                    endpoint
                        .get('/configurations/' + id)
                        .expect('Content-type', /json/)
                        .expect(200)
                        .then(
                            function(res) {
                                var url = res.request.url;
                                var id = url.substr(url.lastIndexOf('/') + 1)
                                endpoint
                                    .delete('/configurations/' + id)
                                    .expect('Content-type', /json/)
                                    .expect(204)
                                    .then(function(res){
                                        endpoint
                                            .get('/configurations/' + id)
                                            .expect('Content-type', /json/)
                                            .expect(404);
                                        done();
                                    });
                            });
                });
    });
});