import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Sys from '../pages/sys/Sys'
import Login from '../pages/login/Login'
import UserHome from '../pages/sys/home/UserHome'
import Stock from '../pages/stock/Stock'
import Detail from '../pages/stock/Detail'
//Routes新版写法 component=>element
export default function IndexRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/stockall" element={<Stock />} />
        {/* <Route path="/detail/:id" element={<Detail />} /> */}
        <Route path="/*" element={
          localStorage.getItem("token") ?
            <Sys /> :
            <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  )
}
