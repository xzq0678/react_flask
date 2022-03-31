import React, { useEffect } from 'react'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

//css
import './Sys.css'

//antd
import { Layout } from 'antd';
import SideMenu from '../../components/sys/SideMenu'
import TopHeader from '../../components/sys/TopHeader'
import StockRouter from '../../components/sys/StockRouter';

const { Content } = Layout;



export default function Sys() {
  Nprogress.start()
  useEffect(()=>{
    Nprogress.done()
  })
  return (
    <Layout>
      <SideMenu></SideMenu>

      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          <StockRouter></StockRouter>
        </Content>
      </Layout>


    </Layout>
  )
}
