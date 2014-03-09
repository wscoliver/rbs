//Include the nonblocking functionality
var exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path'),
    Template = require('./Template.js'),
    rbs_res = require('./rbs_resident.js');

//Specify BASE PATH
var base_path = '/home/nodeuser/nodeProjects/block/';

//Include the processing of text variable in postData
var querystring =  require('querystring');
/*-------------------------------------
* Index Handler
*
-------------------------------------*/  

function start(response, postData, cookies){
/* We are now going to pass the response function and postData into the template function asyncronously  as this is good practice. The below function will be kept commented for reference
*
*
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

*/
if( cookies['rbs_group'] == 'admin' )
{
  /*
  response.writeHead(200,{"Content-Type":"text/html"});
  response.write('Hello admin, '+cookies['rbs_user']);
  response.end();*/
  
 //Use Admin Panel
    var file_content = fs.readFile(base_path + '/base/base.phtml','utf8', function(err, data){
      if(err){
        return console.log(err);
      }
      var t = Template.render(data);
      response.writeHead(200,{
        'Content-Type' : 'text/html'});
      response.write(t);
      response.end();
    });

}
else
{

}

}
start.prototype.reqCookie = ['rbs_user','rbs_group'];
/*-------------------------------------
* Login Handler
*
-------------------------------------*/  
function login(response, postData, cookies){
  //Handle the login and check for postData
  //If no postData, show the login form
  //If there is, establish a redis connection and either redirect to home or login page
       
  //Load the queryobj
  //console.log(postData);

  //var postObj = querystring.parse(postData);
  //var ety = {};
  //console.log(postObj);
  //console.log('Len: ' + postObj_len);
  if ( postData == '' )
  {
    console.log('No post variables found...');
    //Empty post format
    //Show login form
    var file_content = fs.readFile(base_path + '/login/login-box.phtml','utf8', function(err, data){
      if(err){
        return console.log(err);
      }
      var t = Template.render(data);
      response.writeHead(200,{
        'Content-Type' : 'text/html'});
      response.write(t);
      response.end();
    });
  }
  else{
    var rb_auth = rbs_res.auth;
    var postObj = querystring.parse(postData);
    if( postObj.hasOwnProperty('user_name') && postObj.hasOwnProperty('user_pass') ){
    console.log(postObj.user_name);
    rb_auth(postObj.user_name, postObj.user_pass, response);
    }
  }  
 /*
  var file_contents = fs.readFile( base_path + 'login/login-box.phtml', 'utf8', function(err, data){
    if(err){
      return console.log(err);
    }
    var t = Template.render(data, response, postData, cookies);
  });
 */
}
login.prototype.reqCookie = [];
function upload(response,postData, cookies){ 
  this.reqCookie = ['rbs_user', 'rbs_group'];

  console.log('Request handler "upload" was called.');
  response.writeHead(200, {'Content-Type':'text/plain'});
  response.write('You have sent : '+querystring.parse(postData).text);
  response.end();
}

exports.start = start;
exports.upload = upload;
exports.login = login;
