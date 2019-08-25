## 这是一个用来react源码阅读的项目，分析react的源码的构成
<br>
这里配置了babel以用来转换es6代码为es5代码，这很重要，因为阅读时要以ES5的方式进行react源码的阅读<br>
还可以在这里使用typescript的语法，通过预设配置也可以进行转义哦
注意：配置了babel.config.js，这个是babel的默认配置文件，会在你执行babel命令时自动被加载

### 下载此代码后，安装依赖
npm install 

## 可以通过这种方式编译js文件,您可以使用--out-file或-o
./node_modules/.bin/babel index.js -o app.index.js
<br>
<br>

### 可以通过这种方式，编译整个src文件夹，输出到lib文件夹中
./node_modules/.bin/babel src --out-dir lib

### 编译整个src目录并将其作为单个连接文件输出。
./node_modules/.bin/babel src --out-file script-compiled.js

### 如果要利用某个插件的话，要这样使用哦
./node_modules/.bin/babel src --out-dir lib --plugins=@babel/proposal-class-properties,@babel/transform-modules-amd

### 还可以设置presets预设设置，可以去参考babel官网
./node_modules/.bin/babel src --out-dir lib --presets=@babel/env,@babel/flow

### 监听变更的方式,要在每次更改文件时编译文件，请使用--watch或-w选项：
./node_modules/.bin/babel script.js --watch --out-file script-compiled.js

### 如果您更喜欢内联源地图，请--source-maps inline改用。
./node_modules/.bin/babel script.js --out-file script-compiled.js --source-maps inline

### 忽略规范和测试文件
./node_modules/.bin/ babel src --out-dir lib --ignore "src/**/*.spec.js","src/**/*.test.js"