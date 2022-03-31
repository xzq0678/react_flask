import axios from 'axios'
import React, { Children, useEffect, useState } from 'react'
import { Button, Table, Tag, Modal, Popover, Tree } from 'antd'

import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';


const { confirm } = Modal;



export default function RoleList() {
  const [dataSource, setdataSource] = useState([])
  const [rightlist, setrightList] = useState([])
  const [currentRights, setcurrentRights] = useState([])
  const [currentID, setcurrentID] = useState(0)

  const [isModalVisible, setisModalVisible] = useState(false)

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />}
            onClick={() => showConfirm(item)} />

          <Button type="primary" shape="circle" icon={<EditOutlined />}
            onClick={() =>{
              setisModalVisible(true)
              setcurrentRights(item.rights)
              setcurrentID(item.id)
            }} />
        </div>
      }
    },
  ]
  useEffect(() => {
    axios.get('/roles').then(res => {
      console.log(res.data)
      setdataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('/menu/list').then(res => {
      // console.log(res.data)
      setrightList(res.data)
    })
  }, [])
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
    const deletMethod = (item) => {

      setdataSource(dataSource.filter(data => data.id !== item.id))
      // console.log(item)
      axios.delete('/roles/' + (item.id)+'/rights')
    }
  };

  const handleOk = () => {
    console.log(currentRights)
    setisModalVisible(false)
    //同步datasource
    setdataSource(dataSource.map(item=>{
      if(item.id===currentID){
        return{
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
    //put回去后端
    axios.put('/roles/'+currentID+'/rights',{params:{rights:currentRights}})
  };
  const handleCancel = () => {
    setisModalVisible(false)
  };
  const onCheck = (checkedKeys) => {
    console.log(checkedKeys)
    setcurrentRights(checkedKeys)
  };
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        rowKey={(item) => item.id}></Table>
      <Modal title="权限分配" visible={isModalVisible}
        onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable = {true}
          checkedKeys={currentRights}
          treeData={rightlist}
          onCheck={onCheck}
          fieldNames={{ children: 'secondmenu' }}
          // checkStrictly={true}

        />
      </Modal>
    </div>
  )
}
