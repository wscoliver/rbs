//Convert the bidding result into a CSV file
var redis = require('redis'),
    csv   = require('csv'),
	async = require('async'),
	client = redis.createClient();
//Get all the user info
var res_cb = function(err, reply){
  //Do Async Check on Each of the Resident's Room
  var afunc = function(items, callback){
    client.hget(items,'user_room', function(err, reply){
      callback(false, reply);
	});
  };
  var acallback = function(err, results){
    //var reply_arr = [];
	var reply_str = '';
    for(i=0;i<reply.length;i++){
      //var row = {'id':i,'user_matric':reply[i],'user_room':results[i]}
	  //reply_arr.push(row);
	  var new_row = i+','+reply[i]+','+results[i]+'\n';
	  reply_str+= new_row;
	}
	console.log(reply_str);
	//Turn this into a CSV
	csv().from(reply_str).to('/home/rhcommotion/rbs_node/rbs/res1.csv');


  };
  async.map(reply,afunc,acallback);

}
//Get all the users
client.lrange('rbs_residents',0,-1,res_cb);




