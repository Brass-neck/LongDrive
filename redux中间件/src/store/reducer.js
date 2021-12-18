let initialState = { num: 0 }

export default function addReducer(state = initialState, action) {
  switch (action.type) {
    case 'add':
      return { num: state.num + 1 }
    default:
      return state
  }
}
