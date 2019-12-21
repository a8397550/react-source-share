var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname)); // 设置静态文件目录，外网可直接访问。

app.listen(app.get('port'), function () {
  console.log(`Express started on http://localhost:${app.get('port')}; press Ctrl + c to terminate.`);
});