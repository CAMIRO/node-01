const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
require("dotenv").config();

const { DB_USER, DB_PASSWORD, DB_CLUSTER } = process.env;

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`;

const mongoConnect = (callback) => {
  MongoClient.connect(uri)
    .then((client) => {
      callback(client);
      console.log("Connected!");
    })
    .catch((err) => console.log(err));
};

module.exports = mongoConnect;
