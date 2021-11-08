import { CHANGE_LOADING } from '../constant'

export const LoadingReducer = (prevState = { isLoading: false }, action) => {
  let { type, payload } = action

  switch (type) {
    case CHANGE_LOADING:
      let newstate = { ...prevState }
      newstate.isLoading = payload
      return newstate
    default:
      return prevState
  }
}
