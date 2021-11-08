import React, { useState } from 'react'
import { useEffect } from 'react'
import { PageHeader, Row, Col, Card, List } from 'antd'
import './index.scss'

export default function News() {
  const [listdata, setlistdata] = useState([])

  const getList = async () => {
    let res = await window.$g.get(`/news?publishState=2&_expand=category`)
    res = Object.entries(window.$g.utils.groupBy(res, 'category.title'))
    setlistdata(res)
  }

  useEffect(() => {
    getList()
  }, [])

  return (
    <div>
      <PageHeader title='全球新闻' subTitle='global news' />
      <Row gutter={[16, 16]}>
        {listdata.length &&
          listdata.map((item, i) => (
            <Col span={8} key={item[0]}>
              <Card hoverable title={item[0]} key={item[0]} extra={<a href='#'>More</a>}>
                <List
                  key={item[0]}
                  size='small'
                  pagination={{ pageSize: 3 }}
                  dataSource={item[1]}
                  renderItem={(news) => (
                    <List.Item>
                      <a href={`#/detail/${news.id}`}>{news.title}</a>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  )
}
