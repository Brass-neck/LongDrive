type DefaultState = {
  num: number
}

const defaultState: DefaultState = {
  num: 20
}

let reducer = (state = defaultState, action: { type: string, value: number }): any => {
  let newState = JSON.parse(JSON.stringify(state))
  switch (action.type) {
    case 'add1':
      newState.num++
      break
    case 'add2':
      newState.num += action.value
      break
    default:
      break
  }
  return newState
}

export default reducer
