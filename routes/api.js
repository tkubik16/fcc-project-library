/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { log } = require('console');

module.exports = function (app) {

  let mongoose = require('mongoose');
  mongoose.connect(process.env.DB, { useNewUrlparser: true, useUnifiedTopology: true });

  const bookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    commentcount: {
      type: Number,
      required: true
    },
    comments: {
      type: [String]
    }
  })

  const Book = mongoose.model('Book', bookSchema);

  app.use( function( req, res, next) {
    //console.log(req.method + " " + req.path);
    //console.log(req.body);
    next();
  })

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let books = await Book
        .find()
        .select({
          _id: 1, 
          title: 1,
          commentcount: 1
        })
        .exec();
      res.send(books);
    })
    
    .post(function (req, res){
      if( req.body.hasOwnProperty('title') ){
        let title = req.body.title;
        let newBook = new Book({
          title: title,
          commentcount: 0,
          comments: []
        });

        newBook
          .save()
          .then((doc) => {
            //console.log(doc);
            res.json({
              _id: doc._id,
              title: doc.title,
              commentcount: doc.commentcount
            });
          })
          .catch((err) => {
            //console.log(err);
            res.json({error: 'could not create book'});
          })
      }
      else{
        res.send('missing required field title');
      }


    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      let book = await Book
          .deleteMany( {} )
          .exec();
        //console.log(book);
        res.send('complete delete successful');
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      var ObjectId = require('mongoose').Types.ObjectId;
      if( !ObjectId.isValid(bookid)){
        res.send('no book exists');
      }
      else{
        let book = await Book
          .findById( bookid )
          .select({
            _id: 1, 
            title: 1,
            commentcount: 1,
            comments: 1
          })
          .exec();
        res.send(book);
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      if( !req.body.hasOwnProperty('comment') ){
        res.send('missing required field comment');
      }
      else{
        let comment = req.body.comment;
        var ObjectId = require('mongoose').Types.ObjectId;
        
        if( !ObjectId.isValid(bookid)){
          res.send('no book exists');
        }
        else{
          let theBook = await Book
            .findById( bookid )
            .select({
              _id: 1, 
              title: 1,
              commentcount: 1,
              comments: 1
            })
            .exec();
          let update;
          if( theBook != undefined ){
            let newCount = theBook.commentcount + 1;
            let commentArray = [...theBook.comments];
            
            commentArray.push(comment);
            update = {
              comments: [...commentArray],
              commentcount: newCount
            }
            let book = await Book
            .findByIdAndUpdate( bookid, update, {
              new: true,
              includeResultMetadata: true
            })
            .exec();
            console.log(book);
            if( book.lastErrorObject.updatedExisting ){
              //console.log(book.value);
              res.json({
                _id: book.value._id,
                title: book.value.title,
                commentcount: book.value.commentcount,
                comments: book.value.comments,
              });
            }
            else{
              res.send('no book exists');
            }

          }
          else{
            res.send('no book exists');
          }
          
          
          
        }
      }
      
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      
      var ObjectId = require('mongoose').Types.ObjectId;
      if( !ObjectId.isValid(bookid)){
        res.send('no book exists');
      }
      else{
        let book = await Book
          .findByIdAndDelete( bookid )
          .exec();
        console.log(book);
        if( book == null ){
          res.send('no book exists');
        }
        else{
          res.send('delete successful');
        }
      }
    });
  
};
