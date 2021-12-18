const actions = {
  asyncADD() {
    return { type: 'ASYNC_ADD' }
  },
  thunkADD() {
    return function (dispatch, getState) {
      setTimeout(() => {
        dispatch({ type: 'ASYNC_ADD' })
      }, 1000)
    }
  },
  // redux-promise使用方法一，dispatch一个promise
  promiseADD() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ type: 'ASYNC_ADD' })
      }, 1000)
    })
  },
  // redux-promise使用方法二，dispatch一个对象，但是 payload 是 promise
  promiseADD2() {
    return {
      type: 'ASYNC_ADD',
      payload: new Promise((resolve, reject) => {
        setTimeout(() => {
          let number = Math.random()
          if (number <= 0.5) resolve(1)
          else reject('失败了')
        }, 1000)
      })
    }
  }
}

export default actions
