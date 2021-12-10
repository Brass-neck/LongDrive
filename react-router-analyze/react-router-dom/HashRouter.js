import React, { Component } from 'react'
import Router from '../react-router'
import { createHashHistory } from 'history'

export default class HashRouter extends Component {
  history = createHashHistory()

  render() {
    return <Router history={this.history}>{this.props.children}</Router>
  }
}
