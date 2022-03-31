import React, { useEffect, useState } from 'react'
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd'
import axios from 'axios'

import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    UploadOutlined,
} from '@ant-design/icons';

const { confirm } = Modal;

export default function UserList() {
    const [dataSource, setdataSource] = useState([])

    useEffect(() => {
        axios.get('/users').then(res => {
            // const list = res.data
            setdataSource(res.data)
        })
    }, [])

    // 页面列表规范
    const columns = [
        // {
        //   title: 'ID',
        //   dataIndex: 'id',
        //   render:(id)=>{
        //     return <b>{id}</b>
        //   }
        // },
        {
            title: '角色名称',
            dataIndex: 'role_id',
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                // console.log(item)
                return <Switch checked={roleState} disabled={item.default} onChange={()=>handleChange(item)}></Switch>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} disabled={item.default} />

                    <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} />
                </div>
            }
        },
    ];

    // 删除功能
    const showConfirm = (item) => {
        confirm({
            title: '是否确定删除？',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            onOk() {
                return deletMethod(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    // const headers = 'application/json'
    const deletMethod = () => {


    };

    const handleChange = (item) => {
        // console.log(item)
        item.roleState = !item.roleState
        setdataSource([...dataSource])
        // axios.post()
    }
    // 页面列表
    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }}
                rowKey={item => item.id}
            />;

        </div>
    )
}
