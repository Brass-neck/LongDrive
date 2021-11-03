import React, { useEffect, useState, useRef } from 'react'
import { Button, Modal, Switch, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { showConfirm } from '../../../components/common/commonComponents'
import UserForm from '../../../components/user-manage/UserForm'

export default function UserList() {
  const [userList, setuserList] = useState([])
  const addFormContainer = useRef(null)
  const [isEdit, setisEdit] = useState(false)
  const [addModalVisible, setaddModalVisible] = useState(false)
  const [isDisableRegion, setisDisableRegion] = useState(false)
  const [currentEdit, setcurrentEdit] = useState(null)
  const [regionList, setregionList] = useState([])

  const { region, roleId, username } = JSON.parse(localStorage.getItem('token'))
  const ROLE_MAP = window.$g.MAP.ROLE_MAP

  const getUserList = async () => {
    let res = await window.$g.get('/users?_expand=role')
    // 超管能看到所有list，区域管理能看同区人员，区域编辑只能看到同区同级人员
    setuserList(
      ROLE_MAP[roleId] === 'superAdmin'
        ? res
        : [
            ...res.filter((u) => u.username === username),
            ...res.filter(
              (u) =>
                u.region === region && ROLE_MAP[u.roleId] === 'editor' && u.username !== username
            )
          ]
    )
  }

  const getRegionList = async () => {
    let res = await window.$g.get('/regions')
    setregionList(res)
  }

  useEffect(() => {
    getRegionList()
    getUserList()
  }, [])

  const del = async (item) => {
    await window.$g.del(`/users/${item.id}`)
    getUserList()
  }

  const onChangeState = (value, id) => {
    window.$g.patch(`/users/${id}`, {
      roleState: value
    })
  }

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => <b>{region === '' ? '全球' : region}</b>,
      filters: [
        { text: '全球', value: '' },
        ...regionList.map((r) => ({ text: r.title, value: r.value }))
      ],
      onFilter: (value, record) => record.region === value
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => role?.roleName
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, record) => (
        <Switch
          defaultChecked={roleState}
          disabled={record.default}
          onChange={(v) => onChangeState(v, record.id)}
        />
      )
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
              disabled={item.default}
              onClick={() => showConfirm(window.$g.MAP.TIP_MAP.CONFIRM_DELETE, () => del(item))}
            />
            <Button
              type='primary'
              shape='circle'
              disabled={item.default}
              icon={<EditOutlined />}
              onClick={() => showAddModal(true, item)}
            />
          </div>
        )
      }
    }
  ]

  const showAddModal = (isEdit, item) => {
    setisEdit(isEdit)
    setaddModalVisible(true)

    if (isEdit) {
      setcurrentEdit(item)
      // 超管 禁用地区
      item.roleId === 1 ? setisDisableRegion(true) : setisDisableRegion(false)

      setTimeout(() => {
        addFormContainer.current.setFieldsValue(item)
      })
    }
  }

  const onCancel = () => {
    setaddModalVisible(false)
    setisDisableRegion(!isDisableRegion)
    // addFormContainer.current.resetFields()
  }

  const saveUser = () => {
    addFormContainer.current.validateFields().then(
      async (res) => {
        if (isEdit) {
          await window.$g.patch(`/users/${currentEdit.id}`, res)
        } else {
          await window.$g.post('/users', res)
        }
        setaddModalVisible(false)
        getUserList()
      },
      (err) => console.log(err)
    )
  }

  return (
    <div>
      <Button
        type='primary'
        onClick={() => showAddModal(false)}
        style={{ marginBottom: '10px' }}
        disabled={ROLE_MAP[roleId] === 'editor'}
      >
        添加用户
      </Button>
      <Table dataSource={userList} columns={columns} rowKey='id' />
      <Modal
        visible={addModalVisible}
        destroyOnClose
        title={isEdit ? '更新用户' : '添加用户'}
        okText='确定'
        cancelText='取消'
        onCancel={onCancel}
        onOk={saveUser}
      >
        <UserForm ref={addFormContainer} isDisableRegion={isDisableRegion}></UserForm>
      </Modal>
    </div>
  )
}
