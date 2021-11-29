import { BrowserRouter, Route, Link, Switch } from 'react-router-dom'
import Table from './pages/Table'
import Drag from './pages/Drag'
import Form from './pages/Form'
import Animation from './pages/Animation'

function App() {
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-12'>
          <BrowserRouter>
            <ul className='nav nav-tabs'>
              <li>
                <Link to='/table'>Table</Link>
                <Link to='/drag'>Drag</Link>
                <Link to='/form'>Form</Link>
                <Link to='/animation'>Animation</Link>
              </li>
            </ul>

            <Switch>
              <Route path='/table' component={Table}></Route>
              <Route path='/drag' component={Drag}></Route>
              <Route path='/form' component={Form}></Route>
              <Route path='/animation' component={Animation}></Route>
            </Switch>
          </BrowserRouter>
        </div>
      </div>
    </div>
  )
}

export default App
