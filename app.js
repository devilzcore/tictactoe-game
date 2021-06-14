var http = require("http");
var fs = require("fs");

var app = http.createServer(callback);

var io = require("socket.io")(app);
var db = require("./db");

app.listen(3000);

function callback(req, res) {
  var filename = req.url == "/" ? "index.html" : __dirname + req.url;

  fs.readFile(filename, function (err, data) {
    if (err) {
      res.writeHead(404);
      return res.end("Arquivo não encontrado!");
    }

    if (req.url.indexOf(".css") != -1)
      res.setHeader("content-type", "text/css");
    else if (req.url.indexOf(".js") != -1)
      res.setHeader("content-type", "text/javascript");
    else res.setHeader("content-type", "text/html");

    res.writeHead(200);
    res.end(data);
  });
}

io.on("connection", function (socket) {
  socket.on("nova jogada", function (params, callback) {
    io.sockets.emit("nova jogada", params);
    if (callback) callback();
  });
  socket.on("novo jogo", function (params, callback) {
    io.sockets.emit("novo jogo", params);
    if (callback) callback();
  });
  socket.on("exibir placar", function (params, callback) {
    db.getScore((err, result) => {
      if (err) {
        return console.log(err);
      }
      io.sockets.emit("exibir placar", result);
      if (callback) callback();
    });
  });
  socket.on("zerar placar", function (params, callback) {
    db.resetScoreboard((err, result) => {
      if (err) {
        return console.log(err);
      }
      io.sockets.emit("zerar placar", params);
      if (callback) callback();
    });
  });
  socket.on("vitoria", function (params, callback) {
    db.updateScore(params.name, params.points, (err, result) => {
      if (err) {
        return console.log(err);
      }
    });
    if (callback) callback();
  });
});
