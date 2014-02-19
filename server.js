var http = require('http');
var url = require('url');

function start(handle, route){
  function onRequest(request, response){
    var postData = "";
    var pathname = url.parse(request.url).pathname;
    console.log('Request for '+pathname+' has been recieved');
    //Apply UTF-8 encoding
    request.setEncoding('utf8');
    request.addListener('data',function(postDataChunk){
    postData += postDataChunk;
    console.log('Recieved POST data chunk "'+postDataChunk+'".');
    });
    request.addListener('end',function(){
    // Pass on the response to the router
    route(handle, pathname, response,postData);
    });
  }

  http.createServer(onRequest).listen(8888);
  console.log('Server has started.');
}

exports.start = start;
