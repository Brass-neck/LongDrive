import { CHANGE_COLLAPSE } from '../constant'

export const CollapseReducer = (
  prevState = {
    isCollapse: false
  },
  action
) => {
  let { type } = action

  switch (type) {
    case CHANGE_COLLAPSE:
      let newState = { ...prevState }
      newState.isCollapse = !newState.isCollapse
      return newState
    default:
      return prevState
  }
}
