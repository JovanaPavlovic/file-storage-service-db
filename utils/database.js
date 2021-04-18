const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let db;

const mongoConnect = MongoClient.connect(process.env.MONGO_CONNECTION_STRING, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then((client) => {
    console.log("Connected to database");
    db = client.db();
  })
  .catch((err) => {
    console.log("Could not connect to MongoDB....", err);
  });

const getDb = () => {
  if (db) {
    return db;
  }
};
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
