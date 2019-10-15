import _regeneratorRuntime from "@babel/runtime/regenerator";
import "regenerator-runtime/runtime";
import dva, { connect } from 'dva';
import createLoading from 'dva-loading'; // dva自动处理loading的插件

import { Router, Route, Switch } from 'dva/router'; // dva里嵌套的react-router

var app = dva();
console.log(app._store); // 顶部的 state 数据

app.use(createLoading()); // 注册 Model

app.model({
  namespace: 'count',
  // 当前model的名称
  state: {
    count: 0
  },
  // 当前model的状态
  reducers: {
    // 处理同步active
    add: function add(state) {
      return state.count + 1;
    },
    minus: function minus(state) {
      return state.count - 1;
    }
  },
  effects: {
    // 处理异步active
    addAfter1Second: function addAfter1Second(action, _ref) {
      var call = _ref.call,
          put = _ref.put;
      return (
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee() {
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return call(delay, 1000);

                case 2:
                  _context.next = 4;
                  return put({
                    type: 'add'
                  });

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        })()
      );
    }
  }
});

function Home(props) {
  return React.createElement("div", null, React.createElement("div", null, "hello world"), React.createElement("h2", null, props.count), React.createElement("button", {
    key: "add",
    onClick: function onClick() {
      props.dispatch({
        type: 'count/add'
      });
    }
  }, "+"), React.createElement("button", {
    key: "minus",
    onClick: function onClick() {
      props.dispatch({
        type: 'count/minus'
      });
    }
  }, "-"));
}

connect(function (count) {
  return {
    count: count
  };
})(Home);
var router = React.createElement(Router, null, React.createElement(Switch, null, React.createElement(Route, {
  path: "/",
  exact: true,
  component: Home
})));
app.router(router);
app.start('#root');
