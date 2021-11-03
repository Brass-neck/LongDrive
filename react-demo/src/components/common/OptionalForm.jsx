import React, { useEffect, useState, forwardRef } from 'react'
import { Form } from 'antd'

const OptionalForm = forwardRef((props, container) => {
  let defaultData = {
    items: []
  }

  return (
    <Form {...props} ref={container}>
      {props.data.items.map((item, i) => {
        let rules = []
        if (item.rules?.required) rules.push({ required: true, message: `请完善${item.label}` })
        if (item.rules.other?.length) rules = [...rules, ...item.rules.other]
        return (
          <Form.Item name={item.name} label={item.label} rules={rules} key={i}>
            {item.render}
          </Form.Item>
        )
      })}
    </Form>
  )
})

export default OptionalForm
