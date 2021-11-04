import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd'
import moment from 'moment'

export default function NewsPreview(props) {
  // {}一级不报错，二级会报错
  const [info, setinfo] = useState(null)

  const {
    match: {
      params: { id }
    }
  } = props

  useEffect(() => {
    getDetail()
  }, [])

  const getDetail = async () => {
    let res = await window.$g.get(`/news/${id}?_expand=category&_expand=role`)
    setinfo(res)
  }

  return (
    <div>
      {info && (
        <div>
          <PageHeader
            onBack={() => props.history.goBack()}
            title={info.title}
            subTitle={info.category.title}
          >
            <Descriptions size='small' column={3}>
              <Descriptions.Item label='创建者'>{info.author}</Descriptions.Item>
              <Descriptions.Item label='创建时间'>
                {moment(info.createTime).format('YYYY-MM-DD')}
              </Descriptions.Item>
              <Descriptions.Item label='发布时间'>
                {info.publishTime ? moment(info.publishTime).format('YYYY-MM-DD') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label='区域'>{info.region}</Descriptions.Item>
              <Descriptions.Item label='审核状态'>
                <span style={{ color: 'red' }}>{window.$g.MAP.AUDIT_STATE[info.auditState]}</span>
              </Descriptions.Item>
              <Descriptions.Item label='发布状态'>
                <span style={{ color: 'red' }}>
                  {window.$g.MAP.PUBLISH_STATE[info.publishState]}
                </span>
              </Descriptions.Item>
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
