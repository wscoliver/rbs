//Include the necessary files
var fs = require('fs');
var path = require('path');
var block_path = '/home/nodeuser/nodeProjects/block/';
function render(file){
  var arr=[],
  s = file,
  re=/%extends\s([\d\D]*?)\s\%end/gi,
  item;
  
  while( item = re.exec(s)){
  //Find the file extension in block
  var file_name=item[1];
  //Get the foldername
  var dir_name=file_name.split('.');
  
  var tgt_path = path.join(block_path,dir_name[0]);
  var file_content;
  if(fs.existsSync(tgt_path)){
    var file_output=fs.readFileSync(tgt_path+'/'+file_name,'utf8',function(err, data){
      if(err){
        return console.log(err);
       }
       return data;
      });
  }
  
  //Replace the file extension with the file content
  var str_rpl = item[0];
  file = file.replace(str_rpl, file_output);
  //arr.push(item[0]);
  arr.push(item[1]);
  }
  
  console.log(arr.join(' '));
  if ( arr.length != 0 ){
  file = render(file);
  }  
  return file;
}

exports.render = render;
