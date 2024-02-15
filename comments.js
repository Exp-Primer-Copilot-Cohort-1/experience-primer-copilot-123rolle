// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var port = 8080;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var Comment = require('./models/comment');
var cors = require('cors');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('./config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/comments');

app.get('/comments', function(req, res) {
  Comment.find(function(err, comments) {
    if (err) {
      throw err;
    }
    res.json(comments);
  });
});

app.post('/comments', function(req, res) {
  var newComment = new Comment(req.body);
  newComment.save(function(err) {
    if (err) {
      throw err;
    }
    res.json(req.body);
  });
});

app.delete('/comments/:id', function(req, res) {
  Comment.findById(req.params.id, function(err, comment) {
    if (err) {
      throw err;
    }
    comment.remove(function(err) {
      if (err) {
        throw err;
      }
      res.json({success: true});
    });
  });
});

app.listen(port, function() {
  console.log('Server running on port ' + port);
});