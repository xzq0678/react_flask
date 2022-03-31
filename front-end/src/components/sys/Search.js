import { Select } from 'antd';
import jsonp from 'fetch-jsonp';

import qs from 'qs';
import axios from 'axios';
import React, {useState} from 'react'

const { Option } = Select;

let timeout;
let currentValue;

function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;
//   const [stockInfo, setstockInfo] = useState([])
  function fake() {
    axios.get('/stock/'+value+'/name')
    .then(res => 
        setstockInfo(res.data))
    .then(stockInfo => {
        console.log(stockInfo)

      if (currentValue === value) {
        // console.log(data)
        const data_list = [];
        stockInfo.forEach(r => {
            data_list.push({
            value: r[0],
            text: r[0],
          });
        });
        callback(data_list);
      }
    });
}

  timeout = setTimeout(fake, 300);
}

class SearchInput extends React.Component {
  state = {
    data: [],
    value: undefined,
  };

  handleSearch = value => {
    if (value) {
      fetch(value, data => this.setState({ data }));
    } else {
      this.setState({ data: [] });
    }
  };

  handleChange = value => {
    this.setState({ value });
  };

  render() {
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
    return (
      <Select
        showSearch
        value={this.state.value}
        placeholder={this.props.placeholder}
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={null}
      >
        {options}
      </Select>
    );
  }
}

export default SearchInput