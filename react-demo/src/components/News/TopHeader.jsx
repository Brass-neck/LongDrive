import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Dropdown, Menu, Avatar } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons'

const { Header } = Layout

const TopHeader = (props) => {
  const [collapse, setcollapse] = useState(false)

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
      {collapse ? (
        <MenuUnfoldOutlined onClick={() => setcollapse(false)} />
      ) : (
        <MenuFoldOutlined onClick={() => setcollapse(true)} />
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

export default withRouter(TopHeader)
