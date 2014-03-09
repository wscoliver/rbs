//Module for RBS Resident
//Developed by: Oliver Wee(c) 2014
var redis = require("redis"),
    md5 = require("MD5");
    client = redis.createClient();

    client.on("error", function(err){
      console.log("Error " + err);
    });

function rbs_resident(){
  //Host function
  this.user_matric = '';
  this.user_pass = '';
  this.user_gender = '';
  this.user_email = '';
  this.user_name = '';
  this.user_group = '';
  this.user_points = '';
  this.user_room = '';
  //Editing variables
  this.field_chg = '';
  this.var_new = '';
  this.resp = ''; 
}
var method = rbs_resident.prototype;
method.addUser = function(){
  //Add a new hash
  client.HMSET(this.user_matric, {
    "user_pass" : md5(this.user_pass+'raffleshallrox'),
    "user_gender" : this.user_gender,
    "user_email" : this.user_email,
    "user_name" : this.user_name,
    "user_group" : this.user_group,
    "user_points" : this.user_points,
    "user_room" : this.user_room}, redis.print);
    
i};
function rbs_authfail(response){
  response.writeHead(302, {
         'Content-Type': 'text/plain',
         'Location' : '/login'});
  response.write('Login failed');
  response.end();

}
function rbs_verify(user_matric, user_pass, response){
console.log('Verifying...');
var q_pass = md5(user_pass + 'raffleshallrox');
var auth_pass = client.hgetall(user_matric, function(err, reply){
    //console.log(reply);
    if(err){
      console.log(err);
      rbs_authfail(response);
    }
    var h_pass = reply['user_pass'];
    var h_group = reply['user_group'];
      if( q_pass == h_pass){
    //  console.log('Auth success');
      //Set Cookies
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + 1);
        response.writeHead(302, [
          ['Content-Type' , 'text/html'],
          ['Set-Cookie','rbs_group='+h_group+';expires=' + exdate.toUTCString],
          ['Set-Cookie','rbs_user='+user_matric+';expires=' + exdate.toUTCString()+';'],
          ['Location','/'],
]);
        response.write('You are logged in');
        response.end();
     }
     else{
       rbs_authfail(response);
      }
});

}
function rbs_auth(user_matric, user_pass, response){
  //Get the password field of the user
  //
  //console.log('User pass provided...' + this.user_pass);
  //  console.log(user_matric);
  
  //console.log('Qpass: ' + q_pass);
  //Check if the user_matric exists, if not return to login page, if yes verify
  var hash_exists = client.hexists(user_matric, "user_pass", function(err, reply){
    //console.log(reply.toString());
    //hexist = reply.toString();
    //console.log(typeof(hexist));
    if(reply){
      rbs_verify(user_matric, user_pass, response);
    }else{
      rbs_authfail(response);
    }

  });
}
method.editUser = function(){
  //Change the field of a hash
  client.HSET(this.user_matric, this.field_chg, this.var_new, redis.print);
}
method.delUser = function(){
  //Delete a user hash
  client.del(this.user_matric, redis.print);
}
exports.resident = rbs_resident;
exports.auth = rbs_auth;
