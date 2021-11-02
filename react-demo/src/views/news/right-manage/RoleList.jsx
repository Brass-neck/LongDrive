import React, { useEffect, useState } from 'react'
import { DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { showConfirm } from '../../../components/News/common/commonComponents'

import { Table, Button, Modal, Tree } from 'antd'
import './index.scss'

export default function RoleList() {
  const [dataSource, setdataSource] = useState([])
  const [authList, setauthList] = useState([])
  const [modelVisible, setmodelVisible] = useState(false)
  const [checkedKeys, setcheckedKeys] = useState([])
  const [currentId, setcurrentId] = useState(0)

  const getList = async () => {
    let res = await window.$g.get('/roles')
    setdataSource(res)
  }

  const getAuthList = async () => {
    let res = await window.$g.get('/rights?_embed=children')
    setauthList(res)
  }

  useEffect(() => {
    getList()
    getAuthList()
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text) => <b>{text}</b>
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
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
              onClick={() => showConfirm(window.$g.WORD_MAP.CONFIRM_DELETE, () => del(item))}
            />
            <Button
              type='primary'
              shape='circle'
              icon={<UnorderedListOutlined />}
              onClick={() => showModal(item)}
            />
          </div>
        )
      }
    }
  ]

  const showModal = (item) => {
    setcheckedKeys(item.rights)
    setcurrentId(item.id)
    setmodelVisible(true)
  }
  const del = async (item) => {
    await window.$g.del(`/roles/${item.id}`)
    getList()
  }

  const onCheck = (checkedKeys, info) => {
    setcheckedKeys(checkedKeys)
  }

  const changeAuth = () => {
    window.$g.patch(`/roles/${currentId}`, {
      rights: checkedKeys
    })
    setmodelVisible(false)
    getList()
  }

  return (
    <div>
      <Table rowKey='id' dataSource={dataSource} columns={columns} />
      <Modal
        title='权限配置'
        visible={modelVisible}
        onCancel={() => setmodelVisible(false)}
        onOk={() => changeAuth()}
        okText='确定'
        cancelText='取消'
        destroyOnClose
      >
        <Tree
          checkable
          // checkStrictly
          defaultExpandedKeys={checkedKeys}
          checkedKeys={checkedKeys}
          onCheck={onCheck}
          treeData={authList}
        />
      </Modal>
    </div>
  )
}
