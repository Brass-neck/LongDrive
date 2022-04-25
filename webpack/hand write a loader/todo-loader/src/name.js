// todo
// 这里的todo标识，可以被 todo-loader 检测到
function add() {
  let args = Array.from(arguments)
  let _add = () => {
    args = args.concat(...arguments)
    return _add
  }

  _add.toString = () => {
    let num = args.reduce((prev, curr) => {
      return prev + curr
    }, 0)
    console.log(num)
  }
  // _add.toString =

  return _add
}
console.log(add(1, 2, 3))
// export default name2 = 'zz'
