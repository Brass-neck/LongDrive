import React from 'react'
import { mount } from 'enzyme'

import Button from '..'

describe('测试Button组件', () => {
  it('测试Button是否正确挂载', () => {
    // 挂载过程不抛出错误
    expect(() => mount(<Button>button</Button>)).not.toThrow()
  })
})
