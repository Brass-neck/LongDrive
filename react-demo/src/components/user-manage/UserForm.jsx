import React, { useEffect, useState, forwardRef } from 'react'
import { Select, Form, Input } from 'antd'
import OptionalForm from '../common/OptionalForm'

const { Option } = Select

const UserForm = forwardRef((props, addFormRef) => {
  const [regionList, setregionList] = useState([])
  const [roleList, setroleList] = useState([])
  const [disableRegion, setdisableRegion] = useState(false)

  // 地区禁用的变化依赖于父组件的参数
  useEffect(() => {
    setdisableRegion(props.isDisableRegion)
  }, [props.isDisableRegion])

  const getRoleList = async () => {
    let res = await window.$g.get('/roles')
    setroleList(res)
  }

  const getRegionList = async () => {
    let res = await window.$g.get('/regions')
    setregionList(res)
  }

  useEffect(() => {
    getRoleList()
    getRegionList()
  }, [])

  const roleOnChange = (v) => {
    if (v === 1) {
      setdisableRegion(true)
      addFormRef.current.setFieldsValue({
        region: ''
      })
    } else {
      setdisableRegion(false)
    }
  }

  const data = {
    items: [
      {
        name: 'username',
        label: '用户名',
        rules: { required: true, other: [] },
        render: <Input />
      },
      { name: 'password', label: '密码', rules: { required: true, other: [] }, render: <Input /> },
      {
        name: 'region',
        label: '区域',
        rules: disableRegion ? {} : { required: true },
        render: (
          <Select defaultValue='' disabled={disableRegion}>
            {regionList.map((r) => (
              <Option value={r.value} key={r.id}>
                {r.title}
              </Option>
            ))}
          </Select>
        )
      },
      {
        name: 'roleId',
        label: '角色',
        rules: { required: true },
        render: (
          <Select defaultValue='' onChange={(v) => roleOnChange(v)}>
            {roleList.map((r) => (
              <Option value={r.id} key={r.id}>
                {r.roleName}
              </Option>
            ))}
          </Select>
        )
      }
    ]
  }

  return <OptionalForm data={data} layout='vertical' ref={addFormRef}></OptionalForm>
})

export default UserForm
