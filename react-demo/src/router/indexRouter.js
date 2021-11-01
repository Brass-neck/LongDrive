import React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Login from '../views/login/Login'
import News from '../views/news/News'

export default function indexRouter() {
  return (
    <HashRouter>
      <Switch>
        <Route path='/login' component={Login}></Route>
        {/* <Route path='/' component={News}></Route> */}
        <Route
          path='/'
          render={() => (localStorage.getItem('token') ? <News></News> : <Redirect to='/login' />)}
        ></Route>
      </Switch>
    </HashRouter>
  )
}
