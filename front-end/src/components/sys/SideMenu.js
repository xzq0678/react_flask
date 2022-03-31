import React, { useEffect, useState } from 'react';
import { Divider, Layout, Menu } from 'antd';
import './index.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';

import {
  StockOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;


// //模拟数组结构
// const menuList = [
//   {
//     key: "/home",
//     title: "首页",
//     icon: <UserOutlined />
//   },
//   {
//     key: "/stock",
//     title: "我的股票",
//     icon: <UserOutlined />,
//     secondmenu: [
//       {
//         key: "/stock/info",
//         title: "具体股票A",
//         icon: <UserOutlined />
//       },
//       {
//         key: "/mystock/B",
//         title: "具体股票B",
//         icon: <UserOutlined />
//       }
//     ]
//   }
// ]

// 图标表
const iconList = {
  "/home": <UserOutlined />,
  "/stock": <StockOutlined />,

}




function SideMenu(props) {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([])
  useEffect(() => {
    axios.get('/menu/list').then(res => {
      // console.log(res.data)
      setMenu(res.data)
    })
  }, []
  )
  const [roleList, setroleList] = useState([])
  const { role_id } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get('/roles/' + role_id + '/rights').then(res => {
      // console.log(res.data)
      setroleList(res.data.key)
    })
  }, []
  )

  const checkPagePermission = (item) => {
    return item.pagepermission && roleList.includes(item.key)
  }


  const renderMenu = (menuList) => {

    return menuList.map(item => {
      // console.log(item.secondmenu)
      // console.log(item.secondmenu.length)

      if (item.secondmenu !== undefined && item.secondmenu.length > 0 && checkPagePermission(item)) {
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {renderMenu(item.secondmenu)}
        </SubMenu>
      }

      return checkPagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
        // console.log(props)
        navigate(item.key, { replace: true })
      }}>
        {item.title}
      </Menu.Item>

    })
  }

  const selectKeys = useLocation().pathname;
  const openKeys = ["/" + selectKeys.split("/")[1]];

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ dispaly: "flex", height: "100%", flex_Direction: "column" }}>
        {/* 替换顶部图标 */}
        <div className="logo">app<StockOutlined style={{ color: 'white' }} /></div>

        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu theme="dark" mode="inline" selectedKeys={selectKeys} className="sidebar" defaultOpenKeys={openKeys}
          >
            {/* <Menu.Item key="1" icon={<UserOutlined />}>
              首页
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              股票详情
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              nav 3
            </Menu.Item>
            <SubMenu key="sub2" icon={<UploadOutlined />} title="Navigation Two">
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
            </SubMenu> */}



            {renderMenu(menu)}
          </Menu>
        </div>

      </div>

    </Sider>
  )
}

const mapStateToProps = ({CollapsedReducer:{isCollapsed}})=>{
  return{
    isCollapsed
  }
}

// const mapDispatchToProps = {
//   changeCollapsed(){
//     return {
//       type:"change_collapsed"
//     }
//   }
// }

export default connect(mapStateToProps)(SideMenu)
