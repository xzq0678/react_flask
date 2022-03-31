import React from 'react';
import { Form, Input, Button, Checkbox, message, Space } from 'antd';
import './Login.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// import Particles from 'react-particles-js';
export default function Login() {
  const navigate = useNavigate();

  const onFinish = (values) => {
    // console.log('Success:', values);
    axios.get('/users/username='+values.username+"&password="+values.password).then(
      res=>{
        console.log(res.data)
        if(!res.data.roleState){
          message.error("用户名或密码错误")
        }else{
          localStorage.setItem("token",JSON.stringify(res.data));
          navigate('/',{replace: true});
        }
      }
    )
  };

  const onFinishFailed = () => {
    // console.log('Failed:', errorInfo);
    message.error("用户名或密码错误")
  };
  return (
    // style={{background:'rgb(35,39,65',height:'100%'}}
    <div style={{height:'100%', overflow:'hidden'}}>
      {/* <Particles height={document.documentElement.clientHeight}/> */}
      <div className="formContainter">
        <div className='logintitle' >
          请登录
        </div>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space size='large'>
            <Button type="primary" htmlType="submit">
              Log in
            </Button>
            <Button type="default">
              Register
            </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>

  )
}
