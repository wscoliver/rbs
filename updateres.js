//Upload the resident points from a csv file
var  redis = require('redis')
    ,csv   = require('csv')
	,async = require('async')
	,md5   = require('MD5')
	 client = redis.createClient();

//Read the csv file
var loadRes = function(row, index){
//console.log('Row..'+index);
//console.log(row);
  var resObj = {

   'user_points' : row[1]
    };
  
//  console.log('Matric: '+row[0]+','+row[1]);
  var new_user_pass = md5(row[1]+'raffleshallrox');

  client.hmset(row[0],'user_pass',new_user_pass,'user_points',row[2], redis.print);
  //check if Resident Exist in the List

  //Add new user
  //client.lpush('rbs_residents', row[2], redis.print);
};

csv().from('/home/rhcommotion/rbs_node/rbs/rbsupdate2.csv').to(console.log).transform(loadRes);
