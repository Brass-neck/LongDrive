import React, { useEffect, useState } from 'react'
import { Table, Button, message, notification } from 'antd'

import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

export default function Audit(props) {
  const [dataSource, setdataSource] = useState([])

  useEffect(() => {
    getList()
  }, [])

  const { region, roleId, username } = JSON.parse(localStorage.getItem('token'))
  const ROLE_MAP = window.$g.MAP.ROLE_MAP

  const getList = async () => {
    let res = await window.$g.get(`/news?auditState=1&_expand=category`)
    setdataSource(
      ROLE_MAP[roleId] === 'superAdmin'
        ? res
        : [
            ...res.filter((u) => u.author === username),
            ...res.filter(
              (u) => u.region === region && ROLE_MAP[u.roleId] === 'editor' && u.author !== username
            )
          ]
    )
  }

  const handleAudit = async (item, auditState, publishState) => {
    await window.$g.patch(`/news/${item.id}`, {
      auditState,
      publishState
    })
    getList()
  }

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (c) => c.title
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button
              type='primary'
              icon={<CheckOutlined />}
              shape='circle'
              style={{ marginRight: '5px' }}
              onClick={() =>
                handleAudit(
                  item,
                  window.$g.MAP.AUDIT_STATE['审核通过'],
                  window.$g.MAP.PUBLISH_STATE['待发布']
                )
              }
            />
            <Button
              danger
              type='primary'
              shape='circle'
              icon={<CloseOutlined />}
              onClick={() =>
                handleAudit(
                  item,
                  window.$g.MAP.AUDIT_STATE['审核失败'],
                  window.$g.MAP.PUBLISH_STATE['未发布']
                )
              }
            />
          </div>
        )
      }
    }
  ]

  return <Table dataSource={dataSource} columns={columns} rowKey='id' />
}
