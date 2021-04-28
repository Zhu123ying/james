/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, Tabs, Modal } from 'huayunui';
import { Icon, Notification, Loading } from 'ultraui'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import Preview from './preview'
import Detail from './detail'
import Entrance from './entrance'
import Alarm from './alarm'
import Log from './log'
import Publish from './publish'

const notification = Notification.newInstance()
const { TabPane } = Tabs;
class ApplicationDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.operationTarget = props.intl.formatMessage({ id: 'Application' })
    }
    componentDidMount() {
        this.getDetail()
    }
    getDetail = () => {

    }
    // 设置app上下线
    setAppStatus = () => {
        const { intl, currentApplication: { state, name, id }, refreshTableList } = this.props
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
                            duration: 30,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    handleDelete = () => {
        const { intl, currentApplication: { id, name }, refreshTableList } = this.props
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
                            duration: 30,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    render() {
        const { intl, currentApplication: { state } } = this.props
        const { isFetching } = this.state
        const on_offLine = state === 'config' ? (<><Icon type="rise-o" />&nbsp;{intl.formatMessage({ id: 'OnLine' })}</>) : (<><Icon type="drop-o" />&nbsp;{intl.formatMessage({ id: 'OffLine' })}</>)
        const operaOptions = [
            <div className='operaItem' onClick={this.setAppStatus}>{on_offLine}</div>,
            <div className='operaItem'><Icon type="reboot" />&nbsp;{intl.formatMessage({ id: 'Update' })}</div>,
            <div className='operaItem'><Icon type="release" />&nbsp;{intl.formatMessage({ id: 'ChangeSetting' })}</div>,
            <div className='operaItem'><Icon type="refresh" />&nbsp;{intl.formatMessage({ id: 'RollBack' })}</div>,
            <div className='operaItem noborder' onClick={this.handleDelete}><Icon type="delete" />&nbsp;{intl.formatMessage({ id: 'Delete' })}</div>,
            <div className='operaItem'>{intl.formatMessage({ id: 'OutputHistory' })}<Icon type="down" /></div>
        ]
        return (
            <div className='applicationDetail'>
                {
                    isFetching ? <Loading /> : (
                        <React.Fragment>
                            <div className='operaBar'>
                                {
                                    operaOptions.map((item, index) => {
                                        return <ActionAuth action={actions.AdminApplicationCenterApplicationMaintain} key={index}>{item}</ActionAuth>
                                    })
                                }
                            </div>
                            <div className='detailContent'>
                                <Tabs defaultActiveKey="Preview">
                                    <TabPane tab={intl.formatMessage({ id: 'OutputHistory' })} key="Preview">
                                        <Preview intl={intl}></Preview>
                                    </TabPane>
                                    <TabPane tab={intl.formatMessage({ id: 'Detail' })} key="Detail">
                                        <Detail intl={intl}></Detail>
                                    </TabPane>
                                    <TabPane tab={intl.formatMessage({ id: 'Entrance' })} key="Entrance">
                                        <Entrance intl={intl}></Entrance>
                                    </TabPane>
                                    <TabPane tab={intl.formatMessage({ id: 'Alarm' })} key="Alarm">
                                        <Alarm intl={intl}></Alarm>
                                    </TabPane>
                                    <TabPane tab={intl.formatMessage({ id: 'Log' })} key="Log">
                                        <Log intl={intl}></Log>
                                    </TabPane>
                                    <TabPane tab={intl.formatMessage({ id: 'AppPublish' })} key="Publish">
                                        <Publish intl={intl}></Publish>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </React.Fragment>
                    )
                }
            </div>
        )
    }
}

ApplicationDetail.propTypes = {
    intl: PropTypes.object,
    currentApplication: PropTypes.object,
}

export default ApplicationDetail
