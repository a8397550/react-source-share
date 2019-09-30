import React from 'react';
import ReactDOM from 'react-dom';
import "@babel/polyfill";

const ThemeContext = React.createContext('light');

class App extends React.Component {
  state = {
    name: 'dark'
  }
  render() {
    // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
    // 无论多深，任何组件都能读取这个值。
    // 在这个例子中，我们将 “dark” 作为当前的值传递下去。
    return (
      <ThemeContext.Provider 
        value={{ value: this.state.name, rename: (name) => {
          this.setState({
            name,
          })
        } 
      }}>
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 中间的组件再也不必指明往下传递 theme 了。
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  constructor(props, context) {
    super(props);
    console.log('props', props, context);
  }
  // 指定 contextType 读取当前的 theme context。
  // React 会往上找到最近的 theme Provider，然后使用它的值。
  // 在这个例子中，当前的 theme 值为 “dark”。
  static contextType = ThemeContext;
  render() {
    console.log(this.context);
    return <div onClick={()=>{ this.context.rename('888'); }}>{this.context.value}</div>;
  }
}
  
  ReactDOM.render(<App />, document.getElementById('root'));