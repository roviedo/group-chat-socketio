var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var users = [];

io.emit('some event', { for: 'everyone' });


io.on('connection', function(socket){
  console.log('a user connected');

  socket.broadcast.emit('hi');

  socket.on('chat message', function(obj){
    io.emit('chat message', obj);
  });

  socket.on('add user', function(userName) {
    socket.userName = userName;
    if (users.includes(userName)) return;

    users.push(userName);
    io.emit('add user', userName);

    io.emit('user joined', {
      userName: socket.userName,
      users: users
    });
  });

  socket.on('disconnect', function() {
    var disconnectedUser = socket.userName;
    users.pop(disconnectedUser);
    io.emit('user left', {
        disconnectedUser: disconnectedUser
    });
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});