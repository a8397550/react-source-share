/** @license React v16.9.0
*/

'use strict';

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.React = factory());
}(this, (function () {
  'use strict';
  /**
   * @description React的版本号
   */
  var ReactVersion = '16.9.0';
  /**
   * @description 检测是否支持Symbol用的
   */
  var hasSymbol = typeof Symbol === 'function' && Symbol.for;
  /**
   * @description Symbol.for('react.element')
   */
  var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
  /**
   * @description Symbol.for('react.portal')
   */
  var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
  /**
   * @description Symbol.for('react.fragment') 分组用的标识，React.Fragment允许将子列表分组，而无需向 DOM 添加额外节点
   */
  var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
  /**
   * @description 不知道这个是干什么的
   */
  var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
  /**
   * @description 不知道这个是干什么的
   */
  var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
  /**
   * @description  Symbol.for('react.provider') React.context.provider组件标识
   */
  var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
  /**
   * @description  Symbol.for('react.context') React.context组件标识
   */
  var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;


  var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
  var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
  var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
  var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
  var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
  var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
  var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
  var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;

  /**
   * @description 返回一个对象的Iterator方法，一般形参是一个array
   * @description 如果Symbol函数存在，就将如参的maybeIterable[Symbol.iterator]方法返回
   * @param {*} maybeIterable 
   */
  function getIteratorFn (maybeIterable) {
    if (maybeIterable === null || typeof maybeIterable !== 'object') {
      return null;
    }
    var maybeIterator = typeof Symbol === 'function' && maybeIterable[Symbol.iterator] || maybeIterable['@@iterator'];

    if (typeof maybeIterator === 'function') {
      return maybeIterator;
    }
    return null;
  }

  var a = [1, 2, 3, 4];
  var iterFn = getIteratorFn(a);
  var b = iterFn.apply(a);
  console.log(b.next());

  /**
   * @description 此方法可以验证一个key是否是一个对象的属性或方法
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  /**
   * @description 检测一个属性是否是可枚举属性
   */
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  /**
   * @description 结合源码上下文，它的作用时检测环境是否可用，如果可以用就可以使用Object.assign的方法了，如果不可用就用Polyfill
   * @description 此方法主要是用来做环境检测的，看Object.assign是否可以用，如果通过环境检测返回true
   * @description 首先判断有没有Object.assing方法如果没有return false
   * @description 检测旧V8版本中的错误属性枚举顺序。
   */
  function shouldUseNative () {
    try {
      if (!Object.assign) { // 首先判断有没有此方法，如果没有直接return false
        return false;
      }

      // 检测旧V8版本中的错误属性枚举顺序。

      // https://bugs.chromium.org/p/v8/issues/detail?id=4118
      var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
      test1[5] = 'de';
      if (Object.getOwnPropertyNames(test1)[0] === '5') {
        return false;
      }

      // https://bugs.chromium.org/p/v8/issues/detail?id=3056
      var test2 = {};
      for (var i = 0; i < 10; i++) {
        test2['_' + String.fromCharCode(i)] = i;
      }
      var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
        return test2[n];
      });
      if (order2.join('') !== '0123456789') {
        return false;
      }

      // https://bugs.chromium.org/p/v8/issues/detail?id=3056
      var test3 = {};
      'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
        test3[letter] = letter;
      });
      if (Object.keys(Object.assign({}, test3)).join('') !==
        'abcdefghijklmnopqrst') {
        return false;
      }

      return true;
    } catch (err) {
      // We don't expect any of the above to throw, but better to be safe.
      return false;
    }
  }

  /**
   * @description 一个一定可以用的Object.assing方法，做了环境的处理，给了Polyfill的处理，Polyfill是旧版本没有支持，在旧版本实现功能的方法
   */
  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
    var from;
    var toObject = function (val) {
      if (val === null || val === undefined) {
        throw new TypeError('Object.assign cannot be called with null or undefined');
      }

      return Object(val);
    }
    var to = toObject(target); // 有意思的点，这里将值转换为对象进行处理了
    var symbols;

    for (var s = 1; s < arguments.length; s++) {
      from = Object(arguments[s]);

      for (var key in from) {
        if (Object.prototype.hasOwnProperty.call(from, key)) {
          to[key] = from[key];
        }
      }

      if (Object.getOwnPropertySymbols) {
        symbols = Object.getOwnPropertySymbols(from);
        for (var i = 0; i < symbols.length; i++) {
          if (propIsEnumerable.call(from, symbols[i])) {
            to[symbols[i]] = from[symbols[i]];
          }
        }
      }
    }

    return to;
  };


  /**
   * @description 接收一个Error对象并给此对象的name赋值, error.name = 'Invariant Violation';在返回这个Error对象
   * @param {*} error 
   */
  function ReactError (error) {
    error.name = 'Invariant Violation';
    return error;
  }

  var a = (function (error) {
    error.name = 'Invariant Violation';
    return error;
  })(new Error);

  /*
    console.error(a);
    Invariant Violation
      at file:///Users/lijunyang/project/react-source-share/react.js:191:6
      at file:///Users/lijunyang/project/react-source-share/react.js:9:23
      at file:///Users/lijunyang/project/react-source-share/react.js:10:2
  */


  /**
   * @description 发出一个warn警告
   * @description lowPriorityWarning(false, 'aaa %s bbb %s', 'ccc', '888')
   * @description VM2916:24 Warning: aaa ccc bbb 888
   * @param {boolean} condition boolean，是否发出警告，为false时发出警告
   * @param {string} format string 警告的格式
   * @param ...arguments 此内容时是向format填充的内容
   */
  var lowPriorityWarning = function () { };

  {
    /**
     * @description 这是一个错误提示的方法，第一个参数是格式，argments[1]和argments[1]后面的值会填充格式里面的内容
     * @description 打印一个console.warn，然后throw new Error(message); throw是为了调试react使用的
     */
    var printWarning = function (format) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      if (typeof console !== 'undefined') {
        console.warn(message); // 发出一个黄色警告
      }
      try {
        // ---欢迎使用调试React---
        // 为了方便您使用这个堆栈，抛出了这个错误
        // 查找导致此警告触发的调用站点。
        throw new Error(message);
      } catch (x) { }
    };


    lowPriorityWarning = function (condition, format) {
      if (format === undefined) {
        throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');
      }
      if (!condition) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }
        // apply(argA, array); 第一个参数代替this，第二个参数是数组表示传入方法中的参数列表
        printWarning.apply(undefined, [format].concat(args));
      }
    };
  }

  /**
   * @description 发出一个error警告
   * @description warningWithoutStack(false, 'ccc %s bbb %s', 'aaa', 'ccc');
   * @description VM3012:29 Warning: ccc aaa bbb ccc
   * @param {boolean} condition boolean，是否发出警告，为false时发出警告
   * @param {string} format string 警告的格式
   * @param ...arguments 此内容时是向format填充的内容
   */
  var warningWithoutStack = function () { };

  {
    warningWithoutStack = function (condition, format) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      if (format === undefined) {
        // 格式字符串没有发出警告
        throw new Error('`warningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
      }
      if (args.length > 8) {
        // 参数太多也发出警告
        throw new Error('warningWithoutStack() currently supports at most 8 arguments.');
      }
      if (condition) {
        return;
      }
      if (typeof console !== 'undefined') {
        var argsWithFormat = args.map(function (item) {
          return '' + item;
        });
        argsWithFormat.unshift('Warning: ' + format);

        // We intentionally don't use spread (or .apply) directly because it
        // breaks IE9: https://github.com/facebook/react/issues/13610
        // call(argA, ...); 第一个参数表示this，后面的参数是参数列表
        Function.prototype.apply.call(console.error, console, argsWithFormat);
      }
      try {
        // ---欢迎使用调试React---
        // 为了方便您使用这个堆栈，抛出了这个错误
        // 查找导致此警告触发的调用站点。
        var argIndex = 0;
        var message = 'Warning: ' + format.replace(/%s/g, function () {
          return args[argIndex++];
        });
        throw new Error(message);
      } catch (x) { }
    };
  }

  /**
   * @description 发出一个error警告
   * @description warningWithoutStack$1(false, 'ccc %s bbb %s', 'aaa', 'ccc');
   * @description VM3012:29 Warning: ccc aaa bbb ccc
   * @param {boolean} condition boolean，是否发出警告，为false时发出警告
   * @param {string} format string 警告的格式
   * @param ...arguments 此内容时是向format填充的内容
   */
  var warningWithoutStack$1 = warningWithoutStack;

  /**
   * @description warnNoop方法的控制参数，如果抛出过的异常就不在抛了
   * */
  var didWarnStateUpdateForUnmountedComponent = {};

  /**
   * @description 作用未知
   * @param {*} publicInstance 
   * @param {*} callerName 
   */
  function warnNoop (publicInstance, callerName) {
    {
      var _constructor = publicInstance.constructor;
      var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
      var warningKey = componentName + '.' + callerName;
      if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
        return;
      }
      warningWithoutStack$1(false, "Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);
      didWarnStateUpdateForUnmountedComponent[warningKey] = true;
    }
  }

  /**
   * @description 这是更新队列的抽象api。 This is the abstract API for an update queue.
   * @description 重要
   */
  var ReactNoopUpdateQueue = {
    isMounted: function (publicInstance) {
      return false;
    },
    enqueueForceUpdate: function (publicInstance, callback, callerName) {
      warnNoop(publicInstance, 'forceUpdate');
    },
    enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
      warnNoop(publicInstance, 'replaceState');
    },
    enqueueSetState: function (publicInstance, partialState, callback, callerName) {
      warnNoop(publicInstance, 'setState');
    }
  };

  /**
   * @description 声明一个对象，然后冻结它；
  */
  var emptyObject = {};
  {
    Object.freeze(emptyObject);
  }

  /**
   * @description react class组件的函数原型 Component
   * @param {*} props 
   * @param {*} context 
   * @param {*} updater 
   */
  function Component (props, context, updater) {
    debugger;
    this.props = props;
    this.context = context;
    // 如果一个组件有字符串引用，我们稍后将分配一个不同的对象。
    this.refs = emptyObject;
    // 我们初始化了默认的更新程序，但真正的更新程序是由rerender注入的
    this.updater = updater || ReactNoopUpdateQueue;
  }

  Component.prototype.isReactComponent = {};

  /**
   * @description setState方法
   */
  Component.prototype.setState = function (partialState, callback) {
    (function () {
      if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
        {
          throw ReactError(Error('setState(...): takes an object of state variables to update or a function which returns an object of state variables.'));
        }
      }
    })();
    this.updater.enqueueSetState(this, partialState, callback, 'setState');
  };

  /**
   *  @description forceUpdate方法
   */
  Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
  };

  /**
   * 为Component.prototype 设置两个get方法 isMounted，replaceState
   * Component.prototype的isMounted，replaceState默认值为undefined
   */
  {
    var deprecatedAPIs = {
      isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
      replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
    };
    var defineDeprecationWarning = function (methodName, info) {
      Object.defineProperty(Component.prototype, methodName, {
        get: function () {
          lowPriorityWarning(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
          return undefined;
        }
      });
    };
    for (var fnName in deprecatedAPIs) {
      if (deprecatedAPIs.hasOwnProperty(fnName)) {
        defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      }
    }
  }

  function ComponentDummy () { }
  ComponentDummy.prototype = Component.prototype;

  /**
   * @description react class组件的函数原型 PureComponent
   * @param {*} props 
   * @param {*} context 
   * @param {*} updater 
   */
  function PureComponent (props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }

  /**
   * @description PureComponent extends Component.prototype
   */
  var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
  pureComponentPrototype.constructor = PureComponent;

  objectAssign(pureComponentPrototype, Component.prototype);
  pureComponentPrototype.isPureReactComponent = true;

  /**
   * @description creataRef 创建一个占位对象，并将它密封Object.seal({current: null});然后返回这个对象；
  */
  function createRef () {
    var refObject = {
      current: null
    };
    {
      Object.seal(refObject);
    }
    return refObject;
  }

  /**
   * Keeps track of the current dispatcher.
   */
  var ReactCurrentDispatcher = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null
  };

  /**
   * Keeps track of the current batch's configuration such as how long an update
   * should suspend for if it needs to.
   */
  var ReactCurrentBatchConfig = {
    suspense: null
  };

  /**
   * Keeps track of the current owner.
   *
   * The current owner is the component who should own any components that are
   * currently being constructed.
   */
  var ReactCurrentOwner = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null
  };

  var BEFORE_SLASH_RE = /^(.*)[\\\/]/;

  var describeComponentFrame = function (name, source, ownerName) {
    var sourceInfo = '';
    if (source) {
      var path = source.fileName;
      var fileName = path.replace(BEFORE_SLASH_RE, '');
      {
        // In DEV, include code for a common special case:
        // prefer "folder/index.js" instead of just "index.js".
        if (/^index\./.test(fileName)) {
          var match = path.match(BEFORE_SLASH_RE);
          if (match) {
            var pathBeforeSlash = match[1];
            if (pathBeforeSlash) {
              var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
              fileName = folderName + '/' + fileName;
            }
          }
        }
      }
      sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
    } else if (ownerName) {
      sourceInfo = ' (created by ' + ownerName + ')';
    }
    return '\n    in ' + (name || 'Unknown') + sourceInfo;
  };

  var Resolved = 1;


  function refineResolvedLazyComponent (lazyComponent) {
    return lazyComponent._status === Resolved ? lazyComponent._result : null;
  }

  function getWrappedName (outerType, innerType, wrapperName) {
    var functionName = innerType.displayName || innerType.name || '';
    return outerType.displayName || (functionName !== '' ? wrapperName + '(' + functionName + ')' : wrapperName);
  }

  /**
   * @description 返回组件的名称，通过标示返回react私有组件名称string值
   * @return {string} 返回一个string值
  */
  function getComponentName (type) {
    if (type == null) {
      // Host root, text node or just invalid type.
      return null;
    }
    {
      if (typeof type.tag === 'number') {
        warningWithoutStack$1(false, 'Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
      }
    }
    if (typeof type === 'function') {
      return type.displayName || type.name || null;
    }
    if (typeof type === 'string') {
      return type;
    }
    switch (type) {
      case REACT_FRAGMENT_TYPE:
        return 'Fragment';
      case REACT_PORTAL_TYPE:
        return 'Portal';
      case REACT_PROFILER_TYPE:
        return 'Profiler';
      case REACT_STRICT_MODE_TYPE:
        return 'StrictMode';
      case REACT_SUSPENSE_TYPE:
        return 'Suspense';
      case REACT_SUSPENSE_LIST_TYPE:
        return 'SuspenseList';
    }
    if (typeof type === 'object') {
      switch (type.$$typeof) {
        case REACT_CONTEXT_TYPE:
          return 'Context.Consumer';
        case REACT_PROVIDER_TYPE:
          return 'Context.Provider';
        case REACT_FORWARD_REF_TYPE:
          return getWrappedName(type, type.render, 'ForwardRef');
        case REACT_MEMO_TYPE:
          return getComponentName(type.type);
        case REACT_LAZY_TYPE:
          {
            var thenable = type;
            var resolvedThenable = refineResolvedLazyComponent(thenable);
            if (resolvedThenable) {
              return getComponentName(resolvedThenable);
            }
            break;
          }
      }
    }
    return null;
  }

  var ReactDebugCurrentFrame = {};

  var currentlyValidatingElement = null;

  function setCurrentlyValidatingElement (element) {
    {
      currentlyValidatingElement = element;
    }
  }

  {
    // Stack implementation injected by the current renderer.
    ReactDebugCurrentFrame.getCurrentStack = null;

    ReactDebugCurrentFrame.getStackAddendum = function () {
      var stack = '';

      // Add an extra top frame while an element is being validated
      if (currentlyValidatingElement) {
        var name = getComponentName(currentlyValidatingElement.type);
        var owner = currentlyValidatingElement._owner;
        stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
      }

      // Delegate to the injected renderer-specific implementation
      var impl = ReactDebugCurrentFrame.getCurrentStack;
      if (impl) {
        stack += impl() || '';
      }

      return stack;
    };
  }

  /**
   * Used by act() to track whether you're inside an act() scope.
   */

  var IsSomeRendererActing = {
    current: false
  };

  var ReactSharedInternals = {
    ReactCurrentDispatcher: ReactCurrentDispatcher,
    ReactCurrentBatchConfig: ReactCurrentBatchConfig,
    ReactCurrentOwner: ReactCurrentOwner,
    IsSomeRendererActing: IsSomeRendererActing,
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign: objectAssign
  };

  {
    objectAssign(ReactSharedInternals, {
      // These should not be included in production.
      ReactDebugCurrentFrame: ReactDebugCurrentFrame,
      // Shim for React DOM 16.0.0 which still destructured (but not used) this.
      // TODO: remove in React 17.0.
      ReactComponentTreeHook: {}
    });
  }

  /**
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var warning = warningWithoutStack$1;

  {
    warning = function (condition, format) {
      if (condition) {
        return;
      }
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      var stack = ReactDebugCurrentFrame.getStackAddendum();
      // eslint-disable-next-line react-internal/warning-and-invariant-args

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      warningWithoutStack$1.apply(undefined, [false, format + '%s'].concat(args, [stack]));
    };
  }

  var warning$1 = warning;

  /**
   * @description 验证一个属性是不是某个对象的属性
   */
  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

  var RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
  };

  var specialPropKeyWarningShown = void 0;
  var specialPropRefWarningShown = void 0;


  /**
   * @description 验证是否具有ref属性，如果有，获取ref的属性描述符，然后看有没有get属性，如果有它是一个访问器描述符，并且具有isReactWarning这个私有属性的话返回false
   * @description 如果它不是一个访问描述符合，并且不等于undefined返回true
   * @param {*} config 
   */
  function hasValidRef (config) {
    {
      if (hasOwnProperty$1.call(config, 'ref')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.ref !== undefined;
  }

  /**
   * @description 验证是否具有key属性，如果有，获取key的属性描述符，然后看有没有get属性，如果有它是一个访问器描述符，并且具有isReactWarning这个私有属性的话返回false
   * @description 如果它不是一个访问描述符合，并且不等于undefined返回true
   * @param {*} config 
   */
  function hasValidKey (config) {
    {
      if (hasOwnProperty$1.call(config, 'key')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.key !== undefined;
  }

  function defineKeyPropWarningGetter (props, displayName) {
    var warnAboutAccessingKey = function () {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;
        warningWithoutStack$1(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    };
    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, 'key', {
      get: warnAboutAccessingKey,
      configurable: true
    });
  }

  function defineRefPropWarningGetter (props, displayName) {
    var warnAboutAccessingRef = function () {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;
        warningWithoutStack$1(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    };
    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, 'ref', {
      get: warnAboutAccessingRef,
      configurable: true
    });
  }

  /**
   * @description 返回一个ReactElement对象
   * @param {*} type
   * @param {*} props
   * @param {*} key
   * @param {string|object} ref
   * @param {*} owner
   * @param {*} self 
   * @param {*} source 
   * @internal
   */
  var ReactElement = function (type, key, ref, self, source, owner, props) {
    var element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,

      // Built-in properties that belong on the element
      type: type,
      key: key,
      ref: ref,
      props: props,

      // Record the component responsible for creating this element.
      _owner: owner
    };

    {
      // 设置一个react.element的仓库
      element._store = {};

      // 属性描述符号 
      // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
      // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties

      // 设置属性描述符
      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      });
      // 设置属性描述符
      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      });
      // 设置属性描述符号
      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });
      // 冻结一个对象，冻结的对象不允许被修改
      if (Object.freeze) {
        Object.freeze(element.props);
        Object.freeze(element);
      }
    }

    return element;
  };

  /**
   * @description 此方法返回和React.creataElement一样
  */
  function jsxDEV (type, config, maybeKey, source, self) {
    var propName = void 0;

    // Reserved names are extracted
    var props = {};

    var key = null;
    var ref = null;

    if (hasValidRef(config)) {
      ref = config.ref;
    }

    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    // Remaining properties are added to a new props object
    for (propName in config) {
      /* 
        var RESERVED_PROPS = {
          key: true,
          ref: true,
          __self: true,
          __source: true
        };
      */
      if (hasOwnProperty$1.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }

    // intentionally not checking if key was set above
    // this key is higher priority as it's static
    if (maybeKey !== undefined) {
      key = '' + maybeKey;
    }

    // Resolve default props
    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;
      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }

    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }

    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }

  /**
   * @description 创建一个ReactElement元素
   * @param {*} type 它可以是一个string，或者是一个函数，如果是一个函数的话，会验证它的函数的原型是谁
   * @param {*} config props与ref与key的设置
   * @param {*} children 子元素，可以是数组，也可以是单个元素
   */
  function createElement (type, config, children) {
    var propName = void 0;

    // 设置props
    var props = {};

    var key = null;
    var ref = null;
    var self = null;
    var source = null;

    // 这里是传递给子元素的props的设置，和ref与key的设置,还有__self,__source
    if (config != null) {
      if (hasValidRef(config)) {
        ref = config.ref;
      }
      if (hasValidKey(config)) {
        key = '' + config.key;
      }

      self = config.__self === undefined ? null : config.__self;
      source = config.__source === undefined ? null : config.__source;

      for (propName in config) {
        // 过滤ref，key，__self,__source
        const bool = !RESERVED_PROPS.hasOwnProperty(propName);
        if (hasOwnProperty$1.call(config, propName) && bool) {
          props[propName] = config[propName];
        }
      }
    }

    // 检测参数个，如果只有3个值，证明children是一个元素，如果多余3个值，children是一个数组,
    // 并将它加入到props.chlidren里面
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      {
        // 如果支持Object.freeze，将子元素冻结
        if (Object.freeze) {
          Object.freeze(childArray);
        }
      }
      props.children = childArray;
    }

    // 如果type存在，并且具备defaultProps属性时，此时type一般为函数类型，将defaultProps的value赋值到props里面，注意这里不是递归的哦，只处理第一层
    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;
      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }
    // 有没有key或ref
    {
      if (key || ref) { // 如果key存在或者ref存在
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }

  /**
   * @description 返回一个新的ReactElement对象，改变它的key值
   * @param {*} oldElement 
   * @param {*} newKey 
   */
  function cloneAndReplaceKey (oldElement, newKey) {
    var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

    return newElement;
  }

  /**
   * @description clone一个新组件
   * @param {*} element 
   * @param {*} config 
   * @param {*} children 
   */
  function cloneElement (element, config, children) {
    (function () {
      if (!!(element === null || element === undefined)) {
        {
          throw ReactError(Error('React.cloneElement(...): The argument must be a React element, but you passed ' + element + '.'));
        }
      }
    })();

    var propName = void 0;

    // Original props are copied
    var props = objectAssign({}, element.props);

    // Reserved names are extracted
    var key = element.key;
    var ref = element.ref;
    // Self is preserved since the owner is preserved.
    var self = element._self;
    // Source is preserved since cloneElement is unlikely to be targeted by a
    // transpiler, and the original source is probably a better indicator of the
    // true owner.
    var source = element._source;

    // Owner will be preserved, unless ref is overridden
    var owner = element._owner;

    if (config != null) {
      if (hasValidRef(config)) {
        // Silently steal the ref from the parent.
        ref = config.ref;
        owner = ReactCurrentOwner.current;
      }
      if (hasValidKey(config)) {
        key = '' + config.key;
      }

      // Remaining properties override existing props
      var defaultProps = void 0;
      if (element.type && element.type.defaultProps) {
        defaultProps = element.type.defaultProps;
      }
      for (propName in config) {
        if (hasOwnProperty$1.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          if (config[propName] === undefined && defaultProps !== undefined) {
            // Resolve default props
            props[propName] = defaultProps[propName];
          } else {
            props[propName] = config[propName];
          }
        }
      }
    }

    // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      props.children = childArray;
    }

    return ReactElement(element.type, key, ref, self, source, owner, props);
  }

  /**
   * Verifies the object is a ReactElement.
   * See https://reactjs.org/docs/react-api.html#isvalidelement
   * @param {?object} object
   * @return {boolean} True if `object` is a ReactElement.
   * @final
   */
  function isValidElement (object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }

  var SEPARATOR = '.';
  var SUBSEPARATOR = ':';

  /**
   * Escape and wrap key so it is safe to use as a reactid
   *
   * @param {string} key to be escaped.
   * @return {string} the escaped key.
   */
  function escape (key) {
    var escapeRegex = /[=:]/g;
    var escaperLookup = {
      '=': '=0',
      ':': '=2'
    };
    var escapedString = ('' + key).replace(escapeRegex, function (match) {
      return escaperLookup[match];
    });

    return '$' + escapedString;
  }

  /**
   * TODO: Test that a single child and an array with one item have the same key
   * pattern.
   */

  var didWarnAboutMaps = false;

  var userProvidedKeyEscapeRegex = /\/+/g;
  function escapeUserProvidedKey (text) {
    return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
  }

  var POOL_SIZE = 10;
  var traverseContextPool = [];
  function getPooledTraverseContext (mapResult, keyPrefix, mapFunction, mapContext) {
    if (traverseContextPool.length) {
      var traverseContext = traverseContextPool.pop();
      traverseContext.result = mapResult;
      traverseContext.keyPrefix = keyPrefix;
      traverseContext.func = mapFunction;
      traverseContext.context = mapContext;
      traverseContext.count = 0;
      return traverseContext;
    } else {
      return {
        result: mapResult,
        keyPrefix: keyPrefix,
        func: mapFunction,
        context: mapContext,
        count: 0
      };
    }
  }

  function releaseTraverseContext (traverseContext) {
    traverseContext.result = null;
    traverseContext.keyPrefix = null;
    traverseContext.func = null;
    traverseContext.context = null;
    traverseContext.count = 0;
    if (traverseContextPool.length < POOL_SIZE) {
      traverseContextPool.push(traverseContext);
    }
  }

  /**
   * @param {?*} children Children tree container.
   * @param {!string} nameSoFar Name of the key path so far.
   * @param {!function} callback Callback to invoke with each child found.
   * @param {?*} traverseContext Used to pass information throughout the traversal
   * process.
   * @return {!number} The number of children in this subtree.
   */
  function traverseAllChildrenImpl (children, nameSoFar, callback, traverseContext) {
    var type = typeof children;

    if (type === 'undefined' || type === 'boolean') {
      // All of the above are perceived as null.
      children = null;
    }

    var invokeCallback = false;

    if (children === null) {
      invokeCallback = true;
    } else {
      switch (type) {
        case 'string':
        case 'number':
          invokeCallback = true;
          break;
        case 'object':
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
          }
      }
    }

    if (invokeCallback) {
      callback(traverseContext, children,
        // If it's the only child, treat the name as if it was wrapped in an array
        // so that it's consistent if the number of children grows.
        nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
      return 1;
    }

    var child = void 0;
    var nextName = void 0;
    var subtreeCount = 0; // Count of children found in the current subtree.
    var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        nextName = nextNamePrefix + getComponentKey(child, i);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else {
      var iteratorFn = getIteratorFn(children);
      if (typeof iteratorFn === 'function') {
        {
          // Warn about using Maps as children
          if (iteratorFn === children.entries) {
            !didWarnAboutMaps ? warning$1(false, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.') : void 0;
            didWarnAboutMaps = true;
          }
        }

        var iterator = iteratorFn.call(children);
        var step = void 0;
        var ii = 0;
        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else if (type === 'object') {
        var addendum = '';
        {
          addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
        }
        var childrenString = '' + children;
        (function () {
          {
            {
              throw ReactError(Error('Objects are not valid as a React child (found: ' + (childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + ').' + addendum));
            }
          }
        })();
      }
    }

    return subtreeCount;
  }

  /**
   * Traverses children that are typically specified as `props.children`, but
   * might also be specified through attributes:
   *
   * - `traverseAllChildren(this.props.children, ...)`
   * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
   *
   * The `traverseContext` is an optional argument that is passed through the
   * entire traversal. It can be used to store accumulations or anything else that
   * the callback might find relevant.
   *
   * @param {?*} children Children tree object.
   * @param {!function} callback To invoke upon traversing each child.
   * @param {?*} traverseContext Context for traversal.
   * @return {!number} The number of children in this subtree.
   */
  function traverseAllChildren (children, callback, traverseContext) {
    if (children == null) {
      return 0;
    }

    return traverseAllChildrenImpl(children, '', callback, traverseContext);
  }

  /**
   * Generate a key string that identifies a component within a set.
   *
   * @param {*} component A component that could contain a manual key.
   * @param {number} index Index that is used if a manual key is not provided.
   * @return {string}
   */
  function getComponentKey (component, index) {
    // Do some typechecking here since we call this blindly. We want to ensure
    // that we don't block potential future ES APIs.
    if (typeof component === 'object' && component !== null && component.key != null) {
      // Explicit key
      return escape(component.key);
    }
    // Implicit key determined by the index in the set
    return index.toString(36);
  }

  function forEachSingleChild (bookKeeping, child, name) {
    var func = bookKeeping.func,
      context = bookKeeping.context;

    func.call(context, child, bookKeeping.count++);
  }

  /**
   * Iterates through children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
   *
   * The provided forEachFunc(child, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} forEachFunc
   * @param {*} forEachContext Context for forEachContext.
   */
  function forEachChildren (children, forEachFunc, forEachContext) {
    if (children == null) {
      return children;
    }
    var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
    traverseAllChildren(children, forEachSingleChild, traverseContext);
    releaseTraverseContext(traverseContext);
  }

  function mapSingleChildIntoContext (bookKeeping, child, childKey) {
    var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;


    var mappedChild = func.call(context, child, bookKeeping.count++);
    if (Array.isArray(mappedChild)) {
      mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
        return c;
      });
    } else if (mappedChild != null) {
      if (isValidElement(mappedChild)) {
        mappedChild = cloneAndReplaceKey(mappedChild,
          // Keep both the (mapped) and old keys if they differ, just as
          // traverseAllChildren used to do for objects as children
          keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
      }
      result.push(mappedChild);
    }
  }

  function mapIntoWithKeyPrefixInternal (children, array, prefix, func, context) {
    var escapedPrefix = '';
    if (prefix != null) {
      escapedPrefix = escapeUserProvidedKey(prefix) + '/';
    }
    var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
    traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
    releaseTraverseContext(traverseContext);
  }


  function mapChildren (children, func, context) {
    if (children == null) {
      return children;
    }
    var result = [];
    mapIntoWithKeyPrefixInternal(children, result, null, func, context);
    return result;
  }

  /**
   * Count the number of children that are typically specified as
   * `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrencount
   *
   * @param {?*} children Children tree container.
   * @return {number} The number of children.
   */
  function countChildren (children) {
    return traverseAllChildren(children, function () {
      return null;
    }, null);
  }

  /**
   * Flatten a children object (typically specified as `props.children`) and
   * return an array with appropriately re-keyed children.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
   */
  function toArray (children) {
    var result = [];
    mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
      return child;
    });
    return result;
  }

  /**
   * Returns the first child in a collection of children and verifies that there
   * is only one child in the collection.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenonly
   *
   * The current implementation of this function assumes that a single child gets
   * passed without a wrapper, but the purpose of this helper function is to
   * abstract away the particular structure of children.
   *
   * @param {?object} children Child collection structure.
   * @return {ReactElement} The first and only `ReactElement` contained in the
   * structure.
   */
  function onlyChild (children) {
    (function () {
      if (!isValidElement(children)) {
        {
          throw ReactError(Error('React.Children.only expected to receive a single React element child.'));
        }
      }
    })();
    return children;
  }

  function createContext (defaultValue, calculateChangedBits) {
    if (calculateChangedBits === undefined) {
      calculateChangedBits = null;
    } else {
      {
        !(calculateChangedBits === null || typeof calculateChangedBits === 'function') ? warningWithoutStack$1(false, 'createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits) : void 0;
      }
    }

    var context = {
      $$typeof: REACT_CONTEXT_TYPE,
      _calculateChangedBits: calculateChangedBits,
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    };

    context.Provider = {
      $$typeof: REACT_PROVIDER_TYPE,
      _context: context
    };

    var hasWarnedAboutUsingNestedContextConsumers = false;
    var hasWarnedAboutUsingConsumerProvider = false;

    {
      var Consumer = {
        $$typeof: REACT_CONTEXT_TYPE,
        _context: context,
        _calculateChangedBits: context._calculateChangedBits
      };
      Object.defineProperties(Consumer, {
        Provider: {
          get: function () {
            if (!hasWarnedAboutUsingConsumerProvider) {
              hasWarnedAboutUsingConsumerProvider = true;
              warning$1(false, 'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
            }
            return context.Provider;
          },
          set: function (_Provider) {
            context.Provider = _Provider;
          }
        },
        _currentValue: {
          get: function () {
            return context._currentValue;
          },
          set: function (_currentValue) {
            context._currentValue = _currentValue;
          }
        },
        _currentValue2: {
          get: function () {
            return context._currentValue2;
          },
          set: function (_currentValue2) {
            context._currentValue2 = _currentValue2;
          }
        },
        _threadCount: {
          get: function () {
            return context._threadCount;
          },
          set: function (_threadCount) {
            context._threadCount = _threadCount;
          }
        },
        Consumer: {
          get: function () {
            if (!hasWarnedAboutUsingNestedContextConsumers) {
              hasWarnedAboutUsingNestedContextConsumers = true;
              warning$1(false, 'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
            }
            return context.Consumer;
          }
        }
      });
      context.Consumer = Consumer;
    }

    {
      context._currentRenderer = null;
      context._currentRenderer2 = null;
    }

    return context;
  }

  function lazy (ctor) {
    var lazyType = {
      $$typeof: REACT_LAZY_TYPE,
      _ctor: ctor,
      // React uses these fields to store the result.
      _status: -1,
      _result: null
    };

    {
      // In production, this would just set it on the object.
      var defaultProps = void 0;
      var propTypes = void 0;
      Object.defineProperties(lazyType, {
        defaultProps: {
          configurable: true,
          get: function () {
            return defaultProps;
          },
          set: function (newDefaultProps) {
            warning$1(false, 'React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
            defaultProps = newDefaultProps;
            // Match production behavior more closely:
            Object.defineProperty(lazyType, 'defaultProps', {
              enumerable: true
            });
          }
        },
        propTypes: {
          configurable: true,
          get: function () {
            return propTypes;
          },
          set: function (newPropTypes) {
            warning$1(false, 'React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
            propTypes = newPropTypes;
            // Match production behavior more closely:
            Object.defineProperty(lazyType, 'propTypes', {
              enumerable: true
            });
          }
        }
      });
    }

    return lazyType;
  }


  /**
   * @description ref转发 提供给外部的方法，不被内部所调用
   * @param {*} render 
   */
  function forwardRef (render) {
    {
      if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
        warningWithoutStack$1(false, 'forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
      } else if (typeof render !== 'function') {
        warningWithoutStack$1(false, 'forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
      } else {
        !(
          // Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
          render.length === 0 || render.length === 2) ? warningWithoutStack$1(false, 'forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.') : void 0;
      }

      if (render != null) {
        !(render.defaultProps == null && render.propTypes == null) ? warningWithoutStack$1(false, 'forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?') : void 0;
      }
    }

    return {
      $$typeof: REACT_FORWARD_REF_TYPE,
      render: render
    };
  }

  function isValidElementType (type) {
    return typeof type === 'string' ||
      typeof type === 'function' ||
      type === REACT_FRAGMENT_TYPE ||
      type === REACT_CONCURRENT_MODE_TYPE ||
      type === REACT_PROFILER_TYPE ||
      type === REACT_STRICT_MODE_TYPE ||
      type === REACT_SUSPENSE_TYPE ||
      type === REACT_SUSPENSE_LIST_TYPE ||

      typeof type === 'object' &&

      type !== null &&

      (type.$$typeof === REACT_LAZY_TYPE ||
        type.$$typeof === REACT_MEMO_TYPE ||
        type.$$typeof === REACT_PROVIDER_TYPE ||
        type.$$typeof === REACT_CONTEXT_TYPE ||
        type.$$typeof === REACT_FORWARD_REF_TYPE ||
        type.$$typeof === REACT_FUNDAMENTAL_TYPE ||
        type.$$typeof === REACT_RESPONDER_TYPE);
  }

  function memo (type, compare) {
    {
      if (!isValidElementType(type)) {
        warningWithoutStack$1(false, 'memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
      }
    }
    return {
      $$typeof: REACT_MEMO_TYPE,
      type: type,
      compare: compare === undefined ? null : compare
    };
  }

  function resolveDispatcher () {
    var dispatcher = ReactCurrentDispatcher.current;

    (function () {
      if (!(dispatcher !== null)) {
        {
          throw ReactError(Error('Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.'));
        }
      }
    })();
    return dispatcher;
  }

  function useContext (Context, unstable_observedBits) {
    var dispatcher = resolveDispatcher();
    {
      !(unstable_observedBits === undefined) ? warning$1(false, 'useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://fb.me/rules-of-hooks' : '') : void 0;

      // TODO: add a more generic warning for invalid values.
      if (Context._context !== undefined) {
        var realContext = Context._context;
        // Don't deduplicate because this legitimately causes bugs
        // and nobody should be using this in existing code.
        if (realContext.Consumer === Context) {
          warning$1(false, 'Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
        } else if (realContext.Provider === Context) {
          warning$1(false, 'Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
        }
      }
    }
    return dispatcher.useContext(Context, unstable_observedBits);
  }

  function useState (initialState) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useState(initialState);
  }

  function useReducer (reducer, initialArg, init) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useReducer(reducer, initialArg, init);
  }

  function useRef (initialValue) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useRef(initialValue);
  }

  function useEffect (create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useEffect(create, inputs);
  }

  function useLayoutEffect (create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useLayoutEffect(create, inputs);
  }

  function useCallback (callback, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useCallback(callback, inputs);
  }

  function useMemo (create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useMemo(create, inputs);
  }

  function useImperativeHandle (ref, create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useImperativeHandle(ref, create, inputs);
  }

  function useDebugValue (value, formatterFn) {
    {
      var dispatcher = resolveDispatcher();
      return dispatcher.useDebugValue(value, formatterFn);
    }
  }

  var emptyObject$1 = {};

  function useResponder (responder, listenerProps) {
    var dispatcher = resolveDispatcher();
    {
      if (responder == null || responder.$$typeof !== REACT_RESPONDER_TYPE) {
        warning$1(false, 'useResponder: invalid first argument. Expected an event responder, but instead got %s', responder);
        return;
      }
    }
    return dispatcher.useResponder(responder, listenerProps || emptyObject$1);
  }

  // Within the scope of the callback, mark all updates as being allowed to suspend.
  function withSuspenseConfig (scope, config) {
    var previousConfig = ReactCurrentBatchConfig.suspense;
    ReactCurrentBatchConfig.suspense = config === undefined ? null : config;
    try {
      scope();
    } finally {
      ReactCurrentBatchConfig.suspense = previousConfig;
    }
  }

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */



  var ReactPropTypesSecret$1 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

  var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */



  var printWarning$1 = function () { };

  {
    var ReactPropTypesSecret = ReactPropTypesSecret_1;
    var loggedTypeFailures = {};

    printWarning$1 = function (text) {
      var message = 'Warning: ' + text;
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) { }
    };
  }

  /**
   * Assert that the values match with the type specs.
   * Error messages are memorized and will only be shown once.
   *
   * @param {object} typeSpecs Map of name to a ReactPropType
   * @param {object} values Runtime values that need to be type-checked
   * @param {string} location e.g. "prop", "context", "child context"
   * @param {string} componentName Name of the component for error messages.
   * @param {?Function} getStack Returns the component stack.
   * @private
   */
  function checkPropTypes (typeSpecs, values, location, componentName, getStack) {
    {
      for (var typeSpecName in typeSpecs) {
        if (typeSpecs.hasOwnProperty(typeSpecName)) {
          var error;
          // Prop type validation may throw. In case they do, we don't want to
          // fail the render phase where it didn't fail before. So we log it.
          // After these have been cleaned up, we'll let them throw.
          try {
            // This is intentionally an invariant that gets caught. It's the same
            // behavior as without this statement except with a better message.
            if (typeof typeSpecs[typeSpecName] !== 'function') {
              var err = Error(
                (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
                'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
              );
              err.name = 'Invariant Violation';
              throw err;
            }
            error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
          } catch (ex) {
            error = ex;
          }
          if (error && !(error instanceof Error)) {
            printWarning$1(
              (componentName || 'React class') + ': type specification of ' +
              location + ' `' + typeSpecName + '` is invalid; the type checker ' +
              'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
              'You may have forgotten to pass an argument to the type checker ' +
              'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
              'shape all require an argument).'
            );

          }
          if (error instanceof Error && !(error.message in loggedTypeFailures)) {
            // Only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedTypeFailures[error.message] = true;

            var stack = getStack ? getStack() : '';

            printWarning$1(
              'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
            );
          }
        }
      }
    }
  }

  var checkPropTypes_1 = checkPropTypes;

  /**
   * ReactElementValidator provides a wrapper around a element factory
   * which validates the props passed to the element. This is intended to be
   * used only in DEV and could be replaced by a static type checker for languages
   * that support it.
   */

  var propTypesMisspellWarningShown = void 0;

  {
    propTypesMisspellWarningShown = false;
  }

  function getDeclarationErrorAddendum () {
    if (ReactCurrentOwner.current) {
      var name = getComponentName(ReactCurrentOwner.current.type);
      if (name) {
        return '\n\nCheck the render method of `' + name + '`.';
      }
    }
    return '';
  }

  function getSourceInfoErrorAddendum (source) {
    if (source !== undefined) {
      var fileName = source.fileName.replace(/^.*[\\\/]/, '');
      var lineNumber = source.lineNumber;
      return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
    }
    return '';
  }

  function getSourceInfoErrorAddendumForProps (elementProps) {
    if (elementProps !== null && elementProps !== undefined) {
      return getSourceInfoErrorAddendum(elementProps.__source);
    }
    return '';
  }

  /**
   * Warn if there's no key explicitly set on dynamic arrays of children or
   * object keys are not valid. This allows us to keep track of children between
   * updates.
   */
  var ownerHasKeyUseWarning = {};

  function getCurrentComponentErrorInfo (parentType) {
    var info = getDeclarationErrorAddendum();

    if (!info) {
      var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
      if (parentName) {
        info = '\n\nCheck the top-level render call using <' + parentName + '>.';
      }
    }
    return info;
  }

  /**
   * Warn if the element doesn't have an explicit key assigned to it.
   * This element is in an array. The array could grow and shrink or be
   * reordered. All children that haven't already been validated are required to
   * have a "key" property assigned to it. Error statuses are cached so a warning
   * will only be shown once.
   *
   * @internal
   * @param {ReactElement} element Element that requires a key.
   * @param {*} parentType element's parent's type.
   */
  function validateExplicitKey (element, parentType) {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }
    element._store.validated = true;

    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
      return;
    }
    ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

    // Usually the current owner is the offender, but if it accepts children as a
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.
    var childOwner = '';
    if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
      // Give the component that originally created this child.
      childOwner = ' It was passed a child from ' + getComponentName(element._owner.type) + '.';
    }

    setCurrentlyValidatingElement(element);
    {
      warning$1(false, 'Each child in a list should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
    }
    setCurrentlyValidatingElement(null);
  }

  /**
   * Ensure that every element either is passed in a static location, in an
   * array with an explicit keys property defined, or in an object literal
   * with valid key property.
   *
   * @internal
   * @param {ReactNode} node Statically passed child of any type.
   * @param {*} parentType node's parent's type.
   */
  function validateChildKeys (node, parentType) {
    if (typeof node !== 'object') {
      return;
    }
    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];
        if (isValidElement(child)) {
          validateExplicitKey(child, parentType);
        }
      }
    } else if (isValidElement(node)) {
      // This element was passed in a valid location.
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      var iteratorFn = getIteratorFn(node);
      if (typeof iteratorFn === 'function') {
        // Entry iterators used to provide implicit keys,
        // but now we print a separate warning for them later.
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step = void 0;
          while (!(step = iterator.next()).done) {
            if (isValidElement(step.value)) {
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      }
    }
  }

  /**
   * Given an element, validate that its props follow the propTypes definition,
   * provided by the type.
   *
   * @param {ReactElement} element
   */
  function validatePropTypes (element) {
    var type = element.type;
    if (type === null || type === undefined || typeof type === 'string') {
      return;
    }
    var name = getComponentName(type);
    var propTypes = void 0;
    if (typeof type === 'function') {
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE ||
      // Note: Memo only checks outer props here.
      // Inner props are checked in the reconciler.
      type.$$typeof === REACT_MEMO_TYPE)) {
      propTypes = type.propTypes;
    } else {
      return;
    }
    if (propTypes) {
      setCurrentlyValidatingElement(element);
      checkPropTypes_1(propTypes, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
      setCurrentlyValidatingElement(null);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true;
      warningWithoutStack$1(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
    }
    if (typeof type.getDefaultProps === 'function') {
      !type.getDefaultProps.isReactClassApproved ? warningWithoutStack$1(false, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
    }
  }

  /**
   * Given a fragment, validate that it can only be provided with fragment props
   * @param {ReactElement} fragment
   */
  function validateFragmentProps (fragment) {
    setCurrentlyValidatingElement(fragment);

    var keys = Object.keys(fragment.props);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key !== 'children' && key !== 'key') {
        warning$1(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);
        break;
      }
    }

    if (fragment.ref !== null) {
      warning$1(false, 'Invalid attribute `ref` supplied to `React.Fragment`.');
    }

    setCurrentlyValidatingElement(null);
  }

  function jsxWithValidation (type, props, key, isStaticChildren, source, self) {
    var validType = isValidElementType(type);

    // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    if (!validType) {
      var info = '';
      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }

      var sourceInfo = getSourceInfoErrorAddendum(source);
      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      var typeString = void 0;
      if (type === null) {
        typeString = 'null';
      } else if (Array.isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = '<' + (getComponentName(type.type) || 'Unknown') + ' />';
        info = ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      warning$1(false, 'React.jsx: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }

    var element = jsxDEV(type, props, key, source, self);

    // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.
    if (element == null) {
      return element;
    }

    // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)
    if (validType) {
      var children = props.children;
      if (children !== undefined) {
        if (isStaticChildren) {
          for (var i = 0; i < children.length; i++) {
            validateChildKeys(children[i], type);
          }
        } else {
          validateChildKeys(children, type);
        }
      }
    }

    if (props.key !== undefined) {
      warning$1(false, 'React.jsx: Spreading a key to JSX is a deprecated pattern. ' + 'Explicitly pass a key after spreading props in your JSX call. ' + 'E.g. <ComponentName {...props} key={key} />');
    }

    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      validatePropTypes(element);
    }

    return element;
  }

  function jsxWithValidationStatic (type, props, key) {
    return jsxWithValidation(type, props, key, true);
  }

  function jsxWithValidationDynamic (type, props, key) {
    return jsxWithValidation(type, props, key, false);
  }

  function createElementWithValidation (type, props, children) {
    var validType = isValidElementType(type);


    if (!validType) {
      var info = '';
      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }

      var sourceInfo = getSourceInfoErrorAddendumForProps(props);
      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      var typeString = void 0;
      if (type === null) {
        typeString = 'null';
      } else if (Array.isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = '<' + (getComponentName(type.type) || 'Unknown') + ' />';
        info = ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      warning$1(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }

    var element = createElement.apply(this, arguments);

    // return null的情况
    if (element == null) {
      return element;
    }

    // 如果agrument.length长度为3的话执行
    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    // 如果节点的类型是fragment, 这种节点比较特殊,它是这样的<></>
    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      // 验证你是一个 一个普通HTMLElement元素，还是一个class元素
      validatePropTypes(element);
    }

    return element;
  }

  function createFactoryWithValidation (type) {
    var validatedFactory = createElementWithValidation.bind(null, type);
    validatedFactory.type = type;
    // Legacy hook: remove it
    {
      Object.defineProperty(validatedFactory, 'type', {
        enumerable: false,
        get: function () {
          lowPriorityWarning(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
          Object.defineProperty(this, 'type', {
            value: type
          });
          return type;
        }
      });
    }

    return validatedFactory;
  }

  function cloneElementWithValidation (element, props, children) {
    var newElement = cloneElement.apply(this, arguments);
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }
    validatePropTypes(newElement);
    return newElement;
  }

  var enableSchedulerDebugging = false;
  var enableIsInputPending = false;
  var requestIdleCallbackBeforeFirstFrame = false;
  var requestTimerEventBeforeFirstFrame = false;
  var enableMessageLoopImplementation = false;

  // The DOM Scheduler implementation is similar to requestIdleCallback. It
  // works by scheduling a requestAnimationFrame, storing the time for the start
  // of the frame, then scheduling a postMessage which gets scheduled after paint.
  // Within the postMessage handler do as much work as possible until time + frame
  // rate. By separating the idle call into a separate event tick we ensure that
  // layout, paint and other browser work is counted against the available time.
  // The frame rate is dynamically adjusted.

  var requestHostCallback = void 0;

  var requestHostTimeout = void 0;
  var cancelHostTimeout = void 0;
  var shouldYieldToHost = void 0;
  var requestPaint = void 0;
  var getCurrentTime = void 0;
  var forceFrameRate = void 0;

  if (
    // If Scheduler runs in a non-DOM environment, it falls back to a naive
    // implementation using setTimeout.
    typeof window === 'undefined' ||
    // Check if MessageChannel is supported, too.
    typeof MessageChannel !== 'function') {
    // If this accidentally gets imported in a non-browser environment, e.g. JavaScriptCore,
    // fallback to a naive implementation.
    var _callback = null;
    var _timeoutID = null;
    var _flushCallback = function () {
      if (_callback !== null) {
        try {
          var currentTime = getCurrentTime();
          var hasRemainingTime = true;
          _callback(hasRemainingTime, currentTime);
          _callback = null;
        } catch (e) {
          setTimeout(_flushCallback, 0);
          throw e;
        }
      }
    };
    getCurrentTime = function () {
      return Date.now();
    };
    requestHostCallback = function (cb) {
      if (_callback !== null) {
        // Protect against re-entrancy.
        setTimeout(requestHostCallback, 0, cb);
      } else {
        _callback = cb;
        setTimeout(_flushCallback, 0);
      }
    };
    requestHostTimeout = function (cb, ms) {
      _timeoutID = setTimeout(cb, ms);
    };
    cancelHostTimeout = function () {
      clearTimeout(_timeoutID);
    };
    shouldYieldToHost = function () {
      return false;
    };
    requestPaint = forceFrameRate = function () { };
  } else {
    // Capture local references to native APIs, in case a polyfill overrides them.
    var performance = window.performance;
    var _Date = window.Date;
    var _setTimeout = window.setTimeout;
    var _clearTimeout = window.clearTimeout;
    var requestAnimationFrame = window.requestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame;
    var requestIdleCallback = window.requestIdleCallback;

    if (typeof console !== 'undefined') {
      // TODO: Remove fb.me link
      if (typeof requestAnimationFrame !== 'function') {
        console.error("This browser doesn't support requestAnimationFrame. " + 'Make sure that you load a ' + 'polyfill in older browsers. https://fb.me/react-polyfills');
      }
      if (typeof cancelAnimationFrame !== 'function') {
        console.error("This browser doesn't support cancelAnimationFrame. " + 'Make sure that you load a ' + 'polyfill in older browsers. https://fb.me/react-polyfills');
      }
    }

    var requestIdleCallbackBeforeFirstFrame$1 = requestIdleCallbackBeforeFirstFrame && typeof requestIdleCallback === 'function' && typeof cancelIdleCallback === 'function';

    getCurrentTime = typeof performance === 'object' && typeof performance.now === 'function' ? function () {
      return performance.now();
    } : function () {
      return _Date.now();
    };

    var isRAFLoopRunning = false;
    var isMessageLoopRunning = false;
    var scheduledHostCallback = null;
    var rAFTimeoutID = -1;
    var taskTimeoutID = -1;

    var frameLength = enableMessageLoopImplementation ? // We won't attempt to align with the vsync. Instead we'll yield multiple
      // times per frame, often enough to keep it responsive even at really
      // high frame rates > 120.
      5 : // Use a heuristic to measure the frame rate and yield at the end of the
      // frame. We start out assuming that we run at 30fps but then the
      // heuristic tracking will adjust this value to a faster fps if we get
      // more frequent animation frames.
      33.33;

    var prevRAFTime = -1;
    var prevRAFInterval = -1;
    var frameDeadline = 0;

    var fpsLocked = false;

    // TODO: Make this configurable
    // TODO: Adjust this based on priority?
    var maxFrameLength = 300;
    var needsPaint = false;

    if (enableIsInputPending && navigator !== undefined && navigator.scheduling !== undefined && navigator.scheduling.isInputPending !== undefined) {
      var scheduling = navigator.scheduling;
      shouldYieldToHost = function () {
        var currentTime = getCurrentTime();
        if (currentTime >= frameDeadline) {
          // There's no time left in the frame. We may want to yield control of
          // the main thread, so the browser can perform high priority tasks. The
          // main ones are painting and user input. If there's a pending paint or
          // a pending input, then we should yield. But if there's neither, then
          // we can yield less often while remaining responsive. We'll eventually
          // yield regardless, since there could be a pending paint that wasn't
          // accompanied by a call to `requestPaint`, or other main thread tasks
          // like network events.
          if (needsPaint || scheduling.isInputPending()) {
            // There is either a pending paint or a pending input.
            return true;
          }
          // There's no pending input. Only yield if we've reached the max
          // frame length.
          return currentTime >= frameDeadline + maxFrameLength;
        } else {
          // There's still time left in the frame.
          return false;
        }
      };

      requestPaint = function () {
        needsPaint = true;
      };
    } else {
      // `isInputPending` is not available. Since we have no way of knowing if
      // there's pending input, always yield at the end of the frame.
      shouldYieldToHost = function () {
        return getCurrentTime() >= frameDeadline;
      };

      // Since we yield every frame regardless, `requestPaint` has no effect.
      requestPaint = function () { };
    }

    forceFrameRate = function (fps) {
      if (fps < 0 || fps > 125) {
        console.error('forceFrameRate takes a positive int between 0 and 125, ' + 'forcing framerates higher than 125 fps is not unsupported');
        return;
      }
      if (fps > 0) {
        frameLength = Math.floor(1000 / fps);
        fpsLocked = true;
      } else {
        // reset the framerate
        frameLength = 33.33;
        fpsLocked = false;
      }
    };

    var performWorkUntilDeadline = function () {
      if (enableMessageLoopImplementation) {
        if (scheduledHostCallback !== null) {
          var currentTime = getCurrentTime();
          // Yield after `frameLength` ms, regardless of where we are in the vsync
          // cycle. This means there's always time remaining at the beginning of
          // the message event.
          frameDeadline = currentTime + frameLength;
          var hasTimeRemaining = true;
          try {
            var hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
            if (!hasMoreWork) {
              isMessageLoopRunning = false;
              scheduledHostCallback = null;
            } else {
              // If there's more work, schedule the next message event at the end
              // of the preceding one.
              port.postMessage(null);
            }
          } catch (error) {
            // If a scheduler task throws, exit the current browser task so the
            // error can be observed.
            port.postMessage(null);
            throw error;
          }
        }
        // Yielding to the browser will give it a chance to paint, so we can
        // reset this.
        needsPaint = false;
      } else {
        if (scheduledHostCallback !== null) {
          var _currentTime = getCurrentTime();
          var _hasTimeRemaining = frameDeadline - _currentTime > 0;
          try {
            var _hasMoreWork = scheduledHostCallback(_hasTimeRemaining, _currentTime);
            if (!_hasMoreWork) {
              scheduledHostCallback = null;
            }
          } catch (error) {
            // If a scheduler task throws, exit the current browser task so the
            // error can be observed, and post a new task as soon as possible
            // so we can continue where we left off.
            port.postMessage(null);
            throw error;
          }
        }
        // Yielding to the browser will give it a chance to paint, so we can
        // reset this.
        needsPaint = false;
      }
    };

    var channel = new MessageChannel();
    var port = channel.port2;
    channel.port1.onmessage = performWorkUntilDeadline;

    var onAnimationFrame = function (rAFTime) {
      if (scheduledHostCallback === null) {
        // No scheduled work. Exit.
        prevRAFTime = -1;
        prevRAFInterval = -1;
        isRAFLoopRunning = false;
        return;
      }

      // Eagerly schedule the next animation callback at the beginning of the
      // frame. If the scheduler queue is not empty at the end of the frame, it
      // will continue flushing inside that callback. If the queue *is* empty,
      // then it will exit immediately. Posting the callback at the start of the
      // frame ensures it's fired within the earliest possible frame. If we
      // waited until the end of the frame to post the callback, we risk the
      // browser skipping a frame and not firing the callback until the frame
      // after that.
      isRAFLoopRunning = true;
      requestAnimationFrame(function (nextRAFTime) {
        _clearTimeout(rAFTimeoutID);
        onAnimationFrame(nextRAFTime);
      });

      // requestAnimationFrame is throttled when the tab is backgrounded. We
      // don't want to stop working entirely. So we'll fallback to a timeout loop.
      // TODO: Need a better heuristic for backgrounded work.
      var onTimeout = function () {
        frameDeadline = getCurrentTime() + frameLength / 2;
        performWorkUntilDeadline();
        rAFTimeoutID = _setTimeout(onTimeout, frameLength * 3);
      };
      rAFTimeoutID = _setTimeout(onTimeout, frameLength * 3);

      if (prevRAFTime !== -1 &&
        // Make sure this rAF time is different from the previous one. This check
        // could fail if two rAFs fire in the same frame.
        rAFTime - prevRAFTime > 0.1) {
        var rAFInterval = rAFTime - prevRAFTime;
        if (!fpsLocked && prevRAFInterval !== -1) {
          // We've observed two consecutive frame intervals. We'll use this to
          // dynamically adjust the frame rate.
          //
          // If one frame goes long, then the next one can be short to catch up.
          // If two frames are short in a row, then that's an indication that we
          // actually have a higher frame rate than what we're currently
          // optimizing. For example, if we're running on 120hz display or 90hz VR
          // display. Take the max of the two in case one of them was an anomaly
          // due to missed frame deadlines.
          if (rAFInterval < frameLength && prevRAFInterval < frameLength) {
            frameLength = rAFInterval < prevRAFInterval ? prevRAFInterval : rAFInterval;
            if (frameLength < 8.33) {
              // Defensive coding. We don't support higher frame rates than 120hz.
              // If the calculated frame length gets lower than 8, it is probably
              // a bug.
              frameLength = 8.33;
            }
          }
        }
        prevRAFInterval = rAFInterval;
      }
      prevRAFTime = rAFTime;
      frameDeadline = rAFTime + frameLength;

      // We use the postMessage trick to defer idle work until after the repaint.
      port.postMessage(null);
    };

    requestHostCallback = function (callback) {
      scheduledHostCallback = callback;
      if (enableMessageLoopImplementation) {
        if (!isMessageLoopRunning) {
          isMessageLoopRunning = true;
          port.postMessage(null);
        }
      } else {
        if (!isRAFLoopRunning) {
          // Start a rAF loop.
          isRAFLoopRunning = true;
          requestAnimationFrame(function (rAFTime) {
            if (requestIdleCallbackBeforeFirstFrame$1) {
              cancelIdleCallback(idleCallbackID);
            }
            if (requestTimerEventBeforeFirstFrame) {
              _clearTimeout(idleTimeoutID);
            }
            onAnimationFrame(rAFTime);
          });

          // If we just missed the last vsync, the next rAF might not happen for
          // another frame. To claim as much idle time as possible, post a
          // callback with `requestIdleCallback`, which should fire if there's
          // idle time left in the frame.
          //
          // This should only be an issue for the first rAF in the loop;
          // subsequent rAFs are scheduled at the beginning of the
          // preceding frame.
          var idleCallbackID = void 0;
          if (requestIdleCallbackBeforeFirstFrame$1) {
            idleCallbackID = requestIdleCallback(function onIdleCallbackBeforeFirstFrame () {
              if (requestTimerEventBeforeFirstFrame) {
                _clearTimeout(idleTimeoutID);
              }
              frameDeadline = getCurrentTime() + frameLength;
              performWorkUntilDeadline();
            });
          }
          // Alternate strategy to address the same problem. Scheduler a timer
          // with no delay. If this fires before the rAF, that likely indicates
          // that there's idle time before the next vsync. This isn't always the
          // case, but we'll be aggressive and assume it is, as a trade off to
          // prevent idle periods.
          var idleTimeoutID = void 0;
          if (requestTimerEventBeforeFirstFrame) {
            idleTimeoutID = _setTimeout(function onTimerEventBeforeFirstFrame () {
              if (requestIdleCallbackBeforeFirstFrame$1) {
                cancelIdleCallback(idleCallbackID);
              }
              frameDeadline = getCurrentTime() + frameLength;
              performWorkUntilDeadline();
            }, 0);
          }
        }
      }
    };

    requestHostTimeout = function (callback, ms) {
      taskTimeoutID = _setTimeout(function () {
        callback(getCurrentTime());
      }, ms);
    };

    cancelHostTimeout = function () {
      _clearTimeout(taskTimeoutID);
      taskTimeoutID = -1;
    };
  }

  /* eslint-disable no-var */

  // TODO: Use symbols?
  var ImmediatePriority = 1;
  var UserBlockingPriority = 2;
  var NormalPriority = 3;
  var LowPriority = 4;
  var IdlePriority = 5;

  // Max 31 bit integer. The max integer size in V8 for 32-bit systems.
  // Math.pow(2, 30) - 1
  // 0b111111111111111111111111111111
  var maxSigned31BitInt = 1073741823;

  // Times out immediately
  var IMMEDIATE_PRIORITY_TIMEOUT = -1;
  // Eventually times out
  var USER_BLOCKING_PRIORITY = 250;
  var NORMAL_PRIORITY_TIMEOUT = 5000;
  var LOW_PRIORITY_TIMEOUT = 10000;
  // Never times out
  var IDLE_PRIORITY = maxSigned31BitInt;

  // Tasks are stored as a circular, doubly linked list.
  var firstTask = null;
  var firstDelayedTask = null;

  // Pausing the scheduler is useful for debugging.
  var isSchedulerPaused = false;

  var currentTask = null;
  var currentPriorityLevel = NormalPriority;

  // This is set while performing work, to prevent re-entrancy.
  var isPerformingWork = false;

  var isHostCallbackScheduled = false;
  var isHostTimeoutScheduled = false;

  function scheduler_flushTaskAtPriority_Immediate (callback, didTimeout) {
    return callback(didTimeout);
  }
  function scheduler_flushTaskAtPriority_UserBlocking (callback, didTimeout) {
    return callback(didTimeout);
  }
  function scheduler_flushTaskAtPriority_Normal (callback, didTimeout) {
    return callback(didTimeout);
  }
  function scheduler_flushTaskAtPriority_Low (callback, didTimeout) {
    return callback(didTimeout);
  }
  function scheduler_flushTaskAtPriority_Idle (callback, didTimeout) {
    return callback(didTimeout);
  }

  function flushTask (task, currentTime) {
    // Remove the task from the list before calling the callback. That way the
    // list is in a consistent state even if the callback throws.
    var next = task.next;
    if (next === task) {
      // This is the only scheduled task. Clear the list.
      firstTask = null;
    } else {
      // Remove the task from its position in the list.
      if (task === firstTask) {
        firstTask = next;
      }
      var previous = task.previous;
      previous.next = next;
      next.previous = previous;
    }
    task.next = task.previous = null;

    // Now it's safe to execute the task.
    var callback = task.callback;
    var previousPriorityLevel = currentPriorityLevel;
    var previousTask = currentTask;
    currentPriorityLevel = task.priorityLevel;
    currentTask = task;
    var continuationCallback;
    try {
      var didUserCallbackTimeout = task.expirationTime <= currentTime;
      // Add an extra function to the callstack. Profiling tools can use this
      // to infer the priority of work that appears higher in the stack.
      switch (currentPriorityLevel) {
        case ImmediatePriority:
          continuationCallback = scheduler_flushTaskAtPriority_Immediate(callback, didUserCallbackTimeout);
          break;
        case UserBlockingPriority:
          continuationCallback = scheduler_flushTaskAtPriority_UserBlocking(callback, didUserCallbackTimeout);
          break;
        case NormalPriority:
          continuationCallback = scheduler_flushTaskAtPriority_Normal(callback, didUserCallbackTimeout);
          break;
        case LowPriority:
          continuationCallback = scheduler_flushTaskAtPriority_Low(callback, didUserCallbackTimeout);
          break;
        case IdlePriority:
          continuationCallback = scheduler_flushTaskAtPriority_Idle(callback, didUserCallbackTimeout);
          break;
      }
    } catch (error) {
      throw error;
    } finally {
      currentPriorityLevel = previousPriorityLevel;
      currentTask = previousTask;
    }

    // A callback may return a continuation. The continuation should be scheduled
    // with the same priority and expiration as the just-finished callback.
    if (typeof continuationCallback === 'function') {
      var expirationTime = task.expirationTime;
      var continuationTask = task;
      continuationTask.callback = continuationCallback;

      // Insert the new callback into the list, sorted by its timeout. This is
      // almost the same as the code in `scheduleCallback`, except the callback
      // is inserted into the list *before* callbacks of equal timeout instead
      // of after.
      if (firstTask === null) {
        // This is the first callback in the list.
        firstTask = continuationTask.next = continuationTask.previous = continuationTask;
      } else {
        var nextAfterContinuation = null;
        var t = firstTask;
        do {
          if (expirationTime <= t.expirationTime) {
            // This task times out at or after the continuation. We will insert
            // the continuation *before* this task.
            nextAfterContinuation = t;
            break;
          }
          t = t.next;
        } while (t !== firstTask);
        if (nextAfterContinuation === null) {
          // No equal or lower priority task was found, which means the new task
          // is the lowest priority task in the list.
          nextAfterContinuation = firstTask;
        } else if (nextAfterContinuation === firstTask) {
          // The new task is the highest priority task in the list.
          firstTask = continuationTask;
        }

        var _previous = nextAfterContinuation.previous;
        _previous.next = nextAfterContinuation.previous = continuationTask;
        continuationTask.next = nextAfterContinuation;
        continuationTask.previous = _previous;
      }
    }
  }

  function advanceTimers (currentTime) {
    // Check for tasks that are no longer delayed and add them to the queue.
    if (firstDelayedTask !== null && firstDelayedTask.startTime <= currentTime) {
      do {
        var task = firstDelayedTask;
        var next = task.next;
        if (task === next) {
          firstDelayedTask = null;
        } else {
          firstDelayedTask = next;
          var previous = task.previous;
          previous.next = next;
          next.previous = previous;
        }
        task.next = task.previous = null;
        insertScheduledTask(task, task.expirationTime);
      } while (firstDelayedTask !== null && firstDelayedTask.startTime <= currentTime);
    }
  }

  function handleTimeout (currentTime) {
    isHostTimeoutScheduled = false;
    advanceTimers(currentTime);

    if (!isHostCallbackScheduled) {
      if (firstTask !== null) {
        isHostCallbackScheduled = true;
        requestHostCallback(flushWork);
      } else if (firstDelayedTask !== null) {
        requestHostTimeout(handleTimeout, firstDelayedTask.startTime - currentTime);
      }
    }
  }

  function flushWork (hasTimeRemaining, initialTime) {
    // Exit right away if we're currently paused
    if (enableSchedulerDebugging && isSchedulerPaused) {
      return;
    }

    // We'll need a host callback the next time work is scheduled.
    isHostCallbackScheduled = false;
    if (isHostTimeoutScheduled) {
      // We scheduled a timeout but it's no longer needed. Cancel it.
      isHostTimeoutScheduled = false;
      cancelHostTimeout();
    }

    var currentTime = initialTime;
    advanceTimers(currentTime);

    isPerformingWork = true;
    try {
      if (!hasTimeRemaining) {
        // Flush all the expired callbacks without yielding.
        // TODO: Split flushWork into two separate functions instead of using
        // a boolean argument?
        while (firstTask !== null && firstTask.expirationTime <= currentTime && !(enableSchedulerDebugging && isSchedulerPaused)) {
          flushTask(firstTask, currentTime);
          currentTime = getCurrentTime();
          advanceTimers(currentTime);
        }
      } else {
        // Keep flushing callbacks until we run out of time in the frame.
        if (firstTask !== null) {
          do {
            flushTask(firstTask, currentTime);
            currentTime = getCurrentTime();
            advanceTimers(currentTime);
          } while (firstTask !== null && !shouldYieldToHost() && !(enableSchedulerDebugging && isSchedulerPaused));
        }
      }
      // Return whether there's additional work
      if (firstTask !== null) {
        return true;
      } else {
        if (firstDelayedTask !== null) {
          requestHostTimeout(handleTimeout, firstDelayedTask.startTime - currentTime);
        }
        return false;
      }
    } finally {
      isPerformingWork = false;
    }
  }

  function unstable_runWithPriority (priorityLevel, eventHandler) {
    switch (priorityLevel) {
      case ImmediatePriority:
      case UserBlockingPriority:
      case NormalPriority:
      case LowPriority:
      case IdlePriority:
        break;
      default:
        priorityLevel = NormalPriority;
    }

    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = priorityLevel;

    try {
      return eventHandler();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  }

  function unstable_next (eventHandler) {
    var priorityLevel;
    switch (currentPriorityLevel) {
      case ImmediatePriority:
      case UserBlockingPriority:
      case NormalPriority:
        // Shift down to normal priority
        priorityLevel = NormalPriority;
        break;
      default:
        // Anything lower than normal priority should remain at the current level.
        priorityLevel = currentPriorityLevel;
        break;
    }

    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = priorityLevel;

    try {
      return eventHandler();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  }

  function unstable_wrapCallback (callback) {
    var parentPriorityLevel = currentPriorityLevel;
    return function () {
      // This is a fork of runWithPriority, inlined for performance.
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = parentPriorityLevel;

      try {
        return callback.apply(this, arguments);
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    };
  }

  function timeoutForPriorityLevel (priorityLevel) {
    switch (priorityLevel) {
      case ImmediatePriority:
        return IMMEDIATE_PRIORITY_TIMEOUT;
      case UserBlockingPriority:
        return USER_BLOCKING_PRIORITY;
      case IdlePriority:
        return IDLE_PRIORITY;
      case LowPriority:
        return LOW_PRIORITY_TIMEOUT;
      case NormalPriority:
      default:
        return NORMAL_PRIORITY_TIMEOUT;
    }
  }

  function unstable_scheduleCallback (priorityLevel, callback, options) {
    var currentTime = getCurrentTime();

    var startTime;
    var timeout;
    if (typeof options === 'object' && options !== null) {
      var delay = options.delay;
      if (typeof delay === 'number' && delay > 0) {
        startTime = currentTime + delay;
      } else {
        startTime = currentTime;
      }
      timeout = typeof options.timeout === 'number' ? options.timeout : timeoutForPriorityLevel(priorityLevel);
    } else {
      timeout = timeoutForPriorityLevel(priorityLevel);
      startTime = currentTime;
    }

    var expirationTime = startTime + timeout;

    var newTask = {
      callback: callback,
      priorityLevel: priorityLevel,
      startTime: startTime,
      expirationTime: expirationTime,
      next: null,
      previous: null
    };

    if (startTime > currentTime) {
      // This is a delayed task.
      insertDelayedTask(newTask, startTime);
      if (firstTask === null && firstDelayedTask === newTask) {
        // All tasks are delayed, and this is the task with the earliest delay.
        if (isHostTimeoutScheduled) {
          // Cancel an existing timeout.
          cancelHostTimeout();
        } else {
          isHostTimeoutScheduled = true;
        }
        // Schedule a timeout.
        requestHostTimeout(handleTimeout, startTime - currentTime);
      }
    } else {
      insertScheduledTask(newTask, expirationTime);
      // Schedule a host callback, if needed. If we're already performing work,
      // wait until the next time we yield.
      if (!isHostCallbackScheduled && !isPerformingWork) {
        isHostCallbackScheduled = true;
        requestHostCallback(flushWork);
      }
    }

    return newTask;
  }

  function insertScheduledTask (newTask, expirationTime) {
    // Insert the new task into the list, ordered first by its timeout, then by
    // insertion. So the new task is inserted after any other task the
    // same timeout
    if (firstTask === null) {
      // This is the first task in the list.
      firstTask = newTask.next = newTask.previous = newTask;
    } else {
      var next = null;
      var task = firstTask;
      do {
        if (expirationTime < task.expirationTime) {
          // The new task times out before this one.
          next = task;
          break;
        }
        task = task.next;
      } while (task !== firstTask);

      if (next === null) {
        // No task with a later timeout was found, which means the new task has
        // the latest timeout in the list.
        next = firstTask;
      } else if (next === firstTask) {
        // The new task has the earliest expiration in the entire list.
        firstTask = newTask;
      }

      var previous = next.previous;
      previous.next = next.previous = newTask;
      newTask.next = next;
      newTask.previous = previous;
    }
  }

  function insertDelayedTask (newTask, startTime) {
    // Insert the new task into the list, ordered by its start time.
    if (firstDelayedTask === null) {
      // This is the first task in the list.
      firstDelayedTask = newTask.next = newTask.previous = newTask;
    } else {
      var next = null;
      var task = firstDelayedTask;
      do {
        if (startTime < task.startTime) {
          // The new task times out before this one.
          next = task;
          break;
        }
        task = task.next;
      } while (task !== firstDelayedTask);

      if (next === null) {
        // No task with a later timeout was found, which means the new task has
        // the latest timeout in the list.
        next = firstDelayedTask;
      } else if (next === firstDelayedTask) {
        // The new task has the earliest expiration in the entire list.
        firstDelayedTask = newTask;
      }

      var previous = next.previous;
      previous.next = next.previous = newTask;
      newTask.next = next;
      newTask.previous = previous;
    }
  }

  function unstable_pauseExecution () {
    isSchedulerPaused = true;
  }

  function unstable_continueExecution () {
    isSchedulerPaused = false;
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  function unstable_getFirstCallbackNode () {
    return firstTask;
  }

  function unstable_cancelCallback (task) {
    var next = task.next;
    if (next === null) {
      // Already cancelled.
      return;
    }

    if (task === next) {
      if (task === firstTask) {
        firstTask = null;
      } else if (task === firstDelayedTask) {
        firstDelayedTask = null;
      }
    } else {
      if (task === firstTask) {
        firstTask = next;
      } else if (task === firstDelayedTask) {
        firstDelayedTask = next;
      }
      var previous = task.previous;
      previous.next = next;
      next.previous = previous;
    }

    task.next = task.previous = null;
  }

  function unstable_getCurrentPriorityLevel () {
    return currentPriorityLevel;
  }

  function unstable_shouldYield () {
    var currentTime = getCurrentTime();
    advanceTimers(currentTime);
    return currentTask !== null && firstTask !== null && firstTask.startTime <= currentTime && firstTask.expirationTime < currentTask.expirationTime || shouldYieldToHost();
  }

  var unstable_requestPaint = requestPaint;



  var Scheduler = Object.freeze({
    unstable_ImmediatePriority: ImmediatePriority,
    unstable_UserBlockingPriority: UserBlockingPriority,
    unstable_NormalPriority: NormalPriority,
    unstable_IdlePriority: IdlePriority,
    unstable_LowPriority: LowPriority,
    unstable_runWithPriority: unstable_runWithPriority,
    unstable_next: unstable_next,
    unstable_scheduleCallback: unstable_scheduleCallback,
    unstable_cancelCallback: unstable_cancelCallback,
    unstable_wrapCallback: unstable_wrapCallback,
    unstable_getCurrentPriorityLevel: unstable_getCurrentPriorityLevel,
    unstable_shouldYield: unstable_shouldYield,
    unstable_requestPaint: unstable_requestPaint,
    unstable_continueExecution: unstable_continueExecution,
    unstable_pauseExecution: unstable_pauseExecution,
    unstable_getFirstCallbackNode: unstable_getFirstCallbackNode,
    get unstable_now () { return getCurrentTime; },
    get unstable_forceFrameRate () { return forceFrameRate; }
  });

  // Helps identify side effects in begin-phase lifecycle hooks and setState reducers:


  // In some cases, StrictMode should also double-render lifecycles.
  // This can be confusing for tests though,
  // And it can be bad for performance in production.
  // This feature flag can be used to control the behavior:


  // To preserve the "Pause on caught exceptions" behavior of the debugger, we
  // replay the begin phase of a failed component inside invokeGuardedCallback.


  // Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:


  // Gather advanced timing metrics for Profiler subtrees.


  // Trace which interactions trigger each commit.
  var enableSchedulerTracing = true;

  // Only used in www builds.
  // TODO: true? Here it might just be false.

  // Only used in www builds.


  // Only used in www builds.


  // Disable javascript: URL strings in href for XSS protection.


  // React Fire: prevent the value and checked attributes from syncing
  // with their related DOM properties


  // These APIs will no longer be "unstable" in the upcoming 16.7 release,
  // Control this behavior with a flag to support 16.6 minor releases in the meanwhile.




  // See https://github.com/react-native-community/discussions-and-proposals/issues/72 for more information
  // This is a flag so we can fix warnings in RN core before turning it on




  // We will enforce mocking scheduler with scheduler/unstable_mock at some point. (v17?)
  // Till then, we warn about the missing mock, but still fallback to a sync mode compatible version

  // Temporary flag to revert the fix in #15650


  // For tests, we flush suspense fallbacks in an act scope;
  // *except* in some of our own tests, where we test incremental loading states.


  // Changes priority of some events like mousemove to user-blocking priority,
  // but without making them discrete. The flag exists in case it causes
  // starvation problems.


  // Add a callback property to suspense to notify which promises are currently
  // in the update queue. This allows reporting and tracing of what is causing
  // the user to see a loading state.


  // Part of the simplification of React.createElement so we can eventually move
  // from React.createElement to React.jsx
  // https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md

  var DEFAULT_THREAD_ID = 0;

  // Counters used to generate unique IDs.
  var interactionIDCounter = 0;
  var threadIDCounter = 0;

  // Set of currently traced interactions.
  // Interactions "stack"–
  // Meaning that newly traced interactions are appended to the previously active set.
  // When an interaction goes out of scope, the previous set (if any) is restored.
  var interactionsRef = null;

  // Listener(s) to notify when interactions begin and end.
  var subscriberRef = null;

  if (enableSchedulerTracing) {
    interactionsRef = {
      current: new Set()
    };
    subscriberRef = {
      current: null
    };
  }

  function unstable_clear (callback) {
    if (!enableSchedulerTracing) {
      return callback();
    }

    var prevInteractions = interactionsRef.current;
    interactionsRef.current = new Set();

    try {
      return callback();
    } finally {
      interactionsRef.current = prevInteractions;
    }
  }

  function unstable_getCurrent () {
    if (!enableSchedulerTracing) {
      return null;
    } else {
      return interactionsRef.current;
    }
  }

  function unstable_getThreadID () {
    return ++threadIDCounter;
  }

  function unstable_trace (name, timestamp, callback) {
    var threadID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_THREAD_ID;

    if (!enableSchedulerTracing) {
      return callback();
    }

    var interaction = {
      __count: 1,
      id: interactionIDCounter++,
      name: name,
      timestamp: timestamp
    };

    var prevInteractions = interactionsRef.current;

    // Traced interactions should stack/accumulate.
    // To do that, clone the current interactions.
    // The previous set will be restored upon completion.
    var interactions = new Set(prevInteractions);
    interactions.add(interaction);
    interactionsRef.current = interactions;

    var subscriber = subscriberRef.current;
    var returnValue = void 0;

    try {
      if (subscriber !== null) {
        subscriber.onInteractionTraced(interaction);
      }
    } finally {
      try {
        if (subscriber !== null) {
          subscriber.onWorkStarted(interactions, threadID);
        }
      } finally {
        try {
          returnValue = callback();
        } finally {
          interactionsRef.current = prevInteractions;

          try {
            if (subscriber !== null) {
              subscriber.onWorkStopped(interactions, threadID);
            }
          } finally {
            interaction.__count--;

            // If no async work was scheduled for this interaction,
            // Notify subscribers that it's completed.
            if (subscriber !== null && interaction.__count === 0) {
              subscriber.onInteractionScheduledWorkCompleted(interaction);
            }
          }
        }
      }
    }

    return returnValue;
  }

  function unstable_wrap (callback) {
    var threadID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_THREAD_ID;

    if (!enableSchedulerTracing) {
      return callback;
    }

    var wrappedInteractions = interactionsRef.current;

    var subscriber = subscriberRef.current;
    if (subscriber !== null) {
      subscriber.onWorkScheduled(wrappedInteractions, threadID);
    }

    // Update the pending async work count for the current interactions.
    // Update after calling subscribers in case of error.
    wrappedInteractions.forEach(function (interaction) {
      interaction.__count++;
    });

    var hasRun = false;

    function wrapped () {
      var prevInteractions = interactionsRef.current;
      interactionsRef.current = wrappedInteractions;

      subscriber = subscriberRef.current;

      try {
        var returnValue = void 0;

        try {
          if (subscriber !== null) {
            subscriber.onWorkStarted(wrappedInteractions, threadID);
          }
        } finally {
          try {
            returnValue = callback.apply(undefined, arguments);
          } finally {
            interactionsRef.current = prevInteractions;

            if (subscriber !== null) {
              subscriber.onWorkStopped(wrappedInteractions, threadID);
            }
          }
        }

        return returnValue;
      } finally {
        if (!hasRun) {
          // We only expect a wrapped function to be executed once,
          // But in the event that it's executed more than once–
          // Only decrement the outstanding interaction counts once.
          hasRun = true;

          // Update pending async counts for all wrapped interactions.
          // If this was the last scheduled async work for any of them,
          // Mark them as completed.
          wrappedInteractions.forEach(function (interaction) {
            interaction.__count--;

            if (subscriber !== null && interaction.__count === 0) {
              subscriber.onInteractionScheduledWorkCompleted(interaction);
            }
          });
        }
      }
    }

    wrapped.cancel = function cancel () {
      subscriber = subscriberRef.current;

      try {
        if (subscriber !== null) {
          subscriber.onWorkCanceled(wrappedInteractions, threadID);
        }
      } finally {
        // Update pending async counts for all wrapped interactions.
        // If this was the last scheduled async work for any of them,
        // Mark them as completed.
        wrappedInteractions.forEach(function (interaction) {
          interaction.__count--;

          if (subscriber && interaction.__count === 0) {
            subscriber.onInteractionScheduledWorkCompleted(interaction);
          }
        });
      }
    };

    return wrapped;
  }

  var subscribers = null;
  if (enableSchedulerTracing) {
    subscribers = new Set();
  }

  function unstable_subscribe (subscriber) {
    if (enableSchedulerTracing) {
      subscribers.add(subscriber);

      if (subscribers.size === 1) {
        subscriberRef.current = {
          onInteractionScheduledWorkCompleted: onInteractionScheduledWorkCompleted,
          onInteractionTraced: onInteractionTraced,
          onWorkCanceled: onWorkCanceled,
          onWorkScheduled: onWorkScheduled,
          onWorkStarted: onWorkStarted,
          onWorkStopped: onWorkStopped
        };
      }
    }
  }

  function unstable_unsubscribe (subscriber) {
    if (enableSchedulerTracing) {
      subscribers.delete(subscriber);

      if (subscribers.size === 0) {
        subscriberRef.current = null;
      }
    }
  }

  function onInteractionTraced (interaction) {
    var didCatchError = false;
    var caughtError = null;

    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onInteractionTraced(interaction);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onInteractionScheduledWorkCompleted (interaction) {
    var didCatchError = false;
    var caughtError = null;

    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onInteractionScheduledWorkCompleted(interaction);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onWorkScheduled (interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;

    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onWorkScheduled(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onWorkStarted (interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;

    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onWorkStarted(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onWorkStopped (interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;

    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onWorkStopped(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onWorkCanceled (interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;

    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onWorkCanceled(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }



  var SchedulerTracing = Object.freeze({
    get __interactionsRef () { return interactionsRef; },
    get __subscriberRef () { return subscriberRef; },
    unstable_clear: unstable_clear,
    unstable_getCurrent: unstable_getCurrent,
    unstable_getThreadID: unstable_getThreadID,
    unstable_trace: unstable_trace,
    unstable_wrap: unstable_wrap,
    unstable_subscribe: unstable_subscribe,
    unstable_unsubscribe: unstable_unsubscribe
  });

  var ReactSharedInternals$2 = {
    ReactCurrentDispatcher: ReactCurrentDispatcher,
    ReactCurrentOwner: ReactCurrentOwner,
    IsSomeRendererActing: IsSomeRendererActing,
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign: objectAssign
  };

  {
    objectAssign(ReactSharedInternals$2, {
      // These should not be included in production.
      ReactDebugCurrentFrame: ReactDebugCurrentFrame,
      // Shim for React DOM 16.0.0 which still destructured (but not used) this.
      // TODO: remove in React 17.0.
      ReactComponentTreeHook: {}
    });
  }

  // Re-export the schedule API(s) for UMD bundles.
  // This avoids introducing a dependency on a new UMD global in a minor update,
  // Since that would be a breaking change (e.g. for all existing CodeSandboxes).
  // This re-export is only required for UMD bundles;
  // CJS bundles use the shared NPM package.
  objectAssign(ReactSharedInternals$2, {
    Scheduler: Scheduler,
    SchedulerTracing: SchedulerTracing
  });

  var hasBadMapPolyfill = void 0;

  {
    hasBadMapPolyfill = false;
    try {
      var frozenObject = Object.freeze({});
      var testMap = new Map([[frozenObject, null]]);
      var testSet = new Set([frozenObject]);
      // This is necessary for Rollup to not consider these unused.
      // https://github.com/rollup/rollup/issues/1771
      // TODO: we can remove these if Rollup fixes the bug.
      testMap.set(0, 0);
      testSet.add(0);
    } catch (e) {
      // TODO: Consider warning about bad polyfills
      hasBadMapPolyfill = true;
    }
  }

  function createFundamentalComponent (impl) {
    // We use responder as a Map key later on. When we have a bad
    // polyfill, then we can't use it as a key as the polyfill tries
    // to add a property to the object.
    if (true && !hasBadMapPolyfill) {
      Object.freeze(impl);
    }
    var fundamantalComponent = {
      $$typeof: REACT_FUNDAMENTAL_TYPE,
      impl: impl
    };
    {
      Object.freeze(fundamantalComponent);
    }
    return fundamantalComponent;
  }

  function createEventResponder (displayName, responderConfig) {
    var getInitialState = responderConfig.getInitialState,
      onEvent = responderConfig.onEvent,
      onMount = responderConfig.onMount,
      onUnmount = responderConfig.onUnmount,
      onOwnershipChange = responderConfig.onOwnershipChange,
      onRootEvent = responderConfig.onRootEvent,
      rootEventTypes = responderConfig.rootEventTypes,
      targetEventTypes = responderConfig.targetEventTypes;

    var eventResponder = {
      $$typeof: REACT_RESPONDER_TYPE,
      displayName: displayName,
      getInitialState: getInitialState || null,
      onEvent: onEvent || null,
      onMount: onMount || null,
      onOwnershipChange: onOwnershipChange || null,
      onRootEvent: onRootEvent || null,
      onUnmount: onUnmount || null,
      rootEventTypes: rootEventTypes || null,
      targetEventTypes: targetEventTypes || null
    };
    // We use responder as a Map key later on. When we have a bad
    // polyfill, then we can't use it as a key as the polyfill tries
    // to add a property to the object.
    if (true && !hasBadMapPolyfill) {
      Object.freeze(eventResponder);
    }
    return eventResponder;
  }

  var React = {
    /**
     * React.Children提供了处理this.props.children的工具，this.props.children可以任何数据（组件、字符串、函数等等）。
     * React.children有5个方法：
     * React.Children.map()、 // React.Children.map() 返回一个数组
     * React.Children.forEach()、 // 循环但是无返回
     * React.Children.count()、 // 返回children的长度，如果children是string的话，会返回string的长度哦
     * React.Children.only()、// 验证children里只有唯一的孩子并返回他。否则这个方法抛出一个错误。
     * React.Children.toArray() // 将children转换成Array，对children排序时需要使用
     * 通常与React.cloneElement()结合使用来操作this.props.children。
     */
    Children: {
      /* React.Children.map() 返回一个数组
        function Father({children}) {
            return(
              <div>
              {React.Children.map(children, (child, index) => {
                  ...
              })}
              </div>    
            )        
        }


        <Father>
            hello world!
            {() => <p>2333</p>}
        </Father>
      */
      map: mapChildren,
      forEach: forEachChildren,
      count: countChildren, // 英[kaʊnt] 总数，计数
      toArray: toArray,
      only: onlyChild // 英[ˈəʊnli] 唯一的
    },

    createRef: createRef,
    Component: Component,
    PureComponent: PureComponent, // 自动进行shouldComponentUpdate的比较，需要注意的是，它是做props.xxx的浅比较的
    createContext: createContext,
    forwardRef: forwardRef,
    createElement: createElementWithValidation,
    cloneElement: cloneElementWithValidation,
    /**
      var factory = React.createFactory("li");
      var li1 = factory(null, 'First');
      var li2 = factory(null, 'Second');  
      var li3 = factory(null, 'Third');  
      var ul = React.createElement('ul', {className: 'list'}, li1, li2, li3);  
      ReactDOM.render(  
          ul,  
          document.getElementById('timeBox')  
      );
     */
    createFactory: createFactoryWithValidation, // Factory [ˈfæktri] 工厂

    /* 配合import()使用，import()方法是用来代替require，实现动态加载；
      动态 import() 语法目前只是一个 ECMAScript (JavaScript) 提案， 而不是正式的语法标准。预计在不远的将来就会被正式接受。
      当 Webpack 解析到该语法时，它会自动地开始进行代码分割。
      当使用 Babel 时，你要确保 Babel 能够解析动态 import 语法而不是将其进行转换，对于这一要求你需要 babel-plugin-syntax-dynamic-import 插件。
      注意：babel-plugin-syntax-dynamic-import 插件的作用是解析识别import()动态导入语法---并非转换，而是解析识别
      const OtherComponent = React.lazy(() => import('./OtherComponent'));

      function MyComponent() {
        return (
          <div>
            <OtherComponent />
          </div>
        );
      }
     */
    lazy: lazy,
    /* 配合React.laze使用
     render() {
      return (
        <div className="App">
          <header className="App-header">
          <Suspense fallback={<div>Loading...</div>}>
            <OtherComponent />
          </Suspense>
          </header>
        </div>
      );
    }
    Suspense 使用的时候，fallback 一定是存在且有内容的， 否则会报错。

    针对网络请求的 loading，我并没觉的这种 fallback 有什么帮助，因为他是组件加载的 loading，
    如果组件加载完了，那么再去 fallback 就没意义，也没效果了。
    */
    Suspense: REACT_SUSPENSE_TYPE,

    memo: memo, // 与PureComponent类似的功能，PureComponent只接受class，而mome支持function

    useCallback: useCallback,
    useContext: useContext,
    useEffect: useEffect,
    useImperativeHandle: useImperativeHandle,
    useDebugValue: useDebugValue,
    useLayoutEffect: useLayoutEffect,
    useMemo: useMemo,
    useReducer: useReducer,
    useRef: useRef,
    useState: useState,

    /**
     * Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点。它就是<>...</>元素
     */
    Fragment: REACT_FRAGMENT_TYPE, // [ˈfræɡmənt] 分段
    /**
     * React 16.5 添加了对新的 profiler DevTools 插件的支持。
     * 这个插件使用 React 的 Profiler 实验性 API 去收集所有 component 的渲染时间，
     * 目的是为了找出你的 React App 的性能瓶颈。它将会和我们即将发布的时间片 特性完全兼容。
     */
    Profiler: REACT_PROFILER_TYPE,
    /** React严格模式，严格模式检查仅在开发模式下运行；它们不会影响生产构建。
     * StrictMode 是一个用来突出显示应用程序中潜在问题的工具。
     * 与 Fragment 一样，StrictMode 不会渲染任何可见的 UI。它为其后代元素触发额外的检查和警告。 
     * StrictMode 目前有助于：
     *  识别不安全的生命周期
     *  关于使用过时字符串 ref API 的警告
     *  关于使用废弃的 findDOMNode 方法的警告
     *  检测意外的副作用
     *  检测过时的 context API
     *  未来的 React 版本将添加更多额外功能。
    */
    StrictMode: REACT_STRICT_MODE_TYPE,



    isValidElement: isValidElement, // 验证是否是 object.$$typeof === REACT_ELEMENT_TYPE

    version: ReactVersion, //  '16.9.0';

    unstable_SuspenseList: REACT_SUSPENSE_LIST_TYPE, // 这个也不知道干什么的，也没有在ReactDOM中搜索到它
    unstable_withSuspenseConfig: withSuspenseConfig, // 不知道它是干什么的，也没有在ReactDOM中搜索到它

    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals$2 // ReactDOM使用
  };

  // Experimental React Flare event system and event components support.
  var enableFlareAPI = false;

  // Experimental Host Component support.
  var enableFundamentalAPI = false;

  // New API for JSX transforms to target - https://github.com/reactjs/rfcs/pull/107
  var enableJSXTransformAPI = false;

  if (enableFlareAPI) {
    React.unstable_useResponder = useResponder;
    React.unstable_createResponder = createEventResponder;
  }

  if (enableFundamentalAPI) {
    React.unstable_createFundamental = createFundamentalComponent;
  }

  if (enableJSXTransformAPI) {
    {
      React.jsxDEV = jsxWithValidation;
      React.jsx = jsxWithValidationDynamic;
      React.jsxs = jsxWithValidationStatic;
    }
  }



  var React$2 = Object.freeze({
    default: React
  });

  var React$3 = (React$2 && React) || React$2;

  // TODO: decide on the top-level export form.
  // This is hacky but makes it work with both Rollup and Jest.
  var react = React$3.default || React$3;

  window.react = react;
  return react;

})));