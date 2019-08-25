import "core-js/modules/es6.object.create";

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

import React from 'react';

var Mod =
/*#__PURE__*/
function (_React$component) {
  _inheritsLoose(Mod, _React$component);

  function Mod(props) {
    var _this;

    _this = _React$component.call(this, props) || this;
    _this.state = {};
    return _this;
  }

  var _proto = Mod.prototype;

  _proto.render = function render() {
    var _this2 = this;

    return React.createElement("div", null, React.createElement("div", {
      onClick: function onClick() {
        console.log(_this2);
      }
    }, "11"), React.createElement("div", null, "22"));
  };

  return Mod;
}(React.component);
