import React, { useEffect, useState, useRef } from 'react'
import { PageHeader, Descriptions, message } from 'antd'
import moment from 'moment'
import { HeartTwoTone } from '@ant-design/icons'

export default function Detail(props) {
  const [info, setinfo] = useState(null)
  const view = useRef(0)

  const {
    match: {
      params: { id }
    }
  } = props

  const handleStar = async () => {
    await window.$g.patch(`/news/${id}`, {
      star: info.star + 1
    })
    message.success('点赞成功！')
  }

  const updateViewNum = async () => {
    await window.$g.patch(`/news/${id}`, {
      view: view.current + 1
    })
  }

  const getDetail = async () => {
    let res = await window.$g.get(`/news/${id}?_expand=category&_expand=role`)
    view.current = res.view
    setinfo(res)

    // const promise = new Promise((resolve, reject) => {
    //   let res = window.$g.get(`/news/${id}?_expand=category&_expand=role`)
    //   resolve(res)
    // })

    // promise
    //   .then((res) => {
    //     setinfo(res)
    //     return res
    //   })
    //   .then((res) => {
    //     updateViewNum(res)
    //   })
  }

  useEffect(async () => {
    await getDetail()
    updateViewNum()
  }, [])

  return (
    <div>
      {info && (
        <div>
          <PageHeader
            onBack={() => props.history.goBack()}
            title={info.title}
            subTitle={
              <div>
                {info.category.title}
                <HeartTwoTone
                  twoToneColor='#eb2f96'
                  style={{ marginLeft: '5px' }}
                  onClick={() => handleStar()}
                />
              </div>
            }
          >
            <Descriptions size='small' column={3}>
              <Descriptions.Item label='创建者'>{info.author}</Descriptions.Item>
              <Descriptions.Item label='发布时间'>
                {info.publishTime ? moment(info.publishTime).format('YYYY-MM-DD') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label='区域'>{info.region}</Descriptions.Item>
              <Descriptions.Item label='访问数量'>
                <span style={{ color: 'green' }}>{info.view}</span>
              </Descriptions.Item>
              <Descriptions.Item label='点赞数量'>
                <span style={{ color: 'green' }}>{info.star}</span>
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <div
            dangerouslySetInnerHTML={{ __html: info.content }}
            style={{ marginLeft: '24px' }}
          ></div>
        </div>
      )}
    </div>
  )
}
