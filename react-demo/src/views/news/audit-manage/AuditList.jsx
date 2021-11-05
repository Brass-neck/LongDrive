import React, { useEffect, useState } from 'react'
import { Table, Button, message, Tag, notification } from 'antd'
import { showConfirm } from '../../../components/common/commonComponents'

export default function AuditList(props) {
  const [dataSource, setdataSource] = useState([])

  useEffect(() => {
    getList()
  }, [])

  const { username } = JSON.parse(localStorage.getItem('token'))

  const getList = async () => {
    // publishState=0未发布、1待发布 ，auditState=1、2、3，作者是自己
    let res = await window.$g.get(
      `/news?auditState_ne=0&publishState_lte=1&author=${username}&_expand=category`
    )
    setdataSource(res)
  }

  const handleCancel = async (item) => {
    await window.$g.patch(`/news/${item.id}`, {
      auditState: 0
    })
    getList()
    notification.info({
      message: '通知',
      description: `已撤销，您可以到草稿箱中查看您的新闻`,
      placement: 'bottomRight'
    })
  }
  const handlePublish = async (item) => {
    await window.$g.patch(`/news/${item.id}`, {
      publishState: 2,
      publishTime: Date.now()
    })
    getList()
    message.success('恭喜您，新闻发布成功！')
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (s) => (
        <Tag color={s == 1 ? 'orange' : s == 2 ? 'green' : 'red'}>
          {window.$g.MAP.AUDIT_STATE[s]}
        </Tag>
      )
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            {item.auditState == 1 ? (
              <Button
                danger
                onClick={() =>
                  showConfirm(window.$g.MAP.TIP_MAP.CONFIRM_CANCEL, () => handleCancel(item))
                }
              >
                撤销
              </Button>
            ) : item.auditState == 2 ? (
              <Button
                type='primary'
                onClick={() =>
                  showConfirm(window.$g.MAP.TIP_MAP.CONFIRM_PUBLISH, () => handlePublish(item))
                }
              >
                发布
              </Button>
            ) : (
              <Button
                type='primary'
                onClick={() => props.history.push(`/news-manage/update/${item.id}`)}
              >
                修改
              </Button>
            )}
          </div>
        )
      }
    }
  ]

  return <Table dataSource={dataSource} columns={columns} rowKey='id' />
}
