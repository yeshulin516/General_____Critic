var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = "mongodb://user:user12345@10.0.8.220:27017/mydb"


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log(err);
});