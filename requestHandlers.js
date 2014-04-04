//Include the nonblocking functionality
var exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path'),
    Template = require('./Template.js'),
    rbs_res = require('./rbs_resident.js');

//Specify BASE PATH
var base_path = '/home/rhcommotion/rbs_node/rbs/block/';

//Include the processing of text variable in postData
var querystring =  require('querystring');
/*-------------------------------------
* Index Handler
*
-------------------------------------*/  

function start(response, postData, cookies, query){
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
      block = 'admin';
      var t = Template.render(data, response, block);
    });

}
else
{
  //Use User View, Bidding System and Party System
   var file_content = fs.readFile(base_path + '/base/index.phtml','utf8', function(err, data){
      if(err){
        return console.log(err);
      }
      block = 'rblock_user';
      var t = Template.render(data, response, block);
        
    });

}
}
start.prototype.reqCookie = ['rbs_user','rbs_group'];
/*-------------------------------------
* Login Handler
*
-------------------------------------*/  
function login(response, postData, cookies, query){
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
    //console.log('No post variables found...');
    //Empty post format
    //Show login form
    var file_content = fs.readFile(base_path + '/login/login-box.phtml','utf8', function(err, data){
      if(err){
        return console.log(err);
      }
      var block = '';
      var t = Template.render(data, response, block);
      /*response.writeHead(200,{
        'Content-Type' : 'text/html'});
      response.write(t);
      response.end();*/
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
/*-------------------------------------
* Logout Handler
*
-------------------------------------*/  
function logout(response, postData, cookies, query){
  //Logout the user
  var exdate = new Date();
  exdate.setDate(exdate.getDate() - 1);
  response.writeHead(302, [
    ['Set-Cookie','rbs_group='+cookies['rbs_group']+';expires=' + exdate.toUTCString],
	['Set-Cookie','rbs_user='+cookies['rbs_user']+';expires=' + exdate.toUTCString],
	['Location','./login'],
  ]);
    response.write('You are logged out!');
	response.end();
}
logout.prototype.reqCookie = ['rbs_user','rbs_group'];

/*-------------------------------------
* Add Resident Handler
*
-------------------------------------*/  
function add_resident(response, postData, cookies, query){
  if( cookies['rbs_group'] != 'admin' )
  {
     response.writeHead('404',{'Content-Type':'text/plain'});
     response.write('You do not have permission to enter');
     response.end();
 }


  if ( postData == '' )
  {
      var file_content = fs.readFile(base_path + '/base/base.phtml','utf8', function(err, data){
      if(err){
        return console.log(err);
      }
      block = 'resident_add';
      var t = Template.render(data, response, block);
    });

  }
  else{
    var postObj = querystring.parse(postData);
    if( postObj.hasOwnProperty('res_matric') && postObj.hasOwnProperty('res_name')  && postObj.hasOwnProperty('res_gender')  && postObj.hasOwnProperty('res_point') 
 && postObj.hasOwnProperty('res_email') && postObj.hasOwnProperty('res_pass') ){
      
     rbs_res.addUser(postObj.res_matric, postObj.res_pass, postObj.res_gender, postObj.res_email, postObj.res_name, postObj.res_group, postObj.res_point, 'None');
     var file_content = fs.readFile(base_path + '/base/base.phtml','utf8', function(err, data){
      if(err){
        return console.log(err);
      }
      block = 'resident_adddone';
      var t = Template.render(data, response, block);
    });

 
    
    }
  }  
 }
add_resident.prototype.reqCookie = ['rbs_user','rbs_group'];
/*-------------------------------------
* View All Resident Handler
*
-------------------------------------*/  
function all_resident(response, postData, cookies, query){
  if( cookies['rbs_group'] != 'admin' )
  {
     response.writeHead('404',{'Content-Type':'text/plain'});
     response.write('You do not have permission to enter');
     response.end();
 }

  var get_var_len = query.len;
  if ( postData == ''){
      var file_content = fs.readFile(base_path + '/base/base.phtml','utf8', function(err, data){
      if(err){
        return console.log(err);
      }
      block = 'resident_all';
      var t = Template.render(data, response, block);
    });

  }
  else{
  }  
 }
all_resident.prototype.reqCookie = ['rbs_user','rbs_group'];
function upload(response,postData, cookies){ 
  this.reqCookie = ['rbs_user', 'rbs_group'];

  console.log('Request handler "upload" was called.');
  response.writeHead(200, {'Content-Type':'text/plain'});
  response.write('You have sent : '+querystring.parse(postData).text);
  response.end();
}
/*-------------------------------------
* Blockadmin Handler
*
-------------------------------------*/  
function blockadmin(response, postData, cookies, query){
  if( cookies['rbs_group'] != 'admin' )
  {
     response.writeHead('404',{'Content-Type':'text/plain'});
     response.write('You do not have permission to enter');
     response.end();
 }


     var file_content = fs.readFile(base_path + '/base/base.phtml','utf8', function(err, data){
      if(err){
        return console.log(err);
      }
      block = 'rblock_admin';
      var t = Template.render(data, response, block);
    });

}
blockadmin.prototype.reqCookie = ['rbs_user','rbs_group'];
/*---------------------------
Party Handler
---------------------------*/
function party(response, postData, cookies, query){
  if( cookies['rbs_group'] != 'user' )
  {
     response.writeHead('404',{'Content-Type':'text/plain'});
     response.write('You do not have permission to enter');
     response.end();
 }


     var file_content = fs.readFile(base_path + '/base/index.phtml','utf8', function(err, data){
      if(err){
        return console.log(err);
      }
      block = 'party_index';
      var t = Template.render(data, response, block);
    });

}
party.prototype.reqCookie = ['rbs_user','rbs_group'];


exports.start = start;
exports.upload = upload;
exports.login = login;
exports.add_resident = add_resident;
exports.all_resident = all_resident;
exports.logout = logout;
exports.blockadmin = blockadmin;
exports.party = party;
