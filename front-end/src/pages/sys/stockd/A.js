import React, { useEffect, useState } from 'react';
import { PageHeader, Tabs, Button, Statistic, Descriptions, Dropdown,Menu } from 'antd';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import {
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  LegendComponent,
  BrushComponent,
  DataZoomComponent
} from 'echarts/components';
import { EllipsisOutlined } from '@ant-design/icons';
import { CandlestickChart, LineChart, BarChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { connect } from 'react-redux';

import axios from 'axios';

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  LegendComponent,
  BrushComponent,
  DataZoomComponent,
  CandlestickChart,
  LineChart,
  BarChart,
  CanvasRenderer,
  UniversalTransition
]);

const { TabPane } = Tabs;


const upColor = '#ec0000';
const upBorderColor = '#8A0000';
const downColor = '#00da3c';
const downBorderColor = '#008F28';






function A(props) {
  const [stock, setStock] = useState([])
  const [stockInfo, setstockInfo] = useState([])

  // console.log(stockInfo)
  // console.log(stock)
  // console.log(stock.length)

  const selectMethod = (stockid) => {
    axios.get('/stock/' + stockid).then(res => {
      // console.log(res.data[0]['open','close','low','high'])
      setStock(res.data)})

    axios.get('/stock/' + stockid + '/name').then(res => {
      setstockInfo(res.data)
    })
  };

  useEffect(() => {
    selectMethod(props.searchTarget)
  }, []
  )
  
  const calculateMA = (dayCount, data) => {
    // console.log(data.values)
    let result = [];
    for (let i = 0, len = data.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += +data[i - j][1];
      }
      result.push(+(sum / dayCount).toFixed(3));
    }
    // console.log(result)
    return result;
  }
  const splitData = (rawData) => {
    const categoryData = [];
    const values = [];
    const volumes = [];
    // const info = [];
    for (let i = 0; i < rawData.length; i++) {
      categoryData.push(rawData[i]['date']);
      values.push([rawData[i]['open'], rawData[i]['close'], rawData[i]['low'], rawData[i]['high']]);
      volumes.push([i, rawData[i]['volume'], rawData[i]['open'] > rawData[i]['close'] ? 1 : -1]);
    //   info.push([rawData[i]['open'],rawData[i]['close'],rawData[i]['high'],rawData[i]["low"],rawData[i]["close"] - rawData[i-1]["close"],
    //   rawData[i]["pctChg"],rawData[i]["turn"],rawData[i]["volume"],rawData[i]["amount"],
    //   Info[0]["code"].split(".")[1],Info[0]["industry"],Info[0]["industryClassification"],
    // ])
    }

    return {
      categoryData: categoryData,
      values: values,
      volumes: volumes,
      // Info: info
    };
  }



  const data = splitData(stock)
  // console.log()
  const i = stock.length-1
  let info = []
  stock.length > 0?info = {
    date: stock[i]['date'],
    open: stock[i]['open'],
    close: stock[i]['close'],
    high: stock[i]['high'],
    low: stock[i]["low"],
    ytdclose: stock[i-1]["close"],
    Chg: (stock[i]["close"] - stock[i-1]["close"]).toFixed(6).toString(),
    pctChg: stock[i]["pctChg"],
    turn: stock[i]["turn"],
    volume: stock[i]["volume"],
    amount: stock[i]["amount"],
    name: stockInfo[0]["code_name"],
    code: stockInfo[0]["code"].split(".")[1],
    industry: stockInfo[0]["industry"],
    industryClass: stockInfo[0]["industryClassification"],
  }:
  console.log(info)


  const options = {

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: {
          color: '#000'
        },
        position: function (pos, params, el, elRect, size) {
          const obj = {
            top: 10
          };
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
          return obj;
        }
    },
    legend: {
      data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: 'all'
        }
      ],
      label: {
        backgroundColor: '#777'
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: false
        },
        brush: {
          type: ['lineX', 'clear']
        }
      }
    },
    brush: {
      xAxisIndex: 'all',
      brushLink: 'all',
      outOfBrush: {
        colorAlpha: 0.1
      }
    },
    visualMap: {
      show: false,
      seriesIndex: 5,
      dimension: 2,
      pieces: [
        {
          value: 1,
          color: downColor
        },
        {
          value: -1,
          color: upColor
        }
      ]
    },
    grid: [
      {
        left: '10%',
        right: '8%',
        height: '50%'
      },
      {
        left: '10%',
        right: '8%',
        top: '63%',
        height: '16%'
      }
    ],
    xAxis: [
      {
        type: 'category',
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          z: 100
        }
      },
      {
        type: 'category',
        gridIndex: 1,
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: 'dataMin',
        max: 'dataMax'
      }
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true
        }
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false }
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 70,
        end: 100
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: 'slider',
        top: '85%',
        start: 70,
        end: 100
      }
    ],
    series: [
      {
        name: '日K',
        type: 'candlestick',
        data: data.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: upColor,
          borderColor0: downColor
        },
        markPoint: {
          label: {
            formatter: function (param) {
              return param != null ? Math.round(param.value) + '' : '';
            }
          },
          // data: [
          //   {
          //     name: 'Mark',
          //     coord: ['2013/5/31', 2300],
          //     value: 2300,
          //     itemStyle: {
          //       color: 'rgb(41,60,85)'
          //     }
          //   },
          //   {
          //     name: 'highest value',
          //     type: 'max',
          //     valueDim: 'highest'
          //   },
          //   {
          //     name: 'lowest value',
          //     type: 'min',
          //     valueDim: 'lowest'
          //   },
          //   {
          //     name: 'average value on close',
          //     type: 'average',
          //     valueDim: 'close'
          //   }
          // ],
          tooltip: {
            formatter: function (param) {
              return param.name + '<br>' + (param.data.coord || '');
            }
          }
        },
        markLine: {
          symbol: ['none', 'none'],
          data: [
            [
              {
                name: 'from lowest to highest',
                type: 'min',
                valueDim: 'lowest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: false
                  }
                }
              },
              {
                type: 'max',
                valueDim: 'highest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: false
                  }
                }
              }
            ],
            {
              name: 'min line on close',
              type: 'min',
              valueDim: 'close',
            },
            {
              name: 'max line on close',
              type: 'max',
              valueDim: 'close'
            }
          ]
        }
      },
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(5, data.values),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA10',
        type: 'line',
        data: calculateMA(10, data.values),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA20',
        type: 'line',
        data: calculateMA(20, data.values),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA30',
        type: 'line',
        data: calculateMA(30, data.values),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'Volume',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data.volumes
      }]
  };


  const renderContent = (column = 4) => (
    <Descriptions size="small" column={column}>
      <Descriptions.Item label="今开" contentStyle={{color: "red"}}>{info.open}</Descriptions.Item>
      <Descriptions.Item label="最高" contentStyle={{color: "red"}}>{info.high}
      </Descriptions.Item>
      <Descriptions.Item label="涨跌幅" contentStyle={{color: "red"}}>{info.pctChg}
      </Descriptions.Item>
      <Descriptions.Item label="换手" contentStyle={{color: "red"}}>{info.turn}
      </Descriptions.Item>
      <Descriptions.Item label="昨收">{info.ytdclose}</Descriptions.Item>
      <Descriptions.Item label="最低" contentStyle={{color: "green"}}>{info.low}</Descriptions.Item>
      <Descriptions.Item label="涨跌额" contentStyle={{color: "red"}}>{info.Chg}</Descriptions.Item>

    </Descriptions>
  );
  
  const extraContent = (
    <div
      style={{
        display: 'flex',
        width: 'max-content',
        justifyContent: 'flex-end',
      }}
    >
      <Statistic
        title="实时"
        value={info.high}
        style={{
          marginRight: 32,
        }}
      />
    </div>
  );
  
  const Content = ({ children, extra }) => (
    <div className="content">
      <div className="main">{children}</div>
      <div className="extra">{extra}</div>
    </div>
  );

  const DropdownMenu = () => (
    <Dropdown key="more" overlay={menu}>
      <Button
        style={{
          border: 'none',
          padding: 0,
        }}
      >
        <EllipsisOutlined
          style={{
            fontSize: 20,
            verticalAlign: 'top',
          }}
        />
      </Button>
    </Dropdown>
  );

  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank">
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank">
          2nd menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank">
          3rd menu item
        </a>
      </Menu.Item>
    </Menu>
  );
  return (
    <><PageHeader
    className="site-page-header-responsive"
    onBack={() => window.history.back()}
    title={info.name}
    subTitle={"代码："+info.code+' 时间：'+info.date}
    extra={[
      <Button key="2">Sell</Button>,
      <Button key="1" type="primary">
        Buy
      </Button>,<DropdownMenu key="more" />
    ]}
    footer={
      <Tabs defaultActiveKey="1">
        <TabPane tab="K线图" key="1" />
        <TabPane tab="分析" key="2" />
      </Tabs>
    }
  >
    <Content extra={extraContent}>{renderContent()}</Content>
  </PageHeader>
      <ReactECharts
        option={options}
        style={{ height: 400 }}
      />
      {/* <div>
      <Button onClick={()=>{
      selectMethod('sh600000')
    }}>CLICK</Button>
      </div> */}
    </>
  );
};

const mapStateToProps = ({ SearchReducer: { searchTarget } }) => {
  return {
    searchTarget
  }
}

export default connect(mapStateToProps)(A)