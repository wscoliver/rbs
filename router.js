function route(handle, pathname, response, postData, cookies){
  console.log('About to route a request for '+pathname);
  if (typeof handle[pathname] === 'function'){
    //Pass response to handle
    handle[pathname](response, postData, cookies);
  } else {
    console.log('No handler for '+pathname);
    response.writeHead(404,{'Content-Type':'text/plain'});
    response.write('404 not found');
    response.end();
  }
}

exports.route = route;
