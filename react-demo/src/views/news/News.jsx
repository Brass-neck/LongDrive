import React, { useEffect } from 'react'

import { Layout } from 'antd'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import './news.css'

import SideMenu from '../../components/news/SideMenu'
import TopHeader from '../../components/news/TopHeader'
import NewsRouter from '../../components/news/NewsRouter'

export default function News() {
  NProgress.start()
  useEffect(() => {
    NProgress.done()
  })
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
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  )
}
