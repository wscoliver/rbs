//Include the files
var fs = require('fs');
var path = require('path');
var static_path ='/home/nodeuser/nodeProjects/';

function serve_static( pathname , response ){
  var arr = [],
  s = pathname,
  re = /static\/([\d\D]*?)/gi,
  item;

  if ( pathname.search(re) != -1){
    var dir_path = path.join(static_path, pathname);
    //Check if this path exists
    fs.exists(dir_path, function(exists){
      if( !exists ){
      response.writeHead('404', {'Content-Type' : 'text/plain'});
      response.write('404 not found\n');
      response.end();
      return;
      }
      fs.readFile( dir_path, 'binary', function(err, file){
        if(err){
          response.witeHead('500', {'Content-Type' : 'text/plain'});
          response.write(err + '\n' );
          response.end();
          return;
        }
        response.writeHead('200');
        response.write(file, 'binary');
        response.end();
      });
    
  });
  }
}
exports.serve_static = serve_static;
