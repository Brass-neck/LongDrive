import { createStore } from 'redux'
import { createSelector } from 'reselect'

let initialState = {
  count: { number: 0 },
  todos: [
    { text: '未完成', complete: false },
    { text: '已完成', complete: true }
  ],
  filter: false
}

const reducer = (prevState = initialState, action) => {
  switch (action.type) {
    case 'ADD':
      return { ...prevState, count: { number: prevState.count.number + 1 } }
    default:
      return prevState
  }
}

let store = createStore(reducer)

// 定义selector
const todosSelector = (state) => state.todos
const filterSelector = (state) => state.filter

/** 参数一：依赖数组，参数二：计算函数，根据依赖计算需要的结果 */
const computedSelector = createSelector([todosSelector, filterSelector], (todos, filter) => {
  console.log('重新计算selector')
  return todos.filter((todo) => todo.complete == filter)
})

//
const render = () => {
  let state = store.getState()
  console.log('state', state)

  let cs = computedSelector(state)
  console.log('computedSelector', cs)
}

// 订阅并触发
store.subscribe(render)
store.dispatch({ type: 'ADD' })
store.dispatch({ type: 'ADD' })
store.dispatch({ type: 'ADD' })
store.dispatch({ type: 'ADD' })

/**
 * 虽然多次dispatch，但是 '重新计算selector' 只走了一次，因为reselect做了缓存
 * 只有依赖的selector变化，才会重新计算selector
 */
