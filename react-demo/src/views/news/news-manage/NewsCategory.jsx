import React, { useContext, useEffect, useState, useRef } from 'react'
import { Button, Input, Table, Form } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { showConfirm } from '../../../components/common/commonComponents'

export default function NewsCategory() {
  const [dataSource, setdataSource] = useState([])

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    let res = await window.$g.get(`/categories`)
    setdataSource(res)
  }

  const del = async (item) => {
    await window.$g.del(`/categories/${item.id}`)
    getList()
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text) => <b>{text}</b>
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave: async (row) => {
          await window.$g.patch(`/categories/${record.id}`, {
            value: row.title,
            title: row.title
          })
          getList()
        }
      })
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <Button
            danger
            shape='circle'
            icon={<DeleteOutlined />}
            onClick={() => showConfirm(window.$g.MAP.TIP_MAP.CONFIRM_DELETE, () => del(item))}
          />
        )
      }
    }
  ]

  /***************可编辑表格配置*********************/

  const EditableContext = React.createContext(null)

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    )
  }

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef(null)
    const form = useContext(EditableContext)
    useEffect(() => {
      if (editing) {
        inputRef.current.focus()
      }
    }, [editing])

    const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({
        [dataIndex]: record[dataIndex]
      })
    }

    const save = async () => {
      try {
        const values = await form.validateFields()
        toggleEdit()
        handleSave({ ...record, ...values })
      } catch (errInfo) {
        console.log('Save failed:', errInfo)
      }
    }

    let childNode = children

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`
            }
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className='editable-cell-value-wrap'
          style={{
            paddingRight: 24
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      )
    }

    return <td {...restProps}>{childNode}</td>
  }

  return (
    <Table
      components={{ body: { row: EditableRow, cell: EditableCell } }}
      dataSource={dataSource}
      columns={columns}
      rowKey='id'
    />
  )
}
