var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var path = require('path');
var url = "mongodb://localhost:27017/mydb";
var URL = require('url')
var _ = require('underscore')

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
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// routes will go here

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/submit', function(req, res) {
  res.sendFile(path.join(__dirname + '/submit.html'));
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
  res.redirect('/submit');
});
});

app.get('/full-text', function(req, res) {
  MongoClient.connect(url, function (err, db) {
    var title = URL.parse(req.url, true).query.Title
    var reviews = db.collection('Reviews').find()
    var match
    reviews.each(function(err, item) {
      if (item != null)
      {
        var revTitle = item.Title
        console.log(title)
        console.log(revTitle)
        if (title.valueOf() === revTitle.valueOf()){
          match = item
        }
      }
      else{
        res.render('fullText', match)
        db.close()
        return
      }
    });
  });
});

app.get('/read-req', function(req, res) {
  MongoClient.connect(url, function (err, db) {
    var reviews = db.collection('Reviews').find()
    var search = URL.parse(req.url, true).query.Search
    var categories = URL.parse(req.url, true).query.Categories
    var searchType = typeof(categories)
    //console.log(searchType)
    //search = search.substring(0, search.length - 2)

    // search.replace('\\', '\\\\')
    // search.replace('\.', '\\\.')
    // search.replace('\+', '\\\+')
    // search.replace('\*', '\\\*')
    // search.replace('\?', '\\\?')
    // search.replace('\[', '\\\[')
    // search.replace('\]', '\\\]')
    // search.replace('\^', '\\\^')
    // search.replace('\$', '\\\$')
    // search.replace('\(', '\\\(')
    // search.replace('\)', '\\\)')
    // search.replace('\{', '\\\{')
    // search.replace('\}', '\\\}')
    // search.replace('\=', '\\\=')
    // search.replace('\!', '\\\!')
    // search.replace('\<', '\\\<')
    // search.replace('\>', '\\\>')
    // search.replace('\|', '\\\|')
    // search.replace('\:', '\\\:')
    // search.replace('\-', '\\\-')

    var re = new RegExp(search, "i")
    var sendObj = {};
    var items = [];
    reviews.each(function(err, item) {
      if (item != null){
        var title = item.Title
        var review = item.Review
        var titleMatches = title.match(re)
        var reviewMatches = review.match(re)
        if (titleMatches != null || reviewMatches != null || search.valueOf() === "\r\n".valueOf()){
          if (categories != undefined)
          {
            reviewType = typeof(item.Catagories)
            console.log(reviewType)
            if (item.Catagories != undefined)
            {
              if (searchType.valueOf() === "string".valueOf())
              {
                if (reviewType.valueOf() === "string".valueOf())
                {
                  if (item.Catagories.valueOf() === categories.valueOf())
                    items.push(item);
                }
                else
                {
                  if (item.Catagories.indexOf(categories) > -1)
                    items.push(item);
                }
              }
              else
              {
                if (reviewType.valueOf() === "string".valueOf())
                {
                  if (categories.indexOf(item.Catagories) > -1)
                    items.push(item);
                }
                else
                {
                  var intersect = _.intersection(categories, item.Catagories)
                  if (intersect.length > 0)
                    items.push(item);
                }
              }
            }
          }
          else
          {
            items.push(item);
          }
        }
      }
      else{
        sendObj["items"] = items;
        res.render('respBody', sendObj);
        db.close();
      }
    });
    
  });
});







