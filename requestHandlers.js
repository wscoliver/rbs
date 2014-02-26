//Include the nonblocking functionality
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var Template = require('./Template.js');
//Specify BASE PATH
var base_path = '/home/nodeuser/nodeProjects/';

//Include the processing of text variable in postData
var querystring =  require('querystring');

function start(response, postData, cookies){
  console.log('Request handler "start" was called.');
  var body="";
  //Write the base path for base.html
  var tgt_path=path.join(base_path,'/block/base/');
  var file_output = fs.readFileSync(tgt_path+'base.phtml','utf8',function(err, data){
    if(err){
      return console.log(err);
    }
    console.log(data);
    return data;
 
  });
  var t=Template.render(file_output);  
  response.writeHead(200,{"Set-Cookie":"aycookie=test2","Content-Type":"text/html"});
  response.write(t);
  response.end();


}
function upload(response,postData, cookies){
  console.log('Request handler "upload" was called.');
  response.writeHead(200, {'Content-Type':'text/plain'});
  response.write('You have sent : '+querystring.parse(postData).text);
  response.end();
}

exports.start = start;
exports.upload = upload;

