import React from 'react'
import ReactDOM from 'react-dom'
// import 'bootstrap'
import { HashRouter, Route, Link } from 'react-router-dom'
import { dynamicRoute } from './utils'
import './redux'

const LazyHome = dynamicRoute(() => import(/*webpackPrefetch: true*/ './pages/Home'))
const LazyUser = dynamicRoute(() => import(/*webpackPrefetch: true*/ './pages/User'))

ReactDOM.render(
  <HashRouter>
    <ul className='nav'>
      <li>
        <Link to='/'>Home</Link>
        <Link to='/user'>User</Link>
      </li>
    </ul>
    <Route exact path='/' component={LazyHome} />
    <Route path='/user' component={LazyUser} />
  </HashRouter>,
  document.getElementById('root')
)
