/*---------------------------------------------------------------
Script to Update the RBS Party Members
Copyright(2014) Raffles Hall Commotion - Oliver Wee
---------------------------------------------------------------*/

//Include Libraries
 redis = require('redis')
,async = require('async')
,csv   = require('csv')
,client = redis.createClient();

function party_create(p1,p2,n1,n2){
  //Setup the party
  client.hmset('rbs_party_list',p1,p2);
  //Put in the party points
  var plist = [p1,p2];
  var aFunc = function(umat, ret){
    client.hget(umat,'user_points', function(err, reply){
      //Reply with the user's points
	  ret(false, reply);
	});
  };
  async.map(plist, aFunc, function(err, res){
    //Add the two points together and put into party points
	//console.log(res);
	
    var ppoints = pmod(res[0])+pmod(res[1]);


	console.log('Create pt PL->'+p1+'->'+n1+'->'+res[0]+' PM->'+p2+'->'+n2+'->'+res[1]+' with PP: '+ppoints);
	client.hmset('rbs_party_points', plist[0], ppoints);
  });
}
function pmod(res){
  if(res){
    return parseInt(res);
  }
  else{
    return 1
  }
}
//update the party list
var loadRes = function(row, index){
  //console.log('Creating party with (PL : '+row[0]+','+row[1]+') (PM:'+row[2]+','+row[3]+')');

  var  p1 = row[1]
      ,p2 = row[3]
	  ,n1 = row[0]
	  ,n2 = row[2];
  party_create(p1,p2,n1,n2);
};
//Read the csv file
csv().from('/home/rhcommotion/rbs_node/rbs/rbspt2.csv').to(console.log).transform(loadRes);


