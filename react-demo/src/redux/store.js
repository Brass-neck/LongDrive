import { createStore, combineReducers } from 'redux'
import { CollapseReducer, LoadingReducer } from './reducers/index'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['LoadingReducer']
}

const reducer = combineReducers({
  CollapseReducer,
  LoadingReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer)
const persistor = persistStore(store)

export { store, persistor }
