//Upload the resident points from a csv file
var  redis = require('redis')
    ,csv   = require('csv')
	,async = require('async')
	,md5   = require('MD5')
	 client = redis.createClient();

//Read the csv file
var loadRes = function(row, index){
  var resObj = {
    'user_name' : row[1]
   ,'user_gender' : row[3]
   ,'user_nationality' : row[4]
   ,'user_email' : row[5]
   ,'user_points' : row[6]
   ,'user_pass' : md5(row[7] + 'raffleshallrox')
   ,'user_group' : 'user'
   ,'user_room' : 'None'
   ,'user_room_key' : 0
  };

  //console.log(resObj);
  client.hmset(row[2], resObj, redis.print);
  //Add new user
  client.lpush('rbs_residents', row[2], redis.print);
};

csv().from('/home/rhcommotion/rbs_node/rbs/rhrespoints.csv').to(console.log).transform(loadRes);
