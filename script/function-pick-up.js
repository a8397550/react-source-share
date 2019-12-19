var fs = require('fs');
var path = require('path');
var loadPath;
var savePath;

process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
  if (index === 2) {
    loadPath = val;
  }
  if (index === 3) {
    savePath = val;
  }
});

if (!loadPath) {
  console.log('请输入要打开的文件地址');
  return;
}

console.log('>>>>>>>>>>>>>>')

fs.readFile(path.join(__dirname, loadPath), (err, data) => {
  if (err) throw err;
  // console.log(data.toString());
  debugger;
  var text = data.toString();
  text = text.split('\n');
  for (var i = 0; i < text.length; i += 1) {
    text[i] = text[i].replace(/(:)?\/\/(.)*/, function() {
      if (arguments[0][0].indexOf(":") !== -1) {
        return arguments[0];
      }
      return '';
    });
  }

  text = text.join("\n");
  
  var dataBf = Buffer.from(text);
  if (savePath) {
    fs.writeFile(path.join(__dirname, savePath), dataBf, (err) => {
      if (err) throw err;
      console.log('文件已被保存');
    });
  }
});