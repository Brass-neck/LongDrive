import { legacy_createStore } from 'redux'
import reducer from './reducer.ts'
import { composeWithDevTools } from 'redux-devtools-extension'

const store = legacy_createStore(reducer, composeWithDevTools())
export default store
