import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import { withRouter } from 'react-router-dom'

import './index.scss'

const { Sider } = Layout
const { SubMenu } = Menu

function SideMenu(props) {
  const [menuList, setmenuList] = useState([])

  useEffect(async () => {
    let res = await window.$g.get('/rights?_embed=children')
    setmenuList(res)
  }, [])

  const initMenu = (menuData) => {
    return menuData.map((item) => {
      if (item.children?.length) {
        return (
          <SubMenu key={item.key} title={item.title}>
            {initMenu(item.children)}
          </SubMenu>
        )
      } else {
        if (item.pagepermisson === 1)
          return (
            <Menu.Item
              key={item.key}
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
