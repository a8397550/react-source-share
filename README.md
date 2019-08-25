## 这是一个用来react源码阅读的项目，分析react的源码的构成
<br>
这里配置了babel以用来转换es6代码为es5代码，这很重要，因为阅读时要以ES5的方式进行react源码的阅读

###下载此代码后，安装依赖
npm install 
### 可以通过这种方式编译js文件,您可以使用--out-file或-o
./node_modules/.bin/babel index.js -o app.index.js
### 可以通过这种方式，编译整个src文件夹，输出到lib文件夹中
./node_modules/.bin/babel src --out-dir lib
###如果要利用某个插件的话，要这样使用哦
./node_modules/.bin/babel src --out-dir lib --plugins=@babel/plugin-transform-arrow-functions
###还可以设置presets预设设置，可以去参考babel官网
./node_modules/.bin/babel src --out-dir lib --presets=@babel/env

