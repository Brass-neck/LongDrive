import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from '../../views/news/home/Home'
import RightList from '../../views/news/right-manage/RightList'
import RoleList from '../../views/news/right-manage/RoleList'
import UserList from '../../views/news/user-manage/UserList'
import NoPermission from '../../views/noPermission/NoPermission'
import NewsAdd from '../../views/news/news-manage/NewsAdd'
import NewsDraft from '../../views/news/news-manage/NewsDraft'
import NewsCategory from '../../views/news/news-manage/NewsCategory'
import NewsPreview from '../../views/news/news-manage/NewsPreview'
import Audit from '../../views/news/audit-manage/Audit'
import AuditList from '../../views/news/audit-manage/AuditList'
import Unpublished from '../../views/news/publish-manage/Unpublished'
import Published from '../../views/news/publish-manage/Published'
import Sunset from '../../views/news/publish-manage/Sunset'

const localRouterMap = {
  '/home': Home,
  '/user-manage/list': UserList,
  '/right-manage/role/list': RoleList,
  '/right-manage/right/list': RightList,
  '/news-manage/add': NewsAdd,
  '/news-manage/draft': NewsDraft,
  '/news-manage/category': NewsCategory,
  '/news-manage/preview/:id': NewsPreview,
  '/news-manage/update/:id': NewsAdd,
  '/audit-manage/audit': Audit,
  '/audit-manage/list': AuditList,
  '/publish-manage/unpublished': Unpublished,
  '/publish-manage/published': Published,
  '/publish-manage/sunset': Sunset
}

export default function NewsRouter() {
  const [backRouteList, setbackRouteList] = useState([])

  const {
    role: { rights }
  } = JSON.parse(localStorage.getItem('token'))

  useEffect(async () => {
    let res = await Promise.all([window.$g.get('/rights'), window.$g.get('/children')])
    setbackRouteList([...res[0], ...res[1]])
  }, [])

  const checkPermission = (item) => {
    return (
      localRouterMap[item.key] &&
      (item.pagepermisson || item.routepermisson) &&
      rights.includes(item.key)
    )
  }

  return (
    <Switch>
      {backRouteList.map(
        (r) =>
          checkPermission(r) && (
            <Route exact path={r.key} key={r.key} component={localRouterMap[r.key]} />
          )
      )}
      <Redirect from='/' to='/home' exact></Redirect>
      {backRouteList.length > 0 && <Route path='*' component={NoPermission}></Route>}
    </Switch>
  )
}
