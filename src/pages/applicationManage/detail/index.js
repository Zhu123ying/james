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
const { TabPane } = Tabs;
class ApplicationDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            detail: {}, // 应用详情
            isFetching: false,
            isApplicationUpdateModalVisible: false, // 应用更新
            isShowOutputHistory: false, // 是否展开输出历史

        }
        this.operationTarget = props.intl.formatMessage({ id: 'Application' })
        this.isIntervalFetch = false // 详情定时
    }
    componentDidMount() {
        const { currentApplication: { id } } = this.props
        this.getDetail(id)
    }
    componentDidUpdate(prevProps) {
        const { currentApplication: { id } } = this.props
        const { currentApplication: { id: preId } } = prevProps
        id !== preId && this.getDetail(id)
    }
    // 获取应用以及资源的详情信息
    getDetail = (id, bool = false) => {
        this.isIntervalFetch = bool
        const { intl } = this.props
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.detail, { id }, {
            success: (res) => {
                this.setState({
                    detail: res.data,
                }, () => {
                    // // 资源概览饼图
                    // const { resourceObjectStatistics } = res
                    // resourceObjectStatistics && Object.keys(resourceObjectStatistics).forEach(key => {
                    //     this.initResourcePie(key, resourceObjectStatistics[key])
                    // })
                    // // 状态不等于config开启定时器
                    // if (res.state !== 'config' && !this.timer) {
                    //     this.timer = setInterval(() => {
                    //         const { modelUndeploy, modelDeploy, modelDetail } = this.props
                    //         // 添加modelDetail.isFetching的理由是：有时候接口返回太慢，前面的接口还没返回回来，下一个接口就已经发出去了，所以加个限制！！！
                    //         !modelUndeploy.isFetching && !modelDeploy.isFetching && !modelDetail.isFetching && this.getDetail(true)
                    //     }, 10000)
                    // } else if (res.state === 'config' && this.timer) {
                    //     clearInterval(this.timer)
                    //     this.timer = null
                    // }
                })
            },
            complete: (res) => {
                this.setState({
                    isFetching: false
                })
            }
        })
    }
    // 设置app上下线
    setAppStatus = () => {
        const { intl, refreshTableList } = this.props
        const { detail: { state, name, id } } = this.state
        const action = intl.formatMessage({ id: state === 'config' ? 'OnLine' : 'OffLine' })
        const content = `${action}${this.operationTarget}-${name}`
        Modal.warning({
            content: `确认${content} ？`,
            onOk: () => {
                const actionType = state === 'config' ? 'deploy' : 'undeploy'
                HuayunRequest(api[actionType], { id }, {
                    success: (res) => {
                        refreshTableList() // 更新应用列表
                        notification.notice({
                            id: 'setAppOn_OffLine',
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
    handleDelete = () => {
        const { intl, refreshTableList } = this.props
        const { detail: { state, name, id } } = this.state
        const action = intl.formatMessage({ id: 'Delete' })
        Modal.error({
            content: `${intl.formatMessage({ id: 'IsSureToDelete' }, { name: `${this.operationTarget}-${name}` })}`,
            onOk: () => {
                HuayunRequest(api.delete, { ids: [id] }, {
                    success(res) {
                        refreshTableList() // 更新应用列表
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
        const { props: { form }, state: { versionId: applicationVersionId, configInfo, isCoverApplicationGateway } } = this.$UpdateApplication
        form.validateFields((error, values) => {
            if (error) {
                return false
            }
            const { detail: { id, name } } = this.state
            const { intl, refreshTableList } = this.props
            const action = intl.formatMessage({ id: 'Update' })
            const params = {
                id,
                applicationVersionId,
                configInfo,
                coverApplicationGateway: isCoverApplicationGateway === 'true' ? true : false
            }
            this.handleSetState('isApplicationUpdateModalVisible', false)
            HuayunRequest(api.upgrade, params, {
                success: (res) => {
                    refreshTableList() // 更新应用列表
                    notification.notice({
                        id: 'updateSuccess',
                        type: 'success',
                        title: intl.formatMessage({ id: 'Success' }),
                        content: `${action}${this.operationTarget}'${name}'${intl.formatMessage({ id: 'Success' })}`,
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
        const { props: { form }, state: { versionId: id, isCoverApplicationGateway } } = this.$ApplicationRollBack
        form.validateFields((error, values) => {
            if (error) {
                return false
            }
            const { detail } = this.state
            const { intl, refreshTableList } = this.props
            const action = intl.formatMessage({ id: 'RollBack' })
            const params = {
                id,
                applicationId: detail.id,
                coverApplicationGateway: isCoverApplicationGateway === 'true' ? true : false
            }
            this.handleSetState('isApplicationRollBackModalVisible', false)
            HuayunRequest(api.rollBack, params, {
                success: (res) => {
                    refreshTableList() // 更新应用列表
                    notification.notice({
                        id: 'RollBackSuccess',
                        type: 'success',
                        title: intl.formatMessage({ id: 'Success' }),
                        content: `${action}${this.operationTarget}'${name}'${intl.formatMessage({ id: 'Success' })}`,
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
        const { isFetching, detail, isApplicationUpdateModalVisible, isApplicationRollBackModalVisible, isShowOutputHistory } = this.state
        const { state, id } = detail
        const on_offLine = state === 'config' ? (<><Icon type="rise-o" />&nbsp;{intl.formatMessage({ id: 'OnLine' })}</>) : (<><Icon type="drop-o" />&nbsp;{intl.formatMessage({ id: 'OffLine' })}</>)
        const operaOptions = [
            <Button className='operaItem' type='text' onClick={this.setAppStatus}>{on_offLine}</Button>,
            <Button className='operaItem' type='text' onClick={() => this.handleSetState('isApplicationUpdateModalVisible', true)} disabled={state === 'config'}>
                <Icon type="reboot" />&nbsp;{intl.formatMessage({ id: 'Update' })}
            </Button>,
            <Button className='operaItem' type='text' onClick={() => this.handleSetState('isApplicationUpdateModalVisible', true)} disabled={state !== 'config'}>
                <Icon type="release" />&nbsp;{intl.formatMessage({ id: 'ChangeSetting' })}
            </Button>,
            <Button className='operaItem' type='text' onClick={() => this.handleSetState('isApplicationRollBackModalVisible', true)} disabled={state === 'config' || !id}>
                <Icon type="refresh" />&nbsp;{intl.formatMessage({ id: 'RollBack' })}
            </Button>,
            <Button className='operaItem noborder' type='text' onClick={this.handleDelete}>
                <Icon type="delete" />&nbsp;{intl.formatMessage({ id: 'Delete' })}
            </Button>,
        ]
        return (
            <div className='applicationDetail'>
                {
                    // 第一次请求才loading
                    (isFetching && !id) ? <Loading /> : (
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
                                                    <Entrance {...this.props}></Entrance>
                                                </TabPane>
                                                <TabPane tab={intl.formatMessage({ id: 'Alarm' })} key="Alarm">
                                                    <Alarm {...this.props}></Alarm>
                                                </TabPane>
                                                <TabPane tab={intl.formatMessage({ id: 'Log' })} key="Log">
                                                    <Log {...this.props}></Log>
                                                </TabPane>
                                                <TabPane tab={intl.formatMessage({ id: 'AppPublish' })} key="Publish">
                                                    <Publish {...this.props} Z></Publish>
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

ApplicationDetail.propTypes = {
    intl: PropTypes.object,
    currentApplication: PropTypes.object,
}

export default ApplicationDetail
