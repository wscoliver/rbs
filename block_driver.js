    redis = require('redis'),
    md5 = require('MD5'),
    async = require('async'),
    client = redis.createClient();

    client.on('error', function(err){
      console.log('Redis error: ' + err);
    });

function exec(args, fn){
//Test for the object property cmd
  if(args.hasOwnProperty('cmd')){
     var cmd = args.cmd;
       switch(cmd){
         case 'getblockhashes':
           getblockhashes(args, fn);
         break;
		 case 'getplothash':
		   getplothash(args, fn);
		 break;
         case 'setmhash':
           setmhash(args, fn);
         break;
         case 'delhash':
           delhash(args, fn);
         break;
         case 'getlistlen':
           getlistlen(args, fn);
		 case 'bid':
		   bid(args,  fn);
		 break;
		 case 'leave':
		   leave(args, fn);
		 break;
		 //Party Commands
		 case 'party_create':
           party_create(args, fn);
		 break;
		 case 'party_status':
		   party_status(args, fn);
		 break;
		 case 'party_disband':
		   party_disband(args, fn);
		 break;
		 case 'party_leave':
		   party_leave(args, fn);
		 case 'party_list':
		   party_list(args, fn);
		 break;
		 case 'party_join':
		   party_join(args, fn);
		 break;
		 case 'party_points':
		   party_points(args, fn);
		 break;

       }
  } 
}
/*----------------------
*
*getblockhashes
*
*---------------------*/
function getblockhashes(args, fn){
var list_key = 'blockpts' + args.block;

  client.hgetall(list_key,function(err, reply){
    if(err){
    console.log('Redis Error' + err);
    }  
    //console.log('Reply: ' + reply);
    getblockhash(reply,args, fn);
  });

}

function getblockhash(reply,args, fn){
 
var items = [];
for ( k in reply ){
  var plot_hash = 'block'+args.block+'_'+k;
  //console.log(plot_hash);
  items.push(plot_hash);
}
  //use Async to get all the hash values
var mCallback = function(err, res){
  var res_json = {};
  for( var i=0;i<res.length;i++){
    //console.log('Matric: ' + matric_arr[i]);
    res_json[items[i]] = res[i];
  }
  //console.log(res_json);
  fn(res_json);
};

  async.map(items, function(key, callback){
    client.hgetall(key, function(err, res){
      //console.log('Res for: ' + key + ' | ' + res);
      callback(false, res);
      });
    }, mCallback);
}

/*----------------------
*
*getplothash
*
*---------------------*/
function getplothash(args, fn){
  var hkey = args.key;
  
  client.hgetall(hkey,function(err, reply){
    fn(reply);
  });

}
/*----------------------
*
*setmhash
*
*---------------------*/
function setmhash(args, fn){
  var hkey = args.key;
  var hargs = args.val;
  client.hmset(hkey, hargs, function(err, reply){
    fn(reply);
  });

}
/*----------------------
*
*delhash
*
*---------------------*/
function delhash(args, fn){
  var hkey = args.key;
  
  client.lrem('rbs_residents',0,hkey,function(err, reply){
    fn(reply);
  });

}

