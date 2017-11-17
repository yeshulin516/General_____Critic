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


function addReview(title, review){
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var reviewSturct = { title: title, review: review };
  db.collection("customers").insertOne(reviewStruct, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
}

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
  console.log(URL.parse(req.url, true).query);
  res.redirect('/');
});

app.get('/read-req', function(req, res) {
  console.log(URL.parse(req.url, true).query);
  res.redirect('/');
});







