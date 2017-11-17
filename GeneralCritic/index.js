var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var path = require('path');
var url = "mongodb://localhost:27017/mydb";
var URL = require('url')

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  // db.createCollection("Reviews", function(err, res) {
  //   if (err) throw err;
  //   console.log("Collection created!");
  //   db.close();
  // });
});


var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

// routes will go here

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/write.html', function(req, res) {
  res.sendFile(path.join(__dirname + '/write.html'));
});

app.get('/read.html', function(req, res) {
  res.sendFile(path.join(__dirname + '/read.html'));
});

app.get('/Images/Reading.png', function(req, res) {
  res.sendFile(path.join(__dirname + '/Images/Reading.png'));
});

app.get('/Images/Writing.jpg', function(req, res) {
  res.sendFile(path.join(__dirname + '/Images/Writing.jpg'));
});

app.get('/write-req', function(req, res) {
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  //console.log(URL.parse(req.url, true).query.Title);
  db.collection("Reviews").insertOne(URL.parse(req.url, true).query, function(err, res) {
    if (err) throw err;
    console.log("1 review inserted");
    db.close();
  });
  res.redirect('/');
});
});

app.get('/read-req', function(req, res) {
  //console.log(URL.parse(req.url, true).query);
  MongoClient.connect(url, function(err, db) {
  var search = URL.parse(req.url, true).query.Search;
  search = search.substring(0, search.length - 2);
  //console.log(search);
  var reviews = db.collection('Reviews').find();
  reviews.each(function(err, item) {
        if (item != null){
          var title = item.Title;
          title = title.substring(0, title.length - 4);
          console.log(title);
          console.log(search);
          
          if (title.valueOf() === search.valueOf()){
            console.log(item);
          }
        }
      });
  db.close();
  });
  res.redirect('/');
});







