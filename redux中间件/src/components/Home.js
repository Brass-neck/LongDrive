import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../store/actions/home'

class Home extends Component {
  render() {
    // 从 actions 中解构出 actions 的各种方法
    const { goto } = this.props

    return (
      <div>
        <h1>首页</h1>
        <button onClick={() => goto('/counter')}></button>
      </div>
    )
  }
}

// 把 actions 通过 connect 传入到该组件的 props 中
export default connect((state) => state, actions)(Home)
