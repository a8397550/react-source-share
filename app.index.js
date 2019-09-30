
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ThemeContext = React.createContext('light');

var App =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(App, _React$Component);

  function App() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "state", {
      name: 'dark'
    });

    return _this;
  }

  var _proto = App.prototype;

  _proto.render = function render() {
    var _this2 = this;

    // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
    // 无论多深，任何组件都能读取这个值。
    // 在这个例子中，我们将 “dark” 作为当前的值传递下去。
    return React.createElement(ThemeContext.Provider, {
      value: {
        value: this.state.name,
        rename: function rename(name) {
          _this2.setState({
            name: name
          });
        }
      }
    }, React.createElement(Toolbar, null));
  };

  return App;
}(React.Component); // 中间的组件再也不必指明往下传递 theme 了。


function Toolbar() {
  return React.createElement("div", null, React.createElement(ThemedButton, null));
}

var ThemedButton =
/*#__PURE__*/
function (_React$Component2) {
  _inheritsLoose(ThemedButton, _React$Component2);

  function ThemedButton(props, context) {
    var _this3;

    _this3 = _React$Component2.call(this, props) || this;
    console.log('props', props, context);
    return _this3;
  } // 指定 contextType 读取当前的 theme context。
  // React 会往上找到最近的 theme Provider，然后使用它的值。
  // 在这个例子中，当前的 theme 值为 “dark”。


  var _proto2 = ThemedButton.prototype;

  _proto2.render = function render() {
    var _this4 = this;

    console.log(this.context);
    return React.createElement("div", {
      onClick: function onClick() {
        _this4.context.rename('888');
      }
    }, this.context.value);
  };

  return ThemedButton;
}(React.Component);

_defineProperty(ThemedButton, "contextType", ThemeContext);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
