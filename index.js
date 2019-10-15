import dva, { connect } from 'dva';
import createLoading from 'dva-loading'; // dva自动处理loading的插件
import {Router, Route, Switch} from 'dva/router'; // dva里嵌套的react-router

const app = dva();
console.log(app._store); // 顶部的 state 数据

app.use(createLoading());

// 注册 Model
app.model({
  namespace: 'count', // 当前model的名称
  state: {
  	count: 0,
  }, // 当前model的状态
  reducers: { // 处理同步active
    add(state) { return state.count + 1 },
    minus(state) { return state.count - 1 },
  }
});


function Home(props) {
	return <div>
      <div>hello world</div>
      <h2>{ props.count }</h2>
      <button key="add" onClick={() => { props.dispatch({type: 'count/add'})}}>+</button>
      <button key="minus" onClick={() => { props.dispatch({type: 'count/minus'})}}>-</button>
  </div>
}

connect(
  (count) => count
)(Home);

const router = <Router>
      <Switch>
        <Route path="/" exact component={Home} />
      </Switch>
    </Router>
    
app.router(()=> <Home />);

app.start('#root');
