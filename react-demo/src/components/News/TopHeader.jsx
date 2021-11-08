import React from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Dropdown, Menu, Avatar } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { CHANGE_COLLAPSE } from '../../redux/constant'

const { Header } = Layout

const TopHeader = (props) => {
  const {
    username,
    role: { roleName }
  } = JSON.parse(localStorage.getItem('token'))

  const logOut = () => {
    localStorage.removeItem('token')
    props.history.replace('/login')
  }

  const menu = (
    <Menu>
      <Menu.Item>{roleName}</Menu.Item>
      <Menu.Item danger onClick={() => logOut()}>
        退出
      </Menu.Item>
    </Menu>
  )

  return (
    <Header className='site-layout-background' style={{ padding: '0 16px' }}>
      {props.isCollapse ? (
        <MenuUnfoldOutlined onClick={() => props.changeCollapse()} />
      ) : (
        <MenuFoldOutlined onClick={() => props.changeCollapse()} />
      )}
      面包屑导航
      <div style={{ float: 'right' }}>
        <span style={{ marginRight: '10px' }}>
          欢迎 <b>{username}</b> 回来
        </span>
        <Dropdown overlay={menu} style={{ float: 'right' }}>
          <Avatar size='large' icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = (state) => {
  return {
    isCollapse: state.CollapseReducer.isCollapse
  }
}

const mapDispatchToProps = {
  changeCollapse() {
    return {
      type: CHANGE_COLLAPSE
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))
