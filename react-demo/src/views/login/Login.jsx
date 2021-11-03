import React from 'react'
import { Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'
import './index.scss'
import OptionalForm from '../../components/common/OptionalForm'

export default function Login(props) {
  const data = {
    items: [
      {
        name: 'username',
        label: '用户名',
        rules: { required: true, other: [] },
        render: <Input size='large' placeholder='username' prefix={<UserOutlined />} />
      },
      {
        name: 'password',
        label: '密码',
        rules: { required: true, other: [] },
        render: (
          <Input.Password
            size='large'
            placeholder='password'
            prefix={<LockOutlined />}
            iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        )
      },
      {
        render: (
          <Button size='large' type='primary' htmlType='submit'>
            登录
          </Button>
        )
      }
    ]
  }

  const onFinish = async (v) => {
    v['roleState'] = true
    let res = await window.$g.get('/users?_expand=role', v)
    if (res.length === 0) {
      message.error('账号或密码有误！')
    } else {
      localStorage.setItem('token', JSON.stringify(res[0]))
      props.history.push('/')
    }
  }

  return (
    <div className='sectionStyle'>
      <div className='loginBox'>
        <p className='title'>全球新闻发布系统</p>
        <OptionalForm data={data} onFinish={onFinish}></OptionalForm>
      </div>
    </div>
  )
}
