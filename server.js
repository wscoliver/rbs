var http = require('http');
var url = require('url');

function start(handle, route){
  function onRequest(request, response){
    var postData = "";
    var pathname = url.parse(request.url).pathname;
    console.log('Request for '+pathname+' has been recieved');
    //Apply UTF-8 encoding
    var cookies = parseCookies(request);
    console.log('Cookies...');
    console.log(cookies);    

    request.setEncoding('utf8');
    request.addListener('data',function(postDataChunk){
    postData += postDataChunk;
    console.log('Recieved POST data chunk "'+postDataChunk+'".');
    });
    request.addListener('end',function(){
    // Pass on the response to the router
    route(handle, pathname, response,postData,cookies);
    });
  }
  function parseCookies(request){
    var list = {},
        rc = request.headers.cookie;
    
    rc && rc.split(';').forEach(function( cookie ) {
      var parts = cookie.split('=');
      list[parts.shift().trim()] = unescape(parts.join('='));
    
      
    });
    return list;
  }

  http.createServer(onRequest).listen(8888);
  console.log('Server has started.');
}

exports.start = start;
