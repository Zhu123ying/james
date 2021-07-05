/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { container as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, Tabs, Modal, Dropdown } from 'huayunui';
import { Icon, Notification, Loading, Button } from 'ultraui'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import Preview from './preview'
import Detail from './detail'
import Information from './information'
import Event from './event'
import Alarm from './alarm'

const notification = Notification.newInstance()
const { TabPane } = Tabs
class ContainerDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            detail: {}, // 应用详情
            isLoading: false, // 是否需要loading，定时刷新是不需要loading的
            monitorData: {}
        }
        this.operationTarget = props.intl.formatMessage({ id: 'Container' })
    }
    componentDidMount() {
        const { currentTableItem: { id } } = this.props
        this.getDetail(id)
        this.getPlatformContainerMonitoring(id)
    }
    componentWillReceiveProps(nextProps) {
        const { currentTableItem: { id } } = this.props
        const { currentTableItem: { id: nextId } } = nextProps
        if (id !== nextId) {
            this.getDetail(nextId)
            this.getPlatformContainerMonitoring(nextId)
        }
    }
    // 获取应用以及资源的详情信息, isInterval:是否是轮询请求
    getDetail = (id = this.props.currentTableItem.id, isInterval) => {
        const { intl } = this.props
        const { detail } = this.state
        if (id !== detail.id) {
            if (isInterval) {
                // 如果是轮询的请求并且容器已经改变了，则不请求了
                return false
            } else {
                this.setState({
                    isLoading: true
                })
            }
        }
        HuayunRequest(api.detail, { id }, {
            success: (res) => {
                this.setState({
                    detail: res.data,
                }, () => {
                    const { state } = res.data
                    // 状态不等于config开启定时器
                    if (state !== 'config') {
                        setTimeout(() => {
                            this.getDetail(id, true)
                        }, 10000)
                    }
                })
            },
            complete: (res) => {
                this.setState({
                    isLoading: false
                })
            }
        })
    }
    getPlatformContainerMonitoring = (platformContainerId = this.props.currentTableItem.id) => {
        HuayunRequest(api.getPlatformContainerMonitoring, { platformContainerId }, {
            success: (res) => {
                this.setState({
                    monitorData: res.data
                })
            }
        })
    }
    // 设置上下线
    handleSetStatus = () => {
        const { intl, refreshTableList } = this.props
        const { detail: { state, name, id } } = this.state
        const action = intl.formatMessage({ id: state === 'config' ? 'OnLine' : 'OffLine' })
        const content = `${action}${this.operationTarget} - ${name}`
        Modal.warning({
            content: `确认${content} ？`,
            onOk: () => {
                const actionType = state === 'config' ? 'startPlatformContainer' : 'stopPlatformContainer'
                HuayunRequest(api[actionType], { id }, {
                    success: (res) => {
                        refreshTableList() // 更新列表
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${content}'${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    handleGoLink = (url) => {
        this.props.history.push(`${this.props.match.path}/${url}`)
    }
    handleDelete = () => {
        const { intl, refreshTableList } = this.props
        const { detail: { state, name, id } } = this.state
        const action = intl.formatMessage({ id: 'Delete' })
        Modal.error({
            content: `${intl.formatMessage({ id: 'IsSureToDelete' }, { name: `${this.operationTarget} - ${name}` })}`,
            onOk: () => {
                HuayunRequest(api.delete, { id }, {
                    success(res) {
                        refreshTableList(true) // 更新列表
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${action}${this.operationTarget}'${name}'${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    handleTabChange = (activeKey) => {
        // 每次切换tab，滚动条重置
        document.getElementsByClassName('archer-tabs-content-holder')[0].scrollTop = 0
    }
    render() {
        const { intl } = this.props
        const { isLoading, detail, monitorData } = this.state
        const { state, id } = detail
        const on_offLine = state === 'config' ? (<><Icon type="rise-o" />&nbsp;{intl.formatMessage({ id: 'OnLine' })}</>) : (<><Icon type="drop-o" />&nbsp;{intl.formatMessage({ id: 'OffLine' })}</>)
        const operaOptions = [
            <Button className='operaItem' type='text' onClick={this.handleSetStatus}>{on_offLine}</Button>,
            <Button className='operaItem' type='text' onClick={() => this.handleGoLink(`create/${id}/1`)}>
                <Icon type="copy" />&nbsp;{intl.formatMessage({ id: 'Copy' })}
            </Button>,
            <Button className='operaItem' type='text' onClick={() => this.handleGoLink(`edit/${id}`)} disabled={state !== 'config'}>
                <Icon type="release" />&nbsp;{intl.formatMessage({ id: 'ChangeSetting' })}
            </Button>,
            <Button className='operaItem noborder' type='text' onClick={this.handleDelete}>
                <Icon type="delete" />&nbsp;{intl.formatMessage({ id: 'Delete' })}
            </Button>,
        ]
        const podMonitorData = _.get(monitorData, 'pod', {}) // 概览里的监控数据
        const containerMonitorData = _.get(monitorData, 'container', {}) // 容器详情里的监控数据

        return (
            <div className='containerDetail'>
                {
                    // 第一次请求才loading
                    isLoading ? <Loading /> : (
                        <React.Fragment>
                            {
                                detail.id ? (
                                    <React.Fragment>
                                        <div className='operaBar'>
                                            {
                                                operaOptions.map((item, index) => {
                                                    return <ActionAuth action={actions.AdminApplicationCenterContainerOperate} key={index}>{item}</ActionAuth>
                                                })
                                            }
                                        </div>
                                        <div className='detailContent'>
                                            <Tabs defaultActiveKey="Preview" onChange={this.handleTabChange}>
                                                <TabPane tab={intl.formatMessage({ id: 'OverView' })} key="Preview">
                                                    <Preview {...this.props} detail={detail} monitorData={podMonitorData} />
                                                </TabPane>
                                                <TabPane tab={intl.formatMessage({ id: 'ContainerInfo' })} key="ContainerInfo">
                                                    <Detail {...this.props} detail={detail} getDetail={this.getDetail} monitorData={containerMonitorData} />
                                                </TabPane>
                                                <TabPane tab={intl.formatMessage({ id: 'Event' })} key="Event">
                                                    <Event  {...this.props} detail={detail} />
                                                </TabPane>
                                                <TabPane tab={intl.formatMessage({ id: 'Message' })} key="Message">
                                                    <Information {...this.props} detail={detail} />
                                                </TabPane>
                                                <TabPane tab={intl.formatMessage({ id: 'PersistenceLog' })} key="PersistenceLog">
                                                    {/* <Log {...this.props}></Log> */}
                                                </TabPane>
                                                <TabPane tab={intl.formatMessage({ id: 'Alarm' })} key="Alarm">
                                                    <Alarm {...this.props} detail={detail} getDetail={this.getDetail} />
                                                </TabPane>
                                            </Tabs>
                                        </div>
                                    </React.Fragment>
                                ) : null
                            }
                        </React.Fragment>
                    )
                }
            </div>
        )
    }
}

export default ContainerDetail
