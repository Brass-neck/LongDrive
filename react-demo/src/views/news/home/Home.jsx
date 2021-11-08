import React, { useState } from 'react'
import { Card, Col, Row, List, Avatar } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { useEffect } from 'react'

const { Meta } = Card

export default function Home() {
  const [viewList, setviewList] = useState([])
  const [starList, setstarList] = useState([])

  const getViewList = async () => {
    let res = await window.$g.get(
      `/news?publishState=2&_expand=category&_sout=view&_order=desc&_limit=6`
    )
    setviewList(res)
  }

  const getStarList = async () => {
    let res = await window.$g.get(
      `/news?publishState=2&_expand=category&_sout=star&_order=desc&_limit=6`
    )
    setstarList(res)
  }

  useEffect(() => {
    getViewList()
    getStarList()
  }, [])

  const {
    username,
    region,
    role: { roleName }
  } = JSON.parse(localStorage.getItem('token'))

  return (
    <div>
      <div className='site-card-wrapper'>
        <Row gutter={16}>
          <Col span={8}>
            <Card title='用户最常浏览' bordered>
              <List
                size='small'
                dataSource={viewList}
                renderItem={(item) => (
                  <List.Item>
                    <a href={`#/detail/${item.id}`}>{item.title}</a>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title='用户点赞最多' bordered>
              <List
                size='small'
                dataSource={starList}
                renderItem={(item) => (
                  <List.Item>
                    <a href={`#/detail/${item.id}`}>{item.title}</a>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              cover={
                <img src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png' />
              }
              actions={[
                <SettingOutlined key='setting' />,
                <EditOutlined key='edit' />,
                <EllipsisOutlined key='ellipsis' />
              ]}
            >
              <Meta
                avatar={<Avatar src='https://joeschmoe.io/api/v1/random' />}
                title={username}
                description={`${region || '全球'} - ${roleName}`}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
