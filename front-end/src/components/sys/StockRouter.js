import React, { useEffect, useState } from 'react'
import A from '../../pages/sys/stockd/A'
import UserHome from '../../pages/sys/home/UserHome'
import Nopermission from '../../pages/sys/nopermission/Nopermission'
import AM from '../../pages/sys/stockd/AM'
import Add from '../../pages/sys/stockd/Add'
import Del from '../../pages/sys/stockd/Del'
import HK from '../../pages/sys/stockd/HK'
import RoleList from '../../pages/sys/righ-manage/RoleList';
import UserList from '../../pages/sys/user-manage/UserList';
import RightList from '../../pages/sys/righ-manage/RightList'

import { Routes, Route, Navigate } from "react-router-dom"
import axios from 'axios'
import { Spin } from 'antd'
import { connect } from 'react-redux';

const LocalRouterMap = {
  "/home": <UserHome />,
  "/stock/A": <A />,
  "/stock/HK": <HK />,
  "/stock/AM": <AM />,
  "/stock/add": <Add />,
  "/stock/delete": <Del />,
  "/right-manage/right/list": <RightList />,
  "/right-manage/role/list": <RoleList />,
  "/user-manage/user/list": <UserList />,

}

function StockRouter(props) {
  const [BackRouteList, setBackRouteList] = useState([])
  useEffect(() => {
    Promise.all([
      axios.get("/menu"),
      axios.get("/secondmenu"),
    ]).then(res => {
      // console.log(res[0].data)

      setBackRouteList([...res[0].data, ...res[1].data])

      // console.log(BackRouteList)
    })
  }, [])


const checkRoute = (item) =>{
  return LocalRouterMap[item.key] && item.pagepermission
}
const [roleList, setroleList] = useState([])
const { role_id } = JSON.parse(localStorage.getItem("token"))
useEffect(() => {
  axios.get('/roles/' + role_id + '/rights').then(res => {
    // console.log(res.data)
    setroleList(res.data.key)
  })
}, []
)

const checkUserPermission = (item) =>{
  return roleList.includes(item.key)
}
  return (
    <Spin spinning={props.isLoading}>
    <Routes>
      {
        BackRouteList.map(item => {
          // console.log(item.key)
          if (checkRoute(item) && checkUserPermission(item)) {
            return <Route path={item.key} 
            key={item.key} element={LocalRouterMap[item.key]} exact />

          }
          return null

        }
        )
      }

      <Route path="/" element={<Navigate to="/home" exact />} />
      {
        BackRouteList.length > 0 && <Route path='*' element={<Nopermission />} />
      }

    </Routes>
    </Spin>
  )
}


const mapStateToProps = ({LoadingReducer:{isLoading}})=>{
  return{
    isLoading
  }
}


export default connect(mapStateToProps)(StockRouter)