import React, { useState } from 'react'
import { Table, Tag, Button } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

export default function RightList() {
  const [dataSource, setdataSource] = useState([
    {
      id: '001',
      title: '胡彦斌',
      key: '/home'
    },
    {
      id: '002',
      title: '胡彦祖',
      key: '/user'
    }
  ])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text) => <b>{text}</b>
    },
    {
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (text) => <Tag color='volcano'>{text}</Tag>
    },
    {
      title: '操作',
      render: () => {
        return (
          <div>
            <Button
              danger
              shape='circle'
              icon={<DeleteOutlined />}
              style={{ marginRight: '5px' }}
            />
            <Button type='primary' shape='circle' icon={<EditOutlined />} />
          </div>
        )
      }
    }
  ]
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  )
}
