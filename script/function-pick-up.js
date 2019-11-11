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

var fsRead = function (fd, buffer) {
  
  //每一个汉字utf8编码是3个字节，英文是1个字节
  fs.read(fd, buffer, 0, 255, null, function (err, bytesRead, buffer) {
    if(err) {
      throw err;
    } else {
      if (bytesRead === 255) {
        console.log(buffer.toString());
        fsRead(fd, buffer);
        return;
      }
      console.log(bytesRead);
      console.log(buffer.slice(0, bytesRead).toString());
    }
  });
}

fs.open(path.join(__dirname, loadPath), 'r', function (err, fd) {
  if(err) {
    console.error(err);
    return;
  } else {
    var buffer = Buffer.alloc(255);
    fsRead(fd, buffer);
  }
});

console.log('>>>>>>>>>>>>>>')

fs.readFile(path.join(__dirname, loadPath), (err, data) => {
  if (err) throw err;
  // console.log(data.toString());
  if (savePath) {
    fs.writeFile(path.join(__dirname, savePath), data, (err) => {
      if (err) throw err;
      console.log('文件已被保存');
    });
  }
});