import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import { withRouter } from 'react-router-dom'

import { UserOutlined, SettingOutlined, UploadOutlined } from '@ant-design/icons'
import './index.scss'

function SideMenu(props) {
  console.log(props)
  const { Sider } = Layout
  const { SubMenu } = Menu

  // 后端返回的数据没有图标，这里配置一个图标映射表
  const iconList = {
    '/home': <UserOutlined />
  }

  // menuList是后台根据权限返回的
  const [menuList, setmenuList] = useState([])
  useEffect(() => {
    setmenuList([
      {
        key: '/home',
        title: '首页',
        icon: <UserOutlined />,
        children: []
      },
      {
        key: '/user-manage',
        title: '用户管理',
        icon: <UserOutlined />,
        children: [{ key: '/user-manage/list', title: '用户列表', icon: <UserOutlined /> }]
      },
      {
        key: '/right-manage',
        title: '权限管理',
        icon: <UserOutlined />,
        children: [
          { key: '/right-manage/right/list', title: '权限列表', icon: <UserOutlined /> },
          { key: '/right-manage/role/list', title: '角色列表', icon: <UserOutlined /> }
        ]
      }
    ])
  }, [])

  const initMenu = (menuData) => {
    return menuData.map((item) => {
      if (item.children?.length) {
        return (
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {initMenu(item.children)}
          </SubMenu>
        )
      } else {
        return (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            onClick={() => {
              props.history.push(item.key)
            }}
          >
            {item.title}
          </Menu.Item>
        )
      }
    })
  }

  const selectedKey = [props.location.pathname]
  const openKey = ['/' + selectedKey[0].split('/')[1]]
  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className='logo'>新闻发布系统</div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu theme='dark' mode='inline' selectedKeys={selectedKey} defaultOpenKeys={openKey}>
            {initMenu(menuList)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}

export default withRouter(SideMenu)
