import React, { Component } from 'react'
import RouterContext from './RouterContext'

export default class Route extends Component {
  static contextType = RouterContext

  render() {
    const { history, location } = this.context
    const { component: RouteComponent, path } = this.props

    const isMatch = path === location.pathname

    const routeProps = { history, location }
    let element = null

    if (isMatch) {
      element = <RouteComponent {...routeProps} />
    }

    return element
  }
}
