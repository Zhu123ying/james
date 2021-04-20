/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  Search,
  Panel,
  confirmForm,
  AlertBox,
  Button,
  Loading,
  Tooltip,
  DatePicker,
  Input,
  Select,
  CheckBoxes,
  Icon
} from 'ultraui'
import { Row, Col, Cascader } from 'antd'
import {
  DelQueryString,
  deleteEmptyKey,
  formatParamsUrl,
  formatUrlParams
} from '../utils'

import './index.less'
import _ from 'lodash'

const RangePicker = DatePicker.RangePicker

const ADVANCED_SEARCH_TYPE = {
  TIME_RANGE: 'TIME_RANGE',
  TIME: 'TIME',
  CASCADE: 'CASCADE',
  TEXT: 'TEXT',
  SELECT: 'SELECT'
}

const location = window.location
const history = window.history

const AdvancedSearch = props => {
  const { collapsed, onSubmit, advancedSearchOptions } = props
  const [searchOptions, setSearchOptions] = useState(advancedSearchOptions)
  const [searchParams, setSearchParams] = useState({})

  const checkUrl = callback => {
    const params = formatUrlParams(location.search)
    if (_.isEmpty(params)) {
      setSearchParams({})
      return
    }
    let searchParams = {}
    const target = searchOptions.map(item => {
      if (!item.props) {
        item.props = {}
      }
      if (!_.isEmpty(params[item.key])) {
        item.props.value = params[item.key]
      }
      searchParams[item.key] = item.props.value
      return item
    })
    // 根据url上参数和用户传进来的props 初始化searchoption
    setSearchOptions(target)
    // 根据searchoption初始化searchParams参数
    setSearchParams(searchParams)
    callback && callback(searchParams)
  }

  const computeOffset = length => {
    if (length % 4 === 0) {
      return 18
    }
    if (length % 4 === length) {
      return (4 - length - 1) * 6
    }
    return (4 - (length % 4) - 1) * 6
  }

  const handleChange = (key, value, opt) => {
    let target = _.cloneDeep(searchParams)
    target[key] = value
    setSearchParams(target)
  }

  const handleSubmit = () => {
    onSubmit(deleteEmptyKey(searchParams))
    const params = formatUrlParams(location.search)
    const url = `${location.pathname}${formatParamsUrl({
      ...params,
      ...deleteEmptyKey(searchParams)
    })}`
    history.replaceState('', '', url)
  }

  const handleReset = () => {
    let search = location.search
    for (const key in searchParams) {
      if (Array.isArray(searchParams[key])) {
        search = DelQueryString(search, `${key}__in`)
      } else {
        search = DelQueryString(search, key)
      }
    }
    history.replaceState('', '', `${location.pathname}${search}`)
    setSearchParams({})
    onSubmit({})
  }

  useEffect(() => {
    checkUrl(params => onSubmit(deleteEmptyKey(params)))
  }, [])

  useEffect(() => {
    checkUrl()
  }, [collapsed])

  const renderAdvancedSearchItem = item => {
    const { type, props, key } = item

    // 输入框
    if (type === ADVANCED_SEARCH_TYPE.TEXT) {
      return (
        <Input
          onChange={v => handleChange(key, v.target.value)}
          {...props}
          value={searchParams[key] || ''}
        />
      )
    }

    // 单日期
    if (type === ADVANCED_SEARCH_TYPE.TIME) {
      return (
        <DatePicker
          onChange={v => handleChange(key, v)}
          {...props}
          value={searchParams[key]}
        />
      )
    }

    // 日期范围
    if (type === ADVANCED_SEARCH_TYPE.TIME_RANGE) {
      return (
        <RangePicker
          icon="date"
          popupStyle={{ top: '10px' }}
          showTime
          showOk
          onChange={v => handleChange(key, v)}
          showClear={false}
          showDateInput={false}
          {...props}
          value={searchParams[key]?.map(item => {
            if (!item._isAMomentObject) {
              item = moment(item)
            }
            return item
          })}
        />
      )
    }
    if (type === ADVANCED_SEARCH_TYPE.SELECT) {
      return (
        <Select
          optionLabelProp="children"
          optionFilterProp="children"
          onChange={v => handleChange(key, v)}
          dropdownMenuStyle={{ maxHeight: '200px', overflow: 'auto' }}
          {...props}
          value={searchParams[key]}
        >
          {!_.isEmpty(props.options) &&
            props.options.map(({ key, name, value, title }) => {
              return (
                <Select.Option key={key} name={name} value={value}>
                  {title || name || value}
                </Select.Option>
              )
            })}
        </Select>
      )
    }
    if (type === ADVANCED_SEARCH_TYPE.CASCADE) {
      return (
        <Cascader
          popupClassName="ult-list-advanced-search-cascader"
          showSearch={{
            filter: (inputValue, path) => {
              return path.some(
                option =>
                  option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >
                  -1
              )
            }
          }}
          suffixIcon={
            <div className="ult-list-advanced-search-cascader-icon">
              <Icon type={'down'} />
            </div>
          }
          allowClear={false}
          onChange={(v, opt) => handleChange(key, v, opt)}
          {...props}
          value={searchParams[key]}
        />
      )
    }
  }

  return (
    <div>
      <Row className={`ult-list-advanced-search ${collapsed ? 'hide' : ''}`}>
        {searchOptions.map((item, index) => {
          return (
            <Col key={index} span={6} className="ult-list-advanced-search-item">
              <div className="ult-list-advanced-search-item-label">
                {item.label}
              </div>
              {renderAdvancedSearchItem(item)}
            </Col>
          )
        })}
        <Col
          span={6}
          className="ult-list-advanced-search-item btn-group"
          offset={computeOffset(searchOptions.length)}
        >
          <Button onClick={handleReset}>重置</Button>
          <Button type="primary" onClick={handleSubmit}>
            查询
          </Button>
        </Col>
      </Row>
    </div>
  )
}

AdvancedSearch.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  advancedSearchOptions: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
}

AdvancedSearch.defaultProps = {}

export default AdvancedSearch
