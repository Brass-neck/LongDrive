import React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Login from '../views/login/Login'
import News from '../views/news/News'
import VisitorNews from '../views/visitorNews/News'
import Detail from '../views/visitorNews/Detail'

export default function indexRouter() {
  return (
    <HashRouter>
      <Switch>
        <Route path='/login' component={Login}></Route>
        <Route path='/news' component={VisitorNews}></Route>
        <Route path='/detail/:id' component={Detail}></Route>
        {/* <Route path='/' component={News}></Route> */}
        <Route
          path='/'
          render={() => (localStorage.getItem('token') ? <News></News> : <Redirect to='/login' />)}
        ></Route>
      </Switch>
    </HashRouter>
  )
}
