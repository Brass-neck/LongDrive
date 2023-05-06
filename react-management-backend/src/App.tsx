import { useState, useEffect } from 'react'
import { Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { Link, Route, Routes } from 'react-router-dom'
import About from './views/About'

import store from '@/store'

type RootState = ReturnType<typeof store.getState>

function App() {
  const [count, setCount] = useState(0)

  const dispatch = useDispatch()

  const { num } = useSelector((state: RootState) => ({
    num: state.num
  }))

  return (
    <div className='App'>
      <Button onClick={() => dispatch({ type: 'add1' })}>Default Button</Button>
      <Button onClick={() => dispatch({ type: 'add2', value: 3 })}>Default Button2</Button>
      <div>{num}</div>
      <Link to='/about'>about</Link>
      <Routes>
        <Route path='/about' element={<About />} />
      </Routes>
    </div>
  )
}

export default App
