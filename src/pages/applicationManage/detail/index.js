/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, Tabs, Modal, Dropdown } from 'huayunui';
import { Icon, Notification, Loading, Button } from 'ultraui'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import Preview from './preview'
import Detail from './detail'
import Entrance from './entrance'
import Alarm from './alarm'
import Log from './log'
import Publish from './publish'
import UpdateApplication from './UpdateApplication'
import ApplicationRollBack from './ApplicationRollBack'
import OutputHistory from './OutputHistory'

const notification = Notification.newInstance()
const { TabPane } = Tabs
class ApplicationDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            detail: {}, // 应用详情
            isLoading: false, // 是否需要loading，定时刷新是不需要loading的
            isApplicationUpdateModalVisible: false, // 应用更新
            isShowOutputHistory: false, // 是否展开输出历史
        }
        this.operationTarget = props.intl.formatMessage({ id: 'Application' })
    }
    componentDidMount() {
        const { currentApplication: { id } } = this.props
        this.getDetail(id)
    }
    componentWillReceiveProps(nextProps) {
        const { currentApplication: { id } } = this.props
        const { currentApplication: { id: nextId } } = nextProps
        if (id !== nextId) {
            this.getDetail(nextId)
        }
    }
    shouldComponentUpdate(nextProps, { detail, isLoading }) {
        // 接口已经返回，但是当前的应用和接口的应用不一致，则不更新
        if ((this.props.currentApplication.id !== detail.id) && !isLoading) {
            return false
        } else {
            return true
        }
    }
    // 获取应用以及资源的详情信息
    getDetail = (id = this.props.currentApplication.id, isInterval = false) => {
        const { intl, refreshTableList, currentApplication } = this.props
        const { detail } = this.state
        if (!isInterval) {
            this.setState({
                isLoading: true
            })
        }
        // 如果发送请求的时候，请求的id不是当前应用了，那不需要发了，轮询请求的时候发现应用已经切换了
        if ((currentApplication.id !== detail.id) && isInterval) {
            return false
        }
        HuayunRequest(api.detail, { id }, {
            success: (res) => {
                const { state, id } = res.data
                // 如果切换应用过快，则详情页会按照请求顺序依次渲染。我们只要渲染当前的应用就行了
                if (this.props.currentApplication.id !== id) {
                    return false
                }
                this.setState({
                    detail: res.data
                }, () => {
                    // 状态不等于config开启定时器
                    // 定义ApplicationDetailIntervalRequest为查询应用详情的轮询
                    if (state !== 'config' && state !== 'failed' && !window.ApplicationDetailIntervalRequest) {
                        window.ApplicationDetailIntervalRequest = setInterval(() => {
                            this.getDetail(id, true)
                        }, 10000)
                    } 
                    if ((state === 'config' || state === 'failed') && window.ApplicationDetailIntervalRequest) {
                        clearInterval(window.ApplicationDetailIntervalRequest)
                        window.ApplicationDetailIntervalRequest = null
                    }
                    if (state !== detail.state) {
                        // 状态改变更新列表页
                        refreshTableList()
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
    // 设置app上下线
    setAppStatus = () => {
        const { intl } = this.props
        const { detail: { state, name, id } } = this.state
        const action = intl.formatMessage({ id: state === 'config' ? 'OnLine' : 'OffLine' })
        const content = `${action}${this.operationTarget}-${name}`
        Modal.warning({
            content: `确认${content} ？`,
            onOk: () => {
                const actionType = state === 'config' ? 'deploy' : 'undeploy'
                HuayunRequest(api[actionType], { id }, {
                    success: (res) => {
                        this.getDetail(id)
                        notification.notice({
                            id: 'setAppOn_OffLine',
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${content}${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    handleDelete = () => {
        const { intl, refreshTableList } = this.props
        const { detail: { state, name, id } } = this.state
        const action = intl.formatMessage({ id: 'Delete' })
        Modal.error({
            content: `${intl.formatMessage({ id: 'IsSureToDelete' }, { name: `${this.operationTarget}-${name}` })}`,
            onOk: () => {
                HuayunRequest(api.delete, { ids: [id] }, {
                    success: (res) => {
                        refreshTableList(true) // 更新应用列表
                        notification.notice({
                            id: 'deleteApp',
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
    handleSetState = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    // 应用更新
    handleConfirmUpdate = () => {
        const { props: { form }, state: { versionId: applicationVersionId, configInfo, isCoverApplicationGateway, isCoverApplicationAlarmConfig, isCoverApplicationContainerConfig } } = this.$UpdateApplication
        form.validateFields((error, values) => {
            if (error) {
                return false
            }
            const { detail: { id, name } } = this.state
            const { intl } = this.props
            const action = intl.formatMessage({ id: 'Update' })
            const params = {
                id,
                applicationVersionId,
                configInfo,
                coverApplicationGateway: isCoverApplicationGateway === 'true' ? true : false,
                coverApplicationAlarmConfig: isCoverApplicationAlarmConfig === 'true' ? true : false,
                coverApplicationContainerConfig: isCoverApplicationContainerConfig === 'true' ? true : false
            }
            this.handleSetState('isApplicationUpdateModalVisible', false)
            HuayunRequest(api.upgrade, params, {
                success: (res) => {
                    this.getDetail(id)
                    notification.notice({
                        id: 'updateSuccess',
                        type: 'success',
                        title: intl.formatMessage({ id: 'Success' }),
                        content: `${action}${this.operationTarget}${name}'${intl.formatMessage({ id: 'Success' })}`,
                        iconNode: 'icon-success-o',
                        duration: 5,
                        closable: true
                    })
                }
            })
        })
    }
    // 应用回滚
    handleConfirmRollBack = () => {
        const { props: { form }, state: { versionId: id, isCoverApplicationGateway, isCoverApplicationAlarmConfig, isCoverApplicationContainerConfig } } = this.$ApplicationRollBack
        form.validateFields((error, values) => {
            if (error) {
                return false
            }
            const { detail } = this.state
            const { intl } = this.props
            const action = intl.formatMessage({ id: 'RollBack' })
            const params = {
                id,
                applicationId: detail.id,
                coverApplicationGateway: isCoverApplicationGateway === 'true' ? true : false,
                coverApplicationAlarmConfig: isCoverApplicationAlarmConfig === 'true' ? true : false,
                coverApplicationContainerConfig: isCoverApplicationContainerConfig === 'true' ? true : false
            }
            this.handleSetState('isApplicationRollBackModalVisible', false)
            HuayunRequest(api.rollBack, params, {
                success: (res) => {
                    this.getDetail(detail.id)
                    notification.notice({
                        id: 'RollBackSuccess',
                        type: 'success',
                        title: intl.formatMessage({ id: 'Success' }),
                        content: `${action}${this.operationTarget}'${detail.name}'${intl.formatMessage({ id: 'Success' })}`,
                        iconNode: 'icon-success-o',
                        duration: 5,
                        closable: true
                    })
                }
            })
        })
    }
    render() {
        const { intl } = this.props
        const { isLoading, detail, isApplicationUpdateModalVisible, isApplicationRollBackModalVisible, isShowOutputHistory } = this.state
        const { state, id } = detail
        const on_offLine = state === 'config' ? (<><Icon type="rise-o" />&nbsp;{intl.formatMessage({ id: 'OnLine' })}</>) : (<><Icon type="drop-o" />&nbsp;{intl.formatMessage({ id: 'OffLine' })}</>)
        const operaOptions = [
            <ActionAuth action={actions.AdminApplicationCenterApplicationMaintain}>
                <Button
                    className='operaItem'
                    type='text'
                    onClick={this.setAppStatus}
                    disabled={state !== 'config' && state !== 'deployed' && state !== 'failed'}
                >
                    {on_offLine}
                </Button>
            </ActionAuth>,
            <ActionAuth action={actions.AdminApplicationCenterApplicationMaintain}>
                <Button
                    className='operaItem'
                    type='text'
                    onClick={() => this.handleSetState('isApplicationUpdateModalVisible', true)}
                    disabled={state !== 'config' && state !== 'deployed' && state !== 'failed'}
                >
                    <Icon type="reboot" />&nbsp;{intl.formatMessage({ id: 'Update' })}
                </Button>
            </ActionAuth>,
            <ActionAuth action={actions.AdminApplicationCenterApplicationMaintain}>
                <Button
                    className='operaItem'
                    type='text'
                    onClick={() => this.handleSetState('isApplicationUpdateModalVisible', true)}
                    disabled={state !== 'config'}
                >
                    <Icon type="release" />&nbsp;{intl.formatMessage({ id: 'ChangeSetting' })}
                </Button>
            </ActionAuth>,
            <ActionAuth action={actions.AdminApplicationCenterApplicationMaintain}>
                <Button
                    className='operaItem'
                    type='text'
                    onClick={() => this.handleSetState('isApplicationRollBackModalVisible', true)}
                    disabled={state !== 'deployed' && state !== 'failed'}
                >
                    <Icon type="refresh" />&nbsp;{intl.formatMessage({ id: 'RollBack' })}
                </Button>
            </ActionAuth>,
            <ActionAuth action={actions.AdminApplicationCenterApplicationOperate}>
                <Button
                    className='operaItem noborder'
                    type='text'
                    onClick={this.handleDelete}
                    disabled={state !== 'config'}
                >
                    <Icon type="delete" />&nbsp;{intl.formatMessage({ id: 'Delete' })}
                </Button>
            </ActionAuth>
        ]
        return (
            <div className='applicationDetail'>
                {
                    isLoading ? <Loading /> : (
                        <React.Fragment>
                            {
                                detail.id ? (
                                    <React.Fragment>
                                        <div className='operaBar'>
                                            <div className='leftGroup'>
                                                {
                                                    operaOptions.map((item, index) => {
                                                        return <ActionAuth action={actions.AdminApplicationCenterApplicationMaintain} key={index}>{item}</ActionAuth>
                                                    })
                                                }
                                            </div>
                                            <ActionAuth action={actions.AdminApplicationCenterApplicationMaintain}>
                                                <Dropdown
                                                    trigger={['click']}
                                                    overlay={<OutputHistory id={id} intl={intl} />}
                                                    placement="bottomLeft"
                                                    onVisibleChange={(visible) => this.handleSetState('isShowOutputHistory', visible)}
                                                >
                                                    <div className="operaItem">
                                                        {intl.formatMessage({ id: 'OutputHistory' })}
                                                        <Icon type={isShowOutputHistory ? "up" : "down"} />
                                                    </div>
                                                </Dropdown>
                                            </ActionAuth>
                                        </div>
                                        <div className='detailContent'>
                                            <Tabs defaultActiveKey="Preview">
                                                <TabPane tab={intl.formatMessage({ id: 'OverView' })} key="Preview">
                                                    <Preview {...this.props} detail={detail} getDetail={this.getDetail}></Preview>
                                                </TabPane>
                                                <TabPane tab={intl.formatMessage({ id: 'Detail' })} key="Detail">
                                                    <Detail {...this.props} detail={detail} getDetail={this.getDetail}></Detail>
                                                </TabPane>
                                                <TabPane tab={intl.formatMessage({ id: 'Entrance' })} key="Entrance">
                                                    <Entrance {...this.props} detail={detail}></Entrance>
                                                </TabPane>
                                                <TabPane tab={intl.formatMessage({ id: 'Alarm' })} key="Alarm">
                                                    <Alarm {...this.props}></Alarm>
                                                </TabPane>
                                                <TabPane tab={intl.formatMessage({ id: 'Log' })} key="Log">
                                                    <Log {...this.props} detail={detail}></Log>
                                                </TabPane>
                                                <TabPane tab={intl.formatMessage({ id: 'AppPublish' })} key="Publish">
                                                    <Publish {...this.props} detail={detail}></Publish>
                                                </TabPane>
                                            </Tabs>
                                        </div>
                                    </React.Fragment>
                                ) : null
                            }
                        </React.Fragment>
                    )
                }
                <Modal
                    title={`${intl.formatMessage({ id: 'Application' })}${intl.formatMessage({ id: 'Update' })}`}
                    visible={isApplicationUpdateModalVisible}
                    onOk={this.handleConfirmUpdate}
                    onCancel={() => this.handleSetState('isApplicationUpdateModalVisible', false)}
                    className='updateApplicationModal'
                >
                    <UpdateApplication
                        intl={intl}
                        detail={detail}
                        wrappedComponentRef={node => this.$UpdateApplication = node} />
                </Modal>
                <Modal
                    title={`${intl.formatMessage({ id: 'Application' })}${intl.formatMessage({ id: 'RollBack' })}`}
                    visible={isApplicationRollBackModalVisible}
                    onOk={this.handleConfirmRollBack}
                    onCancel={() => this.handleSetState('isApplicationRollBackModalVisible', false)}
                    className='applicationRollBackModal'
                    destroyOnClose={true}
                >
                    <ApplicationRollBack
                        intl={intl}
                        detail={detail}
                        wrappedComponentRef={node => this.$ApplicationRollBack = node} />
                </Modal>
            </div>
        )
    }
}

export default ApplicationDetail
