const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
require("dotenv").config();

let _db;

const { DB_USER, DB_PASSWORD, DB_CLUSTER } = process.env;

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net/shop?retryWrites=true&w=majority`;

const mongoConnect = (callback) => {
  MongoClient.connect(uri)
    .then((client) => {
      console.log("Connected!");
      _db = client.db()
      callback(client);
    })
    .catch((err) => {
      console.log(err)
      throw err
    });
};

const getDb = () => {
  if(_db) {
    return _db
  }
  throw 'No database found!!'
}

module.exports = {
  mongoConnect,
  getDb
}
