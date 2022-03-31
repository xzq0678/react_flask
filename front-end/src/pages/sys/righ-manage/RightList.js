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
// axios.defaults.headers['Content-Type'] = 'application/json';

export default function RightList() {
    const [dataSource, setdataSource] = useState([])

    useEffect(() => {
        axios.get('/menu/list').then(res => {
            const list = res.data
            list.forEach(item => {
                if (item.secondmenu !== undefined && item.secondmenu.length === 0) {
                    item.secondmenu = ''
                }
            })
            setdataSource(list)
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
            title: '权限名称',
            dataIndex: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} />

                    <Popover content={<div style={{ textAlign: "center" }}>
                        <Switch checked={item.pagepermission} onChange={() =>
                            switchMethod(item)
                        }></Switch>
                    </div>

                    } title="权限配置" trigger={item.pagepermission == undefined?  '' : 'click'}>
                        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermission == undefined} />
                    </Popover>
                </div>
            }
        },
    ];

    // 页面权限
    const switchMethod = (item) => {
        item.pagepermission = !item.pagepermission

        setdataSource([...dataSource])
        console.log(item.id)
        axios.put('/menu/list', {params:{
                id: item.id,
                pagepermission: item.pagepermission,
                grade: item.grade}
            
            // axios.patch('/menu', {params:{
            //     id: item.id,
            //     pagepermission: item.pagepermission,
            //     grade: item.grade}
        })
        // if (item.grade===1){

        // }else{
        //     axios.patch('/secmenu/'+(item.id), {
        //         id:(item.id),
        //         pagepermission: item.pagepermission            })
        // }
    }
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
    const deletMethod = (item) => {
        if (item.grade == 1) {
            setdataSource(dataSource.filter(data => data.id !== item.id))
            // console.log(item)
            axios.delete('/menu/' + (item.id)).then((res) => {
                console.log(res)
            })
        } else {
            let list = dataSource.filter(data => data.id === item.menu_id)
            console.log(list)

            list[0].secondmenu = list[0].secondmenu.filter(data => data.id !== item.id)

            setdataSource([...dataSource])
            axios.delete('/secmenu/' + (item.id)).then((res) => {
                console.log(res)
            })
        }


    };
    // 页面列表
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} childrenColumnName={"secondmenu"}
                pagination={{
                    pageSize: 5
                }}
            />;

        </div>
    )
}
