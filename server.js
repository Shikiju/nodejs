var http = require("http").createServer(start.onRequest);
var url = require("url");
var io = require('socket.io').listen(http);

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    route(handle, pathname, response, request);
  }
 
  http.listen(8888);

  //io.sockets.on('connection', function (socket) {
  //  socket.emit('position', {pos: {x: 775, y: 180}, name: 'Karel', paddle: {height: 100, width: 25}});
  //  socket.on('updatePosition', function (data) {
  //    socket.emit('position', data);
  //  });
    //});
  
  var player1 = '',
    player2 = '';
  

  io.sockets.on('connection', function (socket) {
    io.sockets.emit('identify', { msg: 'Please send a nickname' });

    socket.on('set nickname', function (name) {
      socket.set('nickname', name, function () {
        if (player1 == '') {
          player1 = name;
          socket.emit('waiting for players');
        }
        else {
          player2 = name;
          socket.emit('ready');
        }
      });
    });

    socket.on('msg', function (msg) {
      socket.get('nickname', function (err, name) {
        console.log('Position update from: ', name);
        console.log(msg);
      });
    });

    socket.on('disconnect', function () {
      io.sockets.emit('user disconnected');
    });
  });
  
  console.log("Server has started.");
}

exports.start = start;