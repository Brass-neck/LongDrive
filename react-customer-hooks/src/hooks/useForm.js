import { useState } from 'react'

export default function useForm(initialState) {
  const [form, setform] = useState(initialState)

  const setFormValue = (key, value) => {
    // console.log(key, value, form)
    setform({
      ...form,
      [key]: value
    })
  }
  const resetForm = () => {
    setform(initialState)
  }

  return [form, setFormValue, resetForm]
}
