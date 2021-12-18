import React from 'react'
import ReactDOM from 'react-dom'
import Counter from './components/Counter'
import { Provider } from 'react-redux'
import store from './store'

// connect-react-router 路由组件
import { ConnectedRouter } from 'connected-react-router'
import historty from './history'

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Counter />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
