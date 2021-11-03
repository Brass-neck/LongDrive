import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { Layout, Menu } from 'antd'

import './news.css'

import SideMenu from '../../components/news/SideMenu'
import TopHeader from '../../components/news/TopHeader'
import Home from './home/Home'
import UserList from './user-manage/UserList'
import RoleList from './right-manage/RoleList'
import RightList from './right-manage/RightList'
import NoPermission from '../noPermission/NoPermission'

export default function News() {
  const { Content } = Layout
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className='site-layout'>
        <TopHeader></TopHeader>

        <Content
          className='site-layout-background'
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <Switch>
            <Route path='/home' component={Home}></Route>
            <Route path='/user-manage/list' component={UserList}></Route>
            <Route path='/right-manage/role/list' component={RoleList}></Route>
            <Route path='/right-manage/right/list' component={RightList}></Route>
            <Redirect from='/' to='/home' exact></Redirect>
            <Route path='*' component={NoPermission}></Route>
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}
