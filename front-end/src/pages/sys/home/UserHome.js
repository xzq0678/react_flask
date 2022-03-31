import React, { useState } from 'react'
import { Card, Col, Row, Table } from 'antd'
import PlotLine from '../../../components/sys/PlotLine';

const onChange = e => {
  console.log(e);
};

export default function UserHome() {
  const columns = [
    {
      title: '代码',
      dataIndex: 'code',
      filters: [
        {
          text: 'A股',
          value: '股',
        },
        {
          text: '美股',
          value: '美股',
        },
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend'],
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '最新价',
      dataIndex: 'value',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.value - b.value,

    },
    {
      title: '涨跌幅',
      dataIndex: 'Chg',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.Chg - b.Chg,

    },
  ];
  
  const data = [
    {
      key: '1',
      code:600000,
      name: '浦发银行',
      value: 12.62,
      Chg: 0.0398,
    },
    {
      key: '2',
      code:600007,
      name: '中国国贸',
      value: 17.23,
      Chg: 0.058378,
    },
  ];
  
  
  const tabListNoTitle = [
    {
      key: '指数A',
      tab: '指数A',
    },
    {
      key: '指数B',
      tab: '指数B',
    },
    {
      key: '指数C',
      tab: '指数C',
    },
  ];
  
  const contentListNoTitle = {
    // article: <p>article content</p>,
    // app: <p>app content</p>,
    // project: <p>project content</p>,
  };
  

  const [activeTabKey2, setActiveTabKey2] = useState('app');
  
  const onTab2Change = key => {
      setActiveTabKey2(key);
  }
  return (
    <div>
      <div className="site-card-wrapper">
        <Row gutter={[20, 16]} span={18}>
          <Col span={8}>
          <Card title = "全景图"
        tabList={tabListNoTitle}
        activeTabKey={activeTabKey2}
        tabBarExtraContent={<a href="#">More</a>}
        onTabChange={key => {
          onTab2Change(key);
        }}
      >
        <PlotLine stockid="sh000001"></PlotLine>
        {contentListNoTitle[activeTabKey2]}
      </Card>

            <Card title="自选股" bordered={true}>
            <Row gutter={[8, 8]} span={4}>
            <Col span={4}>
            <Table columns={columns} dataSource={data} onChange={onChange} size={'small'}tableLayout={'auto'}/>

            </Col>

            </Row>
            </Card>

          </Col>
          <Col span={8}>
            <Card title="涨幅股" bordered={true}>
            <p>xxxx 股票A</p>
            <p>xxxx 股票B</p>
            <p>xxxx 股票C</p>
            <p>xxxx 股票D</p>
            <p>xxxx 股票E</p>

            </Card>
          </Col>
          <Col span={8}>
            <Card title="新闻栏" bordered={true}>
              <a>新闻A</a>
            </Card>


          </Col>
        </Row>
      </div>,
    </div>
  )
}
