/* eslint-disable */
import React from 'react'
import { Icon, Tooltip, Notification, Loading, Button as UltrauiButton, NoData, TagItem } from 'ultraui'
import { Button, Input, Select, Modal } from 'huayunui'
import { Pagination, Checkbox } from 'antd'
import { applicationStore as api, application } from '~/http/api'
import HuayunRequest from '~/http/request'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import './index.less'
import Card from '~/components/Card'
import DetailIcon from '~/components/DetailIcon'
import Detail from './detail'

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
      isSelectable: false, // 是否是可选的
      selectedRowIds: [], // 被选中的id集合
      isDetailModalVisible: false, // 详情抽屉
      currentDataItem: {}, // 选中的应用包
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
        const { data: { datas, total } } = res
        this.setState({
          dataList: datas,
          total
        })
      },
      complete: (res) => {
        this.setState({
          isFetching: false
        })
      }
    })
  }
  handleDelete = (ids, isFromDetail) => {
    const { intl } = this.props
    const title = `${intl.formatMessage({ id: 'Delete' })}${intl.formatMessage({ id: 'Application' })}`
    Modal.error({
      title,
      content: intl.formatMessage({ id: 'IsSureToDelete' }, { name: intl.formatMessage({ id: 'Application' }) }),
      onOk: () => {
        HuayunRequest(api.delete, { ids }, {
          success: () => {
            this.handleSearch()
            notification.notice({
              id: new Date(),
              type: 'success',
              title: intl.formatMessage({ id: 'Success' }),
              content: `${title}${intl.formatMessage({ id: 'Success' })}`,
              iconNode: 'icon-success-o',
              duration: 5,
              closable: true
            })
            // 从详情里面点击删除，需要额外把drawer关闭
            if (isFromDetail) {
              this.setState({
                isDetailModalVisible: false,
                currentDataItem: {},
              })
            }
          }
        })
      }
    })
  }
  handleManageStoreItem = (id) => {
    this.props.history.push(`${this.props.match.path}/edit/${id}`)
  }
  handlePageChange = (pageNumber, pageSize) => {
    this.setState({
      pageNumber, pageSize
    }, () => {
      this.handleSearch()
    })
  }
  // 取消批量删除操作
  handleSetBatchSelect = (isSelectable) => {
    this.setState({
      isSelectable,
      selectedRowIds: []
    })
  }
  onCheckAllChange = (e) => {
    const isChecked = _.get(e, 'target.checked', false)
    const { dataList } = this.state
    let selectedRowIds = []
    if (isChecked) {
      selectedRowIds = dataList.map(item => item.id)
    } else {
      selectedRowIds = []
    }
    this.setState({
      selectedRowIds
    })
  }
  handleCheckBoxChange = (e, id) => {
    const isChecked = _.get(e, 'target.checked', false)
    let { selectedRowIds } = this.state
    if (isChecked) {
      selectedRowIds.push(id)
    } else {
      const index = selectedRowIds.findIndex(item => item === id)
      selectedRowIds.splice(index, 1)
    }
    this.setState({
      selectedRowIds
    })
  }
  handleChange = (key, val) => {
    const value = _.get(val, 'target.value', val)
    this.setState({
      [key]: value
    })
  }
  handleSeeDetail = (item) => {
    this.setState({
      currentDataItem: item,
      isDetailModalVisible: true
    })
  }
  render() {
    const { intl } = this.props
    const { isFetching, dataList, pageNumber, pageSize, total, name, tags, isSelectable, selectedRowIds, isDetailModalVisible, currentDataItem } = this.state
    const indeterminateState = selectedRowIds.length && selectedRowIds.length !== dataList.length
    return (
      <div id='ApplicationStore'>
        <div className='header'>
          <div className='selectRow'>
            {
              isSelectable ? (
                <>
                  <Checkbox indeterminate={indeterminateState} onChange={this.onCheckAllChange} checked={selectedRowIds.length === dataList.length} />
                  <a type='text' onClick={() => this.handleSetBatchSelect(false)} className='cancleBtn' >取消</a>
                  <UltrauiButton type='text' onClick={() => this.handleDelete(selectedRowIds)} disabled={selectedRowIds.length === 0}>
                    <Icon type="delete" />&nbsp;{intl.formatMessage({ id: 'Delete' })}
                  </UltrauiButton>
                </>
              ) : <span onClick={() => this.handleSetBatchSelect(true)}>选择</span>
            }
          </div>
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
        {
          isFetching ? <Loading /> : (
            dataList.length ? (
              <div className='body'>
                {
                  dataList.map(item => {
                    const { id, lastVersion, name, description, versionCount, tags } = item
                    return (
                      <div className='dataItem'>
                        {
                          isSelectable ? (
                            <Checkbox
                              onChange={(e) => this.handleCheckBoxChange(e, id)}
                              checked={Boolean(selectedRowIds.indexOf(id) > -1)}
                            />
                          ) : null
                        }
                        <Card handleDelete={() => this.handleDelete([id])} key={id}>
                          <div className='storeItem'>
                            <div className='storeInfo'>
                              <div className='basicInfo br'>
                                <DetailIcon iconType="manage" className="m-r-sm" />
                                <div className='name_des'>
                                  <span className='name'>
                                    <a onClick={() => this.handleSeeDetail(item)}>{name}&nbsp;</a>
                                    <span>{lastVersion}</span>
                                  </span>
                                  <span className='des'>{description}</span>
                                </div>
                              </div>
                              <div className='versionInfo br'>
                                <span>{versionCount}</span>
                                <span>{intl.formatMessage({ id: 'VersionCount' })}</span>
                              </div>
                              <div className='tagInfo'>
                                <div className='labelList'>
                                  {
                                    tags.map((item, index) => {
                                      return (
                                        <TagItem
                                          size='small'
                                          key={item}
                                          name={item}
                                          className='tagWithoutClose'
                                        />
                                      )
                                    })
                                  }
                                </div>
                                <span>{intl.formatMessage({ id: 'Tag' })}</span>
                              </div>
                            </div>
                            <UltrauiButton type="text" onClick={() => this.handleManageStoreItem(id)}>
                              <Icon type="edit" />&nbsp;{intl.formatMessage({ id: '::Manage' })}
                            </UltrauiButton>
                          </div>
                        </Card>
                      </div>
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
            ) : <NoData />
          )
        }
        <Detail
          {...this.props}
          currentDataItem={currentDataItem}
          visible={isDetailModalVisible}
          onClose={() => this.handleChange('isDetailModalVisible', false)}
          handleDelete={() => this.handleDelete([currentDataItem.id], true)}
        ></Detail>
      </div>
    )
  }
}

export default ApplicationStore
