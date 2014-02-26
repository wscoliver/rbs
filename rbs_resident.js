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
method.auth = function(){
  //Get the password field of the user
  //
  //console.log('User pass provided...' + this.user_pass);
  //console.log(this.user_matric);
  var q_pass = md5(this.user_pass + 'raffleshallrox');
  var auth_pass = client.hget(this.user_matric, "user_pass", function(err, reply){
    //console.log(reply.toString());
    if( q_pass == reply.toString()){

      return 1;
    }
    return 0;
});
  console.log('Auth_pass: ' + auth_pass);
  return auth_pass;
}
method.editUser = function(){
  //Change the field of a hash
  client.HSET(this.user_matric, this.field_chg, this.var_new, redis.print);
}
method.delUser = function(){
  //Delete a user hash
  client.del(this.user_matric, redis.print);
}
module.exports = rbs_resident;