/*----------------------
*
*getlistlen
*
*---------------------*/
function getlistlen(args, fn){
  var hkey = args.set_key;
  
  client.llen(hkey,function(err, reply){
    fn(reply);
  });

}
/*----------------------
*
* Bid
-----------------------*/
function bid(args, fn){
  //Double check for the points again before we carry out the process,
  //If the user points is still higher, we will bid
  ///Check if user is in a party
  if ( args.pt_id == 0 ){

 client.hgetall(args.pkey, function(err,reply){
   var pp = reply['room_points'];
   var occp = reply['room_occupant'];
   if ( parseInt(args.upts) > parseInt(pp) ){
   //Carry On
   bid2(pp, args, fn, occp, reply['room_num']);
   }
 });
 }
 else{
    //User is in a party
	client.hgetall(args.pkey, function(err, reply){
    var pp = reply['room_points'];
	var occp = reply['room_occupant'];
	  if( parseInt(args.pt_points) > parseInt(pp) ){
      bid3(pp, args, fn, occp, reply['room_num']);

  	  }
	});

 }
}
function bid2(pp, args, fn, occp, rnum){
  //Get the previous occupant
  if( occp == 'Not set'){
    //Brand new room
	//Get the user's name
	client.hget(args.umat,'user_name', function(err, reply){
      var uname = reply;
      var val = {'room_points' : args.upts,
	           'room_occupant' : args.umat,
			   'room_occpname' : uname
  
	};
	client.hmset(args.pkey, val, redis.print);
  
	});

    //Remove the user's points
	var uval = {'user_points' : 0,
	            'user_room' : rnum,
				'user_room_key': args.pkey};
    client.hmset(args.umat, uval, redis.print);
	fn('Ok');
  }
  else{
   //Get other user matric and refund their points
   client.hmset(occp, 'user_points',pp,'user_room','None','user_room_key',0,redis.print);
    //Move into new room
	client.hget(args.umat, 'user_name', function(err, reply){
	var val = {'room_points' : args.upts,
	           'room_occupant' : args.umat,
			   'room_occpname' : reply
  
	};
	client.hmset(args.pkey, val, redis.print);
	});
    //Remove the user's points
	var uval = {'user_points' : 0,
	            'user_room' : rnum,
				'user_room_key': args.pkey};
    client.hmset(args.umat, uval, redis.print);
    fn('Ok');
  }
}
function bid3(pp, args, fn, occp, rnum){
  //Get the previous occupant
  if( occp == 'Not set'){
    //Brand new room
    //Remove the party's points
    client.hmset('rbs_party_points',args.pt_id, 0 , redis.print);
	
	//Add room allocation to both members
	//Add room to party leader
	client.hmset(args.pt_id,'user_room', rnum,'user_room_key', args.pkey);
	//Add room to party member
	client.hget('rbs_party_list', args.pt_id, function(err, reply){
      client.hmset(reply, 'user_room', rnum,'user_room_key', args.pkey);
	  //Get both names and add to room
	  var items = [args.pt_id,reply];
	  function afunc ( mats, cb){
	  console.log('Querying item: '+mats);
        client.hget(mats, 'user_name', function(err, reply){
		//console.log('Found items...');
	    // console.log('got: '+reply);
        return cb(false, reply);
		});
	  }
	  async.map(items, afunc, function(err, res){
	  console.log('Res is ...')
	 
	  console.log(res);
        var occp_names = res[0]+','+res[1];
      	var val = {'room_points' : args.pt_points,
	           'room_occupant' : args.pt_id,
			   'room_occpname' : occp_names
  
	    };
	    client.hmset(args.pkey, val, redis.print);
		fn('Ok');

	  });



	});
  }
  else{
   //Get other user party and refund their party points
   client.hmset('rbs_party_points',occp,pp,redis.print);
       //Remove the new party's points
    client.hmset('rbs_party_points',args.pt_id ,0 , redis.print);
	//Remove room from old party leader
    client.hmset(occp, 'user_room', 'None','user_room_key',0, redis.print);
	//Remove room from old party member
	client.hget('rbs_party_list', occp, function(err, reply){
      client.hmset(reply, 'user_room', 'None','user_room_key',0);
	});
  	//Add room to new party leader
	client.hmset(args.pt_id,'user_room', rnum,'user_room_key', args.pkey);
	//Add room to new party member
	client.hget('rbs_party_list', args.pt_id, function(err, reply){
      client.hmset(reply, 'user_room', rnum,'user_room_key',args.pkey);
   
	  //Get both names and add to room
	  var items = [args.pt_id,reply];
	  function afunc ( mats, cb){
	  console.log('Querying item: '+mats);
        client.hget(mats, 'user_name', function(err, reply){
		//console.log('Found items...');
	    // console.log('got: '+reply);
        return cb(false, reply);
		});
	  }
	  async.map(items, afunc, function(err, res){
	  console.log('Res is ...')
	 
	  console.log(res);
        var occp_names = res[0]+','+res[1];
      	var val = {'room_points' : args.pt_points,
	           'room_occupant' : args.pt_id,
			   'room_occpname' : occp_names
  
	    };
	    client.hmset(args.pkey, val, redis.print);
		fn('Ok');

	  });

	});

  }
}
function leave(args, fn){
//Check if the user is in a party
  if(args.pt_id == 0){
  //User does not belong to a party
  client.hget(args.umat, 'user_room_key', function(err, reply){
    //Get the room points and refund it
	client.hget(reply, 'room_points', function(err, reply2){
      //Refund the points to the party user
	  client.hmset(args.umat, 'user_points', reply2,'user_room','None','user_room_key',0, redis.print);
	  //Vacate the room
	  client.hmset(reply, 'room_points',0,'room_occupant','Not set','room_occpname','None', redis.print);
	});
  });
  fn('Ok');
  }
  else{
  //User is in a party
  //Get the user room key, and refund points to the party list
  client.hget(args.umat, 'user_room_key', function(err, reply){
    //Get the room points and refund it
	client.hget(reply, 'room_points', function(err, reply2){
      //Refund the points to the party list
	  client.hset('rbs_party_points', args.umat, reply2, redis.print);
	  //Vacate the room
	  client.hmset(reply, 'room_points',0,'room_occupant','Not set','room_occpname','None', redis.print);
	});
  });
  //Remove room from party leader
  client.hmset(args.umat, 'user_room','None','user_room_key',0);
  //Remove room from party member
  client.hget('rbs_party_list', args.umat, function(err, reply){
    client.hmset(reply, 'user_room','None','user_room_key',0);
  });

  fn('Ok');
  }
}
/*------------------------------
Party Functions
------------------------------*/
//Check if user has a room, if yes, do not allow create , leave or disband
function user_room(umat,args,fn, cb){
//Get the user_room_key for the user
client.hget(umat ,'user_room_key', function(err, reply){
  if(reply == 0){
    //Carry out the function
	cb(args,fn);
  }else{
   console.log('Error: User already has a room');
    return;
  }

  });

}
function party_create(args, fn){
  //Create the party hash
  var pt_create = function(args, fn){

  client.hmset('rbs_party_list',args.player1,'Vacant', redis.print);
  //Subtract points from player and add to party points
  client.hgetall(args.player1, function(err, reply){
    //Get the users points
	var pts = reply['user_points'];
	//Set the party points
	client.hmset('rbs_party_points',args.player1,pts,redis.print);
	//client.hmset(args.player1,'user_points',0,redis.print);
    fn(1);
  });

  };

  user_room(args.player1,args, fn,pt_create);
}
function party_status(args, fn){
  //Get all the matric from rbs_party_list
  client.hgetall('rbs_party_list', function(err,reply){
    for ( k in reply ){
      if( k == args.p_key ){
	  var str = k+','+reply[k];
        fn(str);
		return;
	  }else{
        if( reply[k] == args.p_key){
	      var str = k+','+reply[k];
          fn(str);
		  return;
		}

	  }

	}
  fn(0);
  return;
  });
  
  
}
function party_points(args, fn){
  client.hget('rbs_party_points', args.player1, function(err, reply){
    fn(reply);
  });

}
function party_join(args, fn){

var pt_join = function(args, fn){
  //Set the new guy as player 2 in the party
  client.hmset('rbs_party_list', args.pid, args.p2, redis.print);
  //Add the new guys points
  client.hget(args.p2, 'user_points', function(err, reply){
    client.hincrby('rbs_party_points', args.pid, reply, redis.print);
    fn(1);
  });
  };
user_room(args.p2, args, fn, pt_join);
}
function party_disband(args, fn){
var pt_disband = function(args, fn){
  //Remove the field from party points and party list
  client.hdel('rbs_party_points',args.player1, redis.print);
  client.hdel('rbs_party_list',args.player1, redis.print);
  fn(1);
  };
user_room(args.player1, args, fn, pt_disband);
}
function party_leave(args, fn){
var pt_leave = function(arg, fn){
  client.hmset('rbs_party_list', args.player1, 'Vacant', redis.print);
  //Get the user2 points and subtract his points from the party
  client.hgetall(args.player2, function(err, reply){
  var u_pt = reply['user_points'];
  console.log('Minus off '+u_pt);
  var dep = 0 - u_pt;
  client.hincrby('rbs_party_points', args.player1,dep, redis.print);
  fn(1);

  });
};

user_room(args.player1, args, fn, pt_leave);
}
function party_list(args, fn){
 var loopParty = function(err, reply){
 console.log('Looping the party');
 var return_arr = [];
 var res_arr = [];
 //Loop through
    for ( k in reply){
    //Get player2
	var p2 = reply[k];
	  if (p2 == 'Vacant'){
	  return_arr.push(k);
	  console.log('return_arr...');
	  console.log(return_arr);
	  }
	}
	var mCallback = function(item, callbacks){
      client.hget(item,'user_name', function(err, reply){
	  console.log('Got username: '+reply);
        return callbacks(false, reply);
	  });
	}
	async.map(return_arr,mCallback, function(err, res){
      for(i = 0; i<return_arr.length; i++){
      var user_id = return_arr[i];
	  var user_name = res[i];
	  var user_obj = {
        'id':user_id
	   ,'name':user_name
	  };
	  console.log(user_obj);
      res_arr.push(user_obj);

	  }
	  console.log(res_arr);
	  fn(res_arr);
	});
}; 
  //Get all the field values from party_list
  client.hgetall('rbs_party_list', loopParty);

}
exports.exec = exec;
