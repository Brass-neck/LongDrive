import React, { Component } from 'react'
import Router from '../react-router'
import { createBrowserHistory } from 'history'

export default class BrowserRouter extends Component {
  history = createBrowserHistory()

  render() {
    return <Router history={this.history}>{this.props.children}</Router>
  }
}
