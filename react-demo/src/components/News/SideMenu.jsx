import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import './index.scss'

const { Sider } = Layout
const { SubMenu } = Menu

function SideMenu(props) {
  const [menuList, setmenuList] = useState([])

  useEffect(async () => {
    let res = await window.$g.get('/rights?_embed=children')
    setmenuList(res)
  }, [])

  const checkPermission = (item) => {
    // 1. 校验 权限列表 pagepermission是否开启
    // 2. 校验 用户权限 是否包含该item
    const {
      role: { rights }
    } = JSON.parse(localStorage.getItem('token'))
    return item.pagepermisson && rights.includes(item.key)
  }

  const initMenu = (menuData) => {
    return menuData.map((item) => {
      if (checkPermission(item))
        if (item.children?.length) {
          return (
            <SubMenu key={item.key} title={item.title}>
              {initMenu(item.children)}
            </SubMenu>
          )
        } else {
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
    <Sider trigger={null} collapsible collapsed={props.isCollapse}>
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

const mapStateToProps = (state) => {
  return {
    isCollapse: state.CollapseReducer.isCollapse
  }
}
export default connect(mapStateToProps)(withRouter(SideMenu))
