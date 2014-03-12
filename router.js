var static_server = require('./static.js');

function route(handle, pathname, response, postData, cookies, query){
  console.log('About to route a request for '+pathname);
  if (typeof handle[pathname] === 'function'){
    //Pass response to handle

    //Check if the handle needs a cookie
    var req_cookie = handle[pathname].prototype.reqCookie;
    var req_len = req_cookie.length;
    console.log('Required len: ' + req_len);
    if( req_len == 0 ){
      //console.log(' Cookies are not required');
      handle[pathname](response, postData, cookies, query);
    }
    else{
      //console.log("Needs Cookies");
      //console.log(req_cookie);
      //console.log('These cookies are needed');
     var matched = 0;
       for ( var k in cookies){
        
         if( req_cookie.indexOf(k) != -1 ){
          //console.log("Cookie found");
          matched++;
         }
       }
    if ( matched < req_len ){
      console.log('Access denied...');
      response.writeHead(302 ,{
        'Content-Type':'text/plain',
        'Location': '/login', 
      });
      response.write('Access denied...');
      response.end
    }
    else{
      handle[pathname](response, postData, cookies, query);
    }
  }
  } else {
    console.log('No handler for '+pathname);
    //Check if pathname contains static
    static_server.serve_static(pathname, response);
    /*    
    response.writeHead(404,{'Content-Type':'text/plain'});
    response.write('404 not found');
    response.end();
   */
  }
}

exports.route = route;
