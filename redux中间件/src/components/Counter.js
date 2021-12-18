import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../store/actions'

class Counter extends Component {
  render() {
    // 从参数中 解构出 actions
    const { asyncADD } = this.props

    return (
      <div>
        <p>{this.props.num}</p>
        <button onClick={asyncADD}>async add</button>
      </div>
    )
  }
}

// store 的 state 和 actions 作为参数传入组件
export default connect((state) => state, actions)(Counter)
