import React, { useState } from 'react'
import { Layout, Menu, Dropdown, Avatar, Input, Select } from 'antd';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { store } from "../../redux/store"

// import './TopHeader.css';

const { Header } = Layout;

function TopHeader(props) {
  // const [ collapsed, setCollapsed ] = useState(false)
  const navigate = useNavigate();
  const { username } = JSON.parse(localStorage.getItem("token"))
  const changeCollapsed = () => {

    props.changeCollapsed()
  }
  const [inputValue, setinputValue] = useState([])
  const getInputValue = (event) => {
    // console.log(event.target.value)
    setinputValue(event.target.value);
    axios.get('/stock/' + event.target.value + '/name').then(res => {
      console.log(res.data)

    })
  };


 
  const getSearch = (stockid) => {
    store.dispatch({
      type: "search_stockinfo",
      payload: stockid
  })
  window.location.pathname !== '/stock/A'?
  navigate('/stock/A') : setTimeout(()=>{window.location.reload()},500)

      


    //   // console.log(stock)
    }



  const menu = (
    <Menu>
      <Menu.Item>
        用户信息
      </Menu.Item>
      <Menu.Item>
        设置
      </Menu.Item>
      <Menu.Item danger onClick={() => {
        localStorage.removeItem("token")
        navigate('/login')
      }
      }>退出</Menu.Item>
    </Menu>
  );


  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      <div className='Header'>
      {
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> :
          <MenuFoldOutlined onClick={changeCollapsed} />
      }

        {/* <SearchInput placeholder="input search text" style={{ width: 200 }} /> */}

      {/* <Button
          type="primary"
          icon="搜索"
          size="large"
          onClick={()=>{getSearch(inputValue)}}
        >
        </Button> */}
      {/* <div className='Search'> */}
      
        <Input.Search
        style={{ width: '30%', height: '50px', marginLeft:'10px', marginTop: '15px'}}
        placeholder="搜索股票"
        onChange={event => getInputValue(event)}
        allowClear
        size="large"
        enterButton={true}
        onSearch={()=>{getSearch(inputValue)}}
        ></Input.Search>
        <div className='Welcom' style={{ float: "right" }}>
        <span style={{ marginRight: '10px' }}>
          欢迎，<span style={{ color: "#1890ff" }}>{username}</span>
        </span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
      </div>
    </Header>
  )
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed"
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)