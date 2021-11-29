import React, { useCallback, useRef } from 'react'
import useForm from '../hooks/useForm'

export default function Form() {
  const [formData, setFormValue, resetForm] = useForm({ username: '', email: '' })

  // 使用useCallback 做缓存，有问题，callback中访问form，一直都是最旧的那个form
  const username = useCallback((e) => {
    setFormValue('username', e.target.value)
  }, [])
  const email = useCallback((e) => {
    setFormValue('email', e.target.value)
  }, [])

  return (
    <>
      <form>
        <div className='form-group'>
          <label htmlFor=''>用户名</label>
          <input
            type='text'
            className='form-control'
            value={formData.username}
            onChange={(e) => setFormValue('username', e.target.value)}
            // onChange={username}
          />
        </div>
        <div className='form-group'>
          <label htmlFor=''>邮箱</label>
          <input
            type='text'
            className='form-control'
            value={formData.email}
            onChange={(e) => setFormValue('email', e.target.value)}
            // onChange={email}
          />
        </div>
        <button
          className='btn btn-primary'
          type='submit'
          onClick={(e) => {
            e.preventDefault()
            console.log(formData)
          }}
        >
          提交
        </button>
        <button
          className='btn'
          type='button'
          onClick={(e) => {
            resetForm()
          }}
        >
          重置
        </button>
      </form>
    </>
  )
}
