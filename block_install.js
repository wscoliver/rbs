/*-------------------------------------
*
*Installation Script for RBS Blocks
-------------------------------------*/
var redis = require('redis'),
    md5 = require('MD5'),
	client = redis.createClient();

var block_arr = ['3A'];
//Create a Block Plots
function createBlock(num){
  for(var x=0;x<11;x++){
  createRow(num,x);
  }
}
function createRow(num,x){
  for(var y=0;y<11;y++){
  createPlot(num,x,y);
  }
}
function createPlot(num,x,y){
  //Create blockpts hash with value x,y,0 points
  var blockpts_key = 'blockpts'+num;
  var blockpts_field = 'x'+x+'_y'+y;
  client.hmset(blockpts_key,blockpts_field,0,redis.print);
  //Create plot hash
  var def = 'Not set';
  var args = {'room_num': def,
              'room_gender' : 'M',
              'room_points' : 0,
			  'room_status' : 'Available',
			  'room_type'   : 'Single',
			  'room_occupant' : def
			  };
  var plot_key = 'block'+num+'_x'+x+'_y'+y;
  client.hmset(plot_key, args, redis.print);

}
//Create the plots for each block
for(var i=0;i<block_arr.length;i++){
  createBlock(block_arr[i]);
}
console.log('Installation Completed...');

