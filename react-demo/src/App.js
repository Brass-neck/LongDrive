import './app.scss'
import IndexRouter from './router/indexRouter'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <IndexRouter></IndexRouter>
      </PersistGate>
    </Provider>
  )
}

export default App
