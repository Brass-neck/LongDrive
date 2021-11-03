import React, { useState, useEffect, useRef } from 'react'
import { PageHeader, Steps, notification, Button, Select, Input, message } from 'antd'

import style from './news.module.css'
import OptionalForm from '../../../components/common/OptionalForm'
import NewsEditor from '../../../components/news-manage/NewsEditor'

const { Step } = Steps
const { Option } = Select

export default function NewsAdd(props) {
  const [currentStep, setcurrentStep] = useState(0)
  const [categoryList, setcategoryList] = useState([])
  const formContainer = useRef(null)

  // 新闻信息收集
  const [info, setinfo] = useState({ content: '' })

  const getCategoryList = async () => {
    let res = await window.$g.get('/categories')
    setcategoryList(res)
  }

  useEffect(() => {
    getCategoryList()
  }, [])

  const handleNext = () => {
    if (currentStep === 0) {
      formContainer.current.validateFields().then((res) => {
        setinfo({ ...info, ...res })
        setcurrentStep(currentStep + 1)
      })
    }
    if (currentStep === 1) {
      if (info.content === '' || info.content.trim() === '<p></p>') {
        message.error('新闻内容不可为空！')
      } else {
        setcurrentStep(currentStep + 1)
      }
    }
  }

  const data = {
    items: [
      {
        name: 'title',
        label: '新闻标题',
        rules: { required: true },
        render: <Input />
      },
      {
        name: 'categoryId',
        label: '新闻分类',
        rules: { required: true },
        render: (
          <Select>
            {categoryList.map((r) => (
              <Option value={r.id} key={r.id}>
                {r.title}
              </Option>
            ))}
          </Select>
        )
      }
    ]
  }

  const getContentFromEditor = (content) => {
    setinfo({ ...info, content })
  }

  const { region, username, roleId } = JSON.parse(localStorage.getItem('token'))

  const saveNews = async (type) => {
    let auditState = type === 'draft' ? 0 : 1
    let param = {
      ...info,
      region: region === '' ? '全球' : region,
      roleId,
      author: username,
      createTime: Date.now(),
      auditState,
      publishState: 0,
      star: 0,
      view: 0
    }
    await window.$g.post('/news', param)
    props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
    notification.info({
      message: '通知',
      description: `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
      placement: 'bottomRight'
    })
  }

  return (
    <>
      <PageHeader title='撰写新闻' subTitle='Edit news' />
      <div style={{ marginLeft: '30px' }}>
        <Steps current={currentStep} className={style.stepBar}>
          <Step title='基本信息' description='填写新闻标题、新闻分类' />
          <Step title='新闻内容' description='新闻主体内容' />
          <Step title='新闻提交' description='保存草稿或者提交审核' />
        </Steps>

        <div className={currentStep === 0 ? '' : style.active}>
          <OptionalForm data={data} className={style.form} ref={formContainer}></OptionalForm>
        </div>
        <div className={currentStep === 1 ? '' : style.active}>
          <NewsEditor getContent={getContentFromEditor}></NewsEditor>
        </div>

        <div style={{ marginTop: '30px' }}>
          {currentStep < 2 && (
            <Button type='primary' type='primary' onClick={handleNext}>
              下一步
            </Button>
          )}
          {currentStep > 0 && (
            <Button onClick={() => setcurrentStep(currentStep - 1)}>上一步</Button>
          )}
          {currentStep === 2 && (
            <span>
              <Button type='primary' onClick={() => saveNews('draft')}>
                保存草稿
              </Button>
              <Button danger onClick={() => saveNews('audit')}>
                提交审核
              </Button>
            </span>
          )}
        </div>
      </div>
    </>
  )
}
