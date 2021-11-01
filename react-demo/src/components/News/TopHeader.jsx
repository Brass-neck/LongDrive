import React, { useState } from 'react'

import { Layout, Dropdown, Menu, Avatar } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons'

const { Header } = Layout
export default function TopHeader() {
  const [collapse, setcollapse] = useState(false)

  const menu = (
    <Menu>
      <Menu.Item>2222</Menu.Item>
      <Menu.Item danger>退出</Menu.Item>
    </Menu>
  )

  return (
    <Header className='site-layout-background' style={{ padding: '0 16px' }}>
      {collapse ? (
        <MenuUnfoldOutlined onClick={() => setcollapse(false)} />
      ) : (
        <MenuFoldOutlined onClick={() => setcollapse(true)} />
      )}
      <div style={{ float: 'right' }}>
        <span style={{ marginRight: '10px' }}>欢迎admin回来</span>
        <Dropdown overlay={menu} style={{ float: 'right' }}>
          <Avatar size='large' icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
