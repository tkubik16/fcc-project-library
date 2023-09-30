/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {

  let mongoose = require('mongoose');
  mongoose.connect(process.env.DB, { useNewUrlparser: true, useUnifiedTopology: true });

  const bookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    commentcount :{
      type: Number,
      required: true
    }
  })

  const Book = mongoose.model('Book', bookSchema);

  app.use( function( req, res, next) {
    console.log(req.method + " " + req.path);
    console.log(req.body);
    next();
  })

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
