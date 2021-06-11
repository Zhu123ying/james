/* eslint-disable */
import React from 'react'
import { Icon, Tooltip, Notification, Loading, Button as UltrauiButton } from 'ultraui'
import { Button, Input, Select } from 'huayunui'
import { Pagination } from 'antd'
import { applicationStore as api, application } from '~/http/api'
import HuayunRequest from '~/http/request'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import './index.less'
import Card from '~/components/Card'
import DetailIcon from '~/components/DetailIcon'

const _ = window._
const notification = Notification.newInstance()

class ApplicationStore extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: false,
      dataList: [],
      projectList: [],
      name: '', // 搜索条件
      tags: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
    }
  }
  componentDidMount() {
    this.addCreateApplicationButton()
    this.handleSearch()
    this.getProjectList()
  }
  componentWillUnmount() {
    this.props.handleExtra({
      extraChildren: null
    })
  }
  // 获取项目列表
  getProjectList = () => {
    let params = {
      pageNumber: 1,
      pageSize: 10000
    }
    HuayunRequest(application.listProject, params, {
      success: (res) => {
        this.setState({
          projectList: res.data
        })
      }
    })
  }
  addCreateApplicationButton = () => {
    const { handleExtra, intl } = this.props
    handleExtra({
      extraChildren: (
        <ActionAuth action={actions.AdminApplicationCenterApplicationOperate}>
          <Button
            type="primary"
            size="large"
            icon="icon-add"
            onClick={this.handleCreateApplication}
            name={intl.formatMessage({ id: 'CreateApplication' })}
          />
        </ActionAuth>
      ),
      border: false
    })
  }
  handleCreateApplication = () => {
    this.props.history.push(`${this.props.match.path}/create`)
  }
  handleSearchParamChange = (key, val, isFetch = true) => {
    // 此处的请求逻辑有问题，暂不改
    const value = _.get(val, 'target.value', val)
    this.setState({
      [key]: value
    }, () => {
      isFetch && this.handleSearch()
    })
  }
  handleSearch = () => {
    const { name, tags, pageNumber, pageSize } = this.state
    const params = {
      pageNumber,
      pageSize,
      conditions: {
        name,
        tags
      }
    }
    this.setState({
      isFetching: true
    })
    HuayunRequest(api.list, params, {
      success: (res) => {
        const { data: { datas } } = res
        this.setState({
          dataList: datas
        })
      },
      complete: (res) => {
        this.setState({
          isFetching: false
        })
      }
    })
  }
  handleDeleteCardItem = (id) => {

  }
  handleManageStoreItem = () => {

  }
  handlePageChange = (pageNumber, pageSize) => {
    this.setState({
      pageNumber, pageSize
    }, () => {
      this.handleSearch()
    })
  }
  render() {
    const { intl } = this.props
    const { isFetching, dataList, pageNumber, pageSize, total, name, tags } = this.state
    return (
      <div id='ApplicationStore'>
        {
          isFetching ? <Loading /> : (
            <>
              <div className='header'>
                <div className='selectRow'>选择</div>
                <div className='searchBar'>
                  <Input.Search
                    value={name}
                    placeholder={intl.formatMessage({ id: 'Search' })}
                    onChange={(val) => this.handleSearchParamChange('name', val, false)}
                    onSearch={() => this.handleSearch()}
                  />
                  <Select
                    mode="tags"
                    allowClear
                    placeholder={intl.formatMessage({ id: 'Tag' })}
                    style={{ width: 'auto' }}
                    bordered={false}
                    onChange={(val) => this.handleSearchParamChange('tags', val)}
                    dropdownRender={(originNode) => (<div>{originNode}</div>)}
                  >
                    <Select.Option value="jack">Jaasasasck</Select.Option>
                  </Select >
                </div>
              </div>
              <div className='body'>
                {
                  dataList.map(item => {
                    const { id, lastVersion, name, description, versionCount } = item
                    return (
                      <Card handleDelete={() => this.handleDeleteCardItem(id)} key={id}>
                        <div className='storeItem'>
                          <div className='storeInfo'>
                            <div className='basicInfo br'>
                              <DetailIcon iconType="manage" className="m-r-sm" />
                              <div className='name_des'>
                                <span className='name'>
                                  {name}<span>{lastVersion}</span>
                                </span>
                                <span className='des'></span>
                              </div>
                            </div>
                            <div className='versionInfo br'>
                              <span>{versionCount}</span>
                              <span>{intl.formatMessage({ id: 'VersionCount' })}</span>
                            </div>
                            <div className='tagInfo'></div>
                          </div>
                          <UltrauiButton type="text" onClick={() => this.handleManageStoreItem(item)}>
                            <Icon type="edit" />&nbsp;{intl.formatMessage({ id: '::Manage' })}
                          </UltrauiButton>
                        </div>
                      </Card>
                    )
                  })
                }
                <Pagination
                  size='small'
                  showSizeChanger={true}
                  defaultCurrent={1}
                  defaultPageSize={20}
                  pageSizeOptions={[10, 20, 30, 50]}
                  showTotal={total => `共${total}条`}
                  total={total}
                  current={pageNumber || 1}
                  pageSize={pageSize || 20}
                  onChange={this.handlePageChange}
                />
              </div>
            </>
          )
        }
      </div>
    )
  }
}

export default ApplicationStore
