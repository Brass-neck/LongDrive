import React from 'react'

export default class About extends React.Component {
  state = { number: 0 }
  handleClick = () => {
    this.setState({ number: this.state.number + 1 })
    console.log(this.state)
    this.setState({ number: this.state.number + 1222 })
    console.log(this.state)

    setTimeout(() => {
      this.setState({ number: this.state.number + 1 })
      console.log(this.state)
      this.setState({ number: this.state.number + 22 })
      console.log(this.state)
    })
  }

  render() {
    console.log('render', this.state)

    return <button onClick={this.handleClick}>pppppp</button>
  }
}
