import React, { useEffect, useState } from 'react'
import { Table, Button, message, notification } from 'antd'
import { showConfirm } from '../../../components/common/commonComponents'

export default function Published(props) {
  const pn = props.location.pathname.split('/')[2]
  const map = {
    unpublished: 1,
    published: 2,
    sunset: 3
  }

  const [dataSource, setdataSource] = useState([])

  useEffect(() => {
    getList()
  }, [])

  const { region, roleId, username } = JSON.parse(localStorage.getItem('token'))
  const ROLE_MAP = window.$g.MAP.ROLE_MAP

  const getList = async () => {
    let url = `/news?publishState=${map[pn]}&author=${username}&_expand=category`
    let res = await window.$g.get(url)
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

  const handlePublish = async (item) => {
    await window.$g.patch(`/news/${item.id}`, {
      publishState: 2,
      publishTime: Date.now()
    })
    getList()
  }

  const handleSunset = async (item) => {
    await window.$g.patch(`/news/${item.id}`, {
      publishState: 3
    })
    getList()
  }

  const del = async (item) => {
    await window.$g.del(`/news/${item.id}`)
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
            {pn === 'unpublished' ? (
              <Button
                type='primary'
                onClick={() =>
                  showConfirm(window.$g.MAP.TIP_MAP.CONFIRM_PUBLISH, () => handlePublish(item))
                }
              >
                发布
              </Button>
            ) : pn === 'published' ? (
              <Button type='primary' onClick={() => handleSunset(item)}>
                下线
              </Button>
            ) : (
              <Button
                type='primary'
                onClick={() => showConfirm(window.$g.MAP.TIP_MAP.CONFIRM_DELETE, () => del(item))}
              >
                删除
              </Button>
            )}
          </div>
        )
      }
    }
  ]

  return <Table dataSource={dataSource} columns={columns} rowKey='id' />
}
