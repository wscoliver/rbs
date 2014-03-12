var redis = require('redis'),
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
         case 'getrangehash':
           getrangehash(args, fn);
         break;
         case 'setmhash':
           setmhash(args, fn);
         break;
         case 'delhash':
           delhash(args, fn);
         break;
         case 'getlistlen':
           getlistlen(args, fn);
       }
  } 
}
/*----------------------
*
*getrangehash
*
*---------------------*/
function getrangehash(args, fn){
  client.lrange(args.set_key, args.range_start, args.range_end, function(err, reply){
    if(err){
    console.log('Redis Error' + err);
    }  
    //console.log('Reply: ' + reply);
    getindexhash(reply, fn);
  });

}

function getindexhash(reply, fn){
  //Put String into List
  //console.log(typeof(reply));
  var matric_arr = [];
  //var set_arr = reply.split(',');
  for(var i=0; i<reply.length; i++){
    
    
    var i_matric = reply[i];
    matric_arr.push(i_matric);
  }
  //console.log(matric_arr[0] + 'First elem');
 
  //use Async to get all the hash values
var mCallback = function(err, res){
  var res_json = {};
  for( var i=0;i<res.length;i++){
    //console.log('Matric: ' + matric_arr[i]);
    res_json[matric_arr[i]] = res[i];
  }
  //console.log(res_json);
  fn(res_json);
};

  async.map(matric_arr, function(key, callback){
    client.hgetall(key, function(err, res){
      //console.log('Res for: ' + key + ' | ' + res);
      callback(false, res);
      });
    }, mCallback);
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
exports.exec = exec;
