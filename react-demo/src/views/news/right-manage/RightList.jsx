import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { showConfirm } from '../../../components/common/commonComponents'

const { confirm } = Modal

export default function RightList() {
  const [dataSource, setdataSource] = useState([])

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    let res = await window.$g.get('/rights?_embed=children')
    res.forEach((e) => e.children.length === 0 && (e.children = ''))
    setdataSource(res)
  }

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
            <Popover
              content={
                <div style={{ textAlign: 'center' }}>
                  <Switch
                    checked={item.pagepermisson}
                    onChange={(value) => changeAuth(value, item)}
                  />
                </div>
              }
              title='配置权限'
              trigger={item.pagepermisson == undefined ? '' : 'click'}
            >
              <Button
                type='primary'
                shape='circle'
                icon={<EditOutlined />}
                disabled={item.pagepermisson == undefined}
              />
            </Popover>
          </div>
        )
      }
    }
  ]

  const changeAuth = (value, item) => {
    window.$g.patch(`/rights/${item.id}`, {
      pagepermisson: value ? 1 : 0
    })
    getList()
  }
  const del = async (item) => {
    await window.$g.del(`/rights/${item.id}`)
    getList()
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  )
}
