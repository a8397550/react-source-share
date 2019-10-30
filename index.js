var Son = React.createElement('div', {
  children: '888',
  componentDidMount: function() {
    // 这玩意不会被执行，不是生命周期，会提示Warning, 
    // 只有React.createElement(fn:function, {});的React元素才有生命周期
  }
})

var Parent = (function (Component) {
  Mod.prototype = Object.create(Component.prototype);
  Mod.prototype.constructor = Mod;
  Mod.__proto__ = Component;
  function Mod(props) {
    var _this;
    _this = Component.call(this, props) || this;
    _this.state = { name: 'TestMod' };
    this.componentDidMount = function () {
      console.log('componentDidMount')
    }
    return _this; 
  }
  Mod.getDerivedStateFromProps = function () {
    console.log('888')
    return null;
  }
  Mod.prototype.render = function () {
    const self = this;
    console.log(self.state.name);
    return React.createElement(
      'div',
      {
        children: self.state.name,
        key: 'Parent',
        id: 'Parent',
        onClick: () => {
          self.setState({
            name: 'Parent',
          })
        }
      }
    );
  }
  return Mod;
}(React.Component))
ReactDOM.render(React.createElement(Parent, null), document.getElementById('root'))
