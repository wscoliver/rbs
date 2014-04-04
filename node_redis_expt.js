//Installation script for RBS Node Redis Server
//Developed by: Oliver Wee (c)2014
//

var redis = require("redis"),
    md5 = require("MD5");
    client = redis.createClient();

var rb_res = require("./rbs_resident.js");

    client.on("error", function (err) {
      console.log("Error " + err);
    });
//Verify if the hashes Block1,Block2,Block3,Block4,Block5,Block6,Party and Resident have beeen set
    var hash_list = ['rb2','rb3','rb4','rb5','rb6','rbroot','rbpt'];


function rbsRedis(hash_list){
  function chckHsh(element, index, array){
    console.log('Verifying...' + element);
    if( client.hlen(element) == 0 ){
      //The key for element does not exist, install our hash
      //console.log(this.hashList);
      //console.log(this.__proto__ === rbsRedis.prototype);
      setupHsh(element);    
        }
   
  } 
  function setupHsh(el){
    console.log('Installing...' + el);
     if( el == 'rbroot'){
     //Add Root User
     var rbs_root = new rb_res();
     rbs_root.user_matric = 'A0094622E';
     rbs_root.user_name = 'Oliver Wee';
     rbs_root.user_pass = '12345';
     rbs_root.user_gender = 'M';
     rbs_root.user_email = 'wscoliver@gmail.com';
     rbs_root.user_group = 'admin';
     rbs_root.user_points = 100;
     rbs_root.user_room = ' ';
     rbs_root.addUser();
    /* rbs_root.user_matric = 'A0094622E';
     rbs_root.delUser();*/
     client.hset('rbroot','active','1');
     }   
     if( el == 'rb2' || el == 'rb3' || el == 'rb4' || el == 'rb5' || el == 
'rb6'){
     //Add block hash
      }
   }

  hash_list.forEach(chckHsh);
}
//Try the auth module
/*  var rb = new rb_res();
  rb.user_matric = 'A0094622E';
  rb.field_chg = 'user_pass';
  rb.var_new = md5('12345raffleshallrox');
  rb.editUser();
  
  rb.user_pass = '12345';
  var resp =rb.auth();
  if( resp ){
    console.log('Password is correct');
  }
*/
    console.log('Verifying setup...');
    disCntrl = new rbsRedis(hash_list);
//    disCntrl = bind(disCntrl.setupHsh, disCntrl);
    //client.set("string key","string val", redis.print);
    //client.hset("hash key","hashtest 1","some value", redis.print);

    //client.hkeys("hash key", function(err, replies){
    //  console.log(replies.length+ 'replies:');
    // replies.forEach(function (reply, i){
    //    console.log(' '+ i +' :' + reply);
    //  });
    client.quit();
    //});
