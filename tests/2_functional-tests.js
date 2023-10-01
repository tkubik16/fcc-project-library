/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

var bookId;
before(() => {
  chai.request(server)
    .keepOpen()
    .post('/api/books')
    .type('form')
    .send({
      title: 'Will Exist'
    })
    .end(function (err, res) {
      bookId = res.body._id;
    })
})

var bookIdToDelete;
before(() => {
  chai.request(server)
    .keepOpen()
    .post('/api/books')
    .type('form')
    .send({
      title: 'Will Exist to delete'
    })
    .end(function (err, res) {
      bookIdToDelete = res.body._id;
    })
})

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */
  
  suite('Routing tests', function() {
    

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .keepOpen()
          .post('/api/books')
          .type('form')
          .send({
            title: 'testTitle'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200, 'Response should be 200');
            assert.property(res.body, '_id', 'The res should have an _id property');
            assert.property(res.body, 'title', 'The res should have a title property');
            if( res.body.hasOwnProperty('title')){
              assert.equal(res.body.title, 'testTitle', 'The title should equal "testTitle"');
            }

          })
        done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .keepOpen()
          .post('/api/books')
          .type('form')
          .send({
          })
          .end(function (err, res) {
            assert.equal(res.status, 200, 'Response should be 200');
            assert.equal(res.text, 'missing required field title', 'res.text should be "missing required field title"');
          })
        done();
      });
      
    });
    
    
    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books/')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });      
      
    });
    
    
    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/adfasd')
          .end(function (err, res) {
            assert.equal(res.status, 200, 'Response should be 200');
            assert.equal(res.text, 'no book exists', 'res.text should be "no book exists"');
          })
        done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${bookId}`)
          .end(function (err, res) {
            assert.equal(res.status, 200, 'Response should be 200');
            //assert.isArray(res.body.comments, 'comments should be an array');
            assert.property(res.body, 'commentcount', 'Book should contain commentcount');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Book should contain _id');
          })
        done();
      });
      
    });
    
    
    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .keepOpen()
          .post(`/api/books/${bookId}`)
          .type('form')
          .send({
            comment: 'The book is pretty good.'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200, 'Response should be 200');
            assert.isArray(res.body.comments, 'comments should be an array');
            assert.property(res.body, 'commentcount', 'Book should contain commentcount');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Book should contain _id');
          })
        done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .keepOpen()
          .post(`/api/books/${bookId}`)
          .type('form')
          .send({
          })
          .end(function (err, res) {
            assert.equal(res.status, 200, 'Response should be 200');
            assert.equal(res.text, 'missing required field comment', 'shoudl return the text "missing required field comment"');
          })
        done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .keepOpen()
          .post('/api/books/6519c391d0e9ca1c89c1ee99')
          .type('form')
          .send({
            comment: 'The book is pretty good.'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200, 'Response should be 200');
            assert.equal(res.text, 'no book exists', 'Response should be text saying "no book exists"');
          })
        done();
      });
      
    });
    
    
    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .keepOpen()
          .delete(`/api/books/${bookIdToDelete}`)
          .end(function (err, res) {
            assert.equal(res.status, 200, 'Response should be 200');
            assert.equal(res.text, 'delete successful', 'Response should be text saying "delete successful"');
          })
        done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .keepOpen()
          .delete(`/api/books/asdfasdf`)
          .end(function (err, res) {
            assert.equal(res.status, 200, 'Response should be 200');
            assert.equal(res.text, 'no book exists', 'Response should be text saying "no book exists"');
          })
        done();
      });

    });
    
  });

});
