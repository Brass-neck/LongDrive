# 描述

本项目研究 dva

dva 是一个基于 redux 和 redux-saga 的数据流方案，为了简化开发，内置了 react-router、fetch 等

dva = React-Router + Redux + Redux-saga

# 使用

```jsx
// 安装
npm install dva --save

// 引入
import dva ,{connect} from 'dva'
const app = dva()

// 定义一个 model
app.model({
  namespace: 'counter',
  state: {
    number: 0
  },
  reducers: {
    add(state, action){
      // 这里的 state 是 该 model 的 分状态
      return {number: state.number + 1}
    }
  },
  effects: {
    *addAfter1Second(action, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: 'add' });
    },
  }
})

// 连接组件
function Counter(props) {
  return (
    <div>
      <p>{props.number}</p>
      // dispatch(命名空间/reducer名)
      <button onClick={()=> dispatch({type: 'counter/add'})}>+</button>
    </div>
  )
}

const ConnectedCounter = connect(
  state => state.counter  // state是总state，通过命名空间counter返回分状态
)(Counter)

// 注册视图
app.router(() => <ConnectedCounter />);

// 启动应用
app.start('#root');
```

### model

每个 dva 应用会包含许多个 model，每个 model 有自己的 **命名空间 namespace**、**状态 state**、**同步动作处理器 reducers**、**异步动作处理器 effects**
