/* eslint-disable */
import React from 'react'
import { Icon, Tooltip, Notification, Loading, Button as UltrauiButton, NoData, TagItem } from 'ultraui'
import { Button, Input, Select, Modal, Switch, SearchBar, ButtonGroup } from 'huayunui'
import { resource as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import DetailIcon from '~/components/DetailIcon'
import './index.less'
import { getEnvIdByEnvName } from '~/constants/config'

const _ = window._
const notification = Notification.newInstance()
class ResourceTypeManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: false,
      defaultPlatformResources: [], // 初始化选中的，用于取消操作的重新赋值
      platformResources: [],
      systemResources: [],
      name: '',
      isEdit: false, // 是否是编辑模式
    }
  }
  componentDidMount() {
    this.addEditButton()
    this.handleSearch()
  }
  componentWillUnmount() {
    this.props.handleExtra({
      extraChildren: null,
    })
  }
  addEditButton = () => {
    const { handleExtra, intl } = this.props
    const { isEdit } = this.state
    handleExtra({
      extraChildren: (
        <ActionAuth action={actions.AdminApplicationCenterApplicationOperate}>
          <div className='editResourceTypeButton'>
            编辑模式&nbsp;
            <Switch size="large" checked={isEdit} onChange={this.handleEditSwitchChange} />
          </div>
        </ActionAuth>
      )
    })
  }
  handleSearchParamsChange = (type, params) => {
    this.setState({
      ...this.state,
      ...params
    }, () => {
      this.handleSearch()
    })
  }
  handleSearch = () => {
    const { name } = this.state
    this.setState({
      isFetching: true
    })
    HuayunRequest(api.queryResourcePermissions, { name }, {
      success: (res) => {
        const { platformResources, systemResources } = res.data
        this.setState({
          defaultPlatformResources: [...platformResources],
          platformResources: [...platformResources],
          systemResources
        })
      },
      complete: (res) => {
        this.setState({
          isFetching: false
        })
      }
    })
  }
  handleEditSwitchChange = (f) => {
    this.setState({
      isEdit: f
    }, () => {
      this.addEditButton()
    })
  }
  handleSwitchChange = (bool, name) => {
    let { platformResources } = this.state
    if (bool) {
      platformResources.push(name)
    } else {
      let index = platformResources.findIndex(item => item === name)
      platformResources.splice(index, 1)
    }
    this.setState({
      platformResources: [...platformResources]
    })
  }
  handleCancelConfirm = () => {
    const { defaultPlatformResources } = this.state
    Modal.confirm({
      content: '是否确定退出编辑模式？现在退出将不保存刚才的操作！',
      cancelButtonProps: {
        type: 'default'
      },
      cancelText: '退出',
      onCancel: (close) => {
        this.setState({
          platformResources: defaultPlatformResources,
        })
        this.handleEditSwitchChange(false)
        close()
      },
      okText: '继续编辑',
      onOk: (close) => {
        close()
      }
    })
  }
  handleConfirmEdit = () => {
    const { intl } = this.props
    const { platformResources: resources } = this.state
    HuayunRequest(api.modifyResourcePermissions, { resources }, {
      success: (res) => {
        notification.notice({
          id: new Date(),
          type: 'success',
          title: intl.formatMessage({ id: 'Success' }),
          content: `${intl.formatMessage({ id: 'Operate' })}'${intl.formatMessage({ id: 'Success' })}`,
          iconNode: 'icon-success-o',
          duration: 5,
          closable: true
        })
      }
    })
    this.handleSearch()
    this.handleEditSwitchChange(false)
  }
  render() {
    const { intl } = this.props
    const { isFetching, platformResources, defaultPlatformResources, systemResources, name, isEdit } = this.state
    return (
      <div id='ResourceTypeManage'>
        <SearchBar
          slot={() => (
            isEdit ? (
              <>
                <Button type="default" onClick={this.handleCancelConfirm}>取消</Button>&nbsp;&nbsp;
                <Button type="primary" onClick={this.handleConfirmEdit}>确认</Button>
              </>
            ) : null
          )}
          searchOption={{
            key: 'name',
            title: intl.formatMessage({ id: 'Name' }),
          }}
          params={{
            name
          }}
          paramsAlias={{
            name: {
              title: '名称'
            }
          }}
          onRefresh={this.handleSearch}
          onChange={this.handleSearchParamsChange}
        />
        {
          isFetching ? <Loading /> : (
            <div className='resourceList'>
              {
                systemResources.map(({ name, isGrant }) => {
                  const isChecked = platformResources.indexOf(name) > -1
                  return (
                    <div className={`resourceItem ${!isGrant ? 'isDisabled' : ''}`}>
                      <div className='info'>
                        <DetailIcon iconType="setting" className="m-r-sm" />
                        <div>
                          <div className='title'>{name}</div>
                          <TagItem
                            size='small'
                            name={isChecked ? '开启' : '关闭'}
                            className='tagWithoutClose'
                          />
                        </div>
                      </div>
                      <Switch size="large" checked={isChecked} disabled={!isGrant || !isEdit} onChange={f => this.handleSwitchChange(f, name)} />
                    </div>
                  )
                })
              }
            </div>
          )
        }
      </div>
    )
  }
}

export default ResourceTypeManage
