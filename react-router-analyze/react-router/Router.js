import React from 'react'
import ReactContext from './RouterContext'

class Router extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 来自父级 history库 传过来的props
      location: props.history.location
    }

    // 监听路由变化，变化后重新渲染
    props.history.listen((location) => this.setState({ location }))
  }

  render() {
    let value = {
      history: this.props.history,
      location: this.state.location
    }
    return <ReactContext.Provider value={value}>{this.props.children}</ReactContext.Provider>
  }
}

export default Router
