var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , driver = require('./rbs_driver.js')
  , bdriver = require('./block_driver.js');
app.listen(8881);

function handler(req, res){
  res.writeHead(200);
  res.write('Websocket is online...');
  res.end();
}

io.sockets.on('connection', function(socket){
  socket.emit('news', { hello : 'world'});

 socket.on('rbs_res', function (data, fn){
    //console.log('Querying the rbs residents...');
    //console.log(data);
    //fn(data.cmd);
    //Pass on the function
    driver.exec(data, fn);
  });
 socket.on('rbs_blockadmin', function (data, fn){
    //console.log('Querying the rbs residents...');
    //console.log(data);
    //fn(data.cmd);
    //Pass on the function
    bdriver.exec(data, fn);
  });
});

