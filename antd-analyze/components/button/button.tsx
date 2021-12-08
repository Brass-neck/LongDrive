import React, { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

// React.FC<属性> 函数组件类型
const Button: React.FC<ButtonProps> = (props) => {
  const children = { props }
  return <button type='button'>{children}</button>
}

export default Button

// 显示声明导出的是一个 type，会在编译阶段去掉，优化性能
export type { ButtonProps }
