//Include the necessary files
var fs = require('fs');
var path = require('path');
var async = require('async');
//Variables for Async regexp for extend
 var block_path = '/home/rhcommotion/rbs_node/rbs/block/';
 var arr=[],
  s ,
  re=/%extends\s([\d\D]*?)\s\%end/gi,
  item;
//Variables for Async regexp for block
 var arr2=[],
  s2 ,
  re2=/%block\s([\d\D]*?)\s\%block/gi,
  item2;
var f_response;

function render(file, response, block){
 
   /*Async file exist and read*/
  s = file;
  f_response = response;
  var arr_items = [];
  var file_names = [];
  var f_file = file;
  //Search for block
  console.log('<-------------- Template building --------------->');
  while( item2 = re2.exec(f_file)){
  f_file = f_file.replace(item2[0] , '%extends ' + block + '.phtml %end');
  //console.log('Item 2 : ' + item2[0]);
  }
  //Search for extends
  while( item = re.exec(f_file)){
  //Find the file extension in block
  var file_name=item[1];
  //Get the foldername
  //Check if there is an underscore
  var dir_name = '';
  var t_file_name = '';
  if( file_name.indexOf('_') != -1 ){
    dir_arr = file_name.split('_');
    dir_name = dir_arr[0];
    t_file_name = dir_arr[1];
  }
  else{
    dir_arr = file_name.split('.');
    dir_name = dir_arr[0];
    t_file_name = file_name;
  }
  
  var tgt_path = path.join(block_path,dir_name);
  var file_content;
  var fse = fs.existsSync(tgt_path);
  if(fse){
    var full_path = tgt_path+'/'+t_file_name;
    arr_items.push(full_path);
    file_names.push(item[0]);
    //Use Async
    /*
    var fsr=fs.readFile(tgt_path+'/'+file_name,'utf8',function(err, data){
      if(err){
        return console.log(err);
       }
       //Replace the file extension with the file content
       //console.log('Item 0 : ' + item_0 );
       var str_rpl = item_0;
       f_file = f_file.replace(str_rpl, data);
       console.log('Data: ' + data);
       console.log('New File Contents: '+f_file); 
       //arr.push(item[0]);
       arr.push(item_1);

      });
     */
  }
      
  
   }
  //use Async to read the files in parrallel
  async.map(arr_items,fs.readFile, function(err, results){
    console.log(file_names);
    for(i=0;i< file_names.length;i++){
         
    f_file = f_file.replace(file_names[i], results[i]);
    }
  //console.log('f_file: ' + f_file);
    f_response.writeHead('200', {'Content-Type' : 'text/html'});
    f_response.write(f_file);
    f_response.end();
  });
  /*
  console.log(arr.join(' '));
  if ( arr.length != 0 ){
  f_file = render(f_file, response, block);
  }  
  else{
  response.writeHead('200',{'Content-Type':'text/html'});
  response.write(f_file);
  response.end();

  }
  */
}
exports.render = render;
