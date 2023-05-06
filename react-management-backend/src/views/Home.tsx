export default (Comp) => (props) => {
  const isLogin = checkLogin()
  if (isLogin) {
    return <Comp {...props} />
  }
  return <Redirect to={{ pathname: 'login' }} />
}
