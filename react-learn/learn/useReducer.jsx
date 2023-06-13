import React from 'react'

// initData 和 reducer 不会变，所以放在函数组件外面，防止每次渲染都重新创建
const initData = {
  userInfo: {},
  orderList: [],
  loading: false,
  login: false
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        login: true
      }
    case 'loginEnd':
      return {
        ...state,
        loading: false
      }
    case 'setUser':
      return { ...state, userInfo: action.userInfo }
    case 'reset':
      return initData
    default:
      throw new Error('no such action type')
  }
}

export default function useReducerer() {
  const [state, dispatch] = React.useReducer(reducer, initData)

  const onLogin = () => {
    dispatch({ type: 'login' })

    // 模拟登录
    setTimeout(() => {
      dispatch({ type: 'loginEnd' })
    }, 1000)
  }

  return <div>useReducerer</div>
}

/**
 * 当有多个状态需要一起更新时，就应该考虑使用useReducer
 */
