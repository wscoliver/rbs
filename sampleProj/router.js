function route(handle, pathname, response){
  console.log('About to route a request for '+pathname);
  if (typeof handle[pathname] === 'function'){
    //Pass response to handle
    handle[pathname](response);
  } else {
    console.log('No handler for '+pathname);
    response.writeHead(404,{'Content-Type':'text/plain'});
    response.write('404 not found');
    response.end();
  }
}

exports.route = route;
