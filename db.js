var mongoClient = require("mongodb").MongoClient;
var gameDb;

mongoClient
  .connect("mongodb://localhost:27017/game", { useNewUrlParser: true })
  .then((conn) => {
    gameDb = conn.db("game");
  })
  .catch((err) => console.log(err));

function updateScore(name, points, callback) {
  gameDb
    .collection("scoreboard")
    .findOne({ name: name }, function (err, player) {
      if (err) {
        console.log(err);
      } else {
        if (player) {
          gameDb
            .collection("scoreboard")
            .updateOne(
              { name: name },
              { $set: { score: player.score + points } },
              { upsert: true }
            );
        } else {
          gameDb
            .collection("scoreboard")
            .insertOne({ name: name, score: points }, callback);
        }
      }
    });
}

function getScore(callback) {
  gameDb.collection("scoreboard").find({}).toArray(callback);
}

function resetScoreboard(callback) {
  gameDb.collection("scoreboard").deleteMany({}, callback);
}

module.exports = { updateScore, getScore, resetScoreboard };
