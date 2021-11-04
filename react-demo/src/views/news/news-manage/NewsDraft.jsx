import React, { useEffect, useState } from 'react'
import { Table, Button, message, Tooltip } from 'antd'
import { DeleteOutlined, EditOutlined, AuditOutlined } from '@ant-design/icons'
import { showConfirm } from '../../../components/common/commonComponents'

export default function NewsDraft(props) {
  const [dataSource, setdataSource] = useState([])

  useEffect(() => {
    getList()
  }, [])

  const { username } = JSON.parse(localStorage.getItem('token'))

  const getList = async () => {
    let res = await window.$g.get(`/news?auditState=0&author=${username}&_expand=category`)
    setdataSource(res)
  }

  const del = async (item) => {
    await window.$g.del(`/news/${item.id}`)
    getList()
  }

  const submitAudit = async (item) => {
    await window.$g.patch(`/news/${item.id}`, {
      auditState: 1
    })
    getList()
    message.success('提交审核成功！')
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text) => <b>{text}</b>
    },
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
              danger
              shape='circle'
              icon={<DeleteOutlined />}
              style={{ marginRight: '5px' }}
              onClick={() => showConfirm(window.$g.MAP.TIP_MAP.CONFIRM_DELETE, () => del(item))}
            />
            <Button
              type='primary'
              shape='circle'
              icon={<EditOutlined />}
              style={{ marginRight: '5px' }}
              onClick={() => {
                props.history.push(`/news-manage/update/${item.id}`)
              }}
            />
            <Tooltip placement='top' title='提交审核'>
              <Button
                onClick={() =>
                  showConfirm(window.$g.MAP.TIP_MAP.CONFIRM_AUDIT, () => submitAudit(item))
                }
                shape='circle'
                icon={<AuditOutlined />}
              />
            </Tooltip>
          </div>
        )
      }
    }
  ]

  return <Table dataSource={dataSource} columns={columns} rowKey='id' />
}
