/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Button, Icon, Loading, SortTable, Dialog, confirmForm, Notification, TagItem, NoData } from 'ultraui'
import { Modal } from 'huayunui'
import './index.less'
import CreateAppPort from './createAppPort'
import HuayunRequest from '~/http/request'
import { application as api } from '~/http/api'

const notification = Notification.newInstance()
const _ = window._
class AppPortalManage extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        const { intl } = props
        this.state = {
            isFetching: false,
            dataList: [], // 应用入口列表数据
            isManageAppPortModalVisible: false, // 管理入口的modal
            currentPortId: '', // 当前入口的id
        }
        this.operaTarget = intl.formatMessage({ id: 'ApplicationPort' })
    }

    componentDidMount() {
        this.getData()
    }

    getData = () => {
        const { detail: { id } } = this.props
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.queryApplicationGateway, { applicationId: id }, {
            success: (res) => {
                this.setState({
                    dataList: res.data
                })
            },
            complete: () => {
                this.setState({
                    isFetching: false
                })
            }
        })
    }

    manageAppPort = (id) => {
        const { intl, detail } = this.props
        const { dataList } = this.state
        this.setState({
            currentPortId: id,
            isManageAppPortModalVisible: true
        })
    }
    handleManageAppPortSubmit = () => {
        const { intl, detail } = this.props
        const { currentPortId: id } = this.state
        this.$CreateAppPort.props.form.validateFields((error, values) => {
            if (!error) {
                const { name, description, config, portKey } = this.$CreateAppPort.state
                const { type, resourceObjectId } = config
                config.portKey = portKey // 这个后端不需要，但是前端编辑赋初始值的时候需要
                const params = {
                    name, type, description, resourceObjectId, applicationId: detail.id, config, id
                }
                let urlType = id ? 'updateApplicationGateway' : 'createApplicationGateway'
                let action = id ? 'Update' : 'Create'
                HuayunRequest(api[urlType], params, {
                    success: (res) => {
                        this.setState({
                            isManageAppPortModalVisible: false
                        })
                        this.getData() // 更新应用入口列表
                        notification.notice({
                            id: 'updateSuccess',
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${action}${this.operaTarget}${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }

    handleDelete = (id, name) => {
        const { intl } = this.props
        const title = `${intl.formatMessage({ id: 'Delete' })}${intl.formatMessage({ id: 'ApplicationPort' })}`
        Modal.error({
            title,
            content: intl.formatMessage({ id: 'IsSureToDeleteAppPort' }),
            onOk: () => {
                HuayunRequest(api.deleteApplicationGateway, { id }, {
                    success: () => {
                        this.getData() // 更新应用入口列表
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${title} - ${name} ${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }

    render() {
        const { intl, detail } = this.props
        const { dataList, isFetching, isManageAppPortModalVisible, currentPortId } = this.state

        return (
            <div id="appPortalManage">
                {
                    isFetching ? (<Loading />) : null
                }
                <div className='header'>
                    <div className='title activeBefore'>{intl.formatMessage({ id: 'ApplicationPort' })}</div>
                    <Button type='text' onClick={() => this.manageAppPort()}>
                        <Icon type="add" />&nbsp;{`${intl.formatMessage({ id: 'Create' })}${intl.formatMessage({ id: 'ApplicationPort' })}`}
                    </Button>
                </div>
                <div className='content'>
                    {
                        dataList.length ? dataList.map(({ id, name, description, resourceObjectName, addressList }) => {
                            return (
                                <div className='dataItem' key={id}>
                                    <Icon type='error' className='closeIcon' onClick={() => this.handleDelete(id, name)}></Icon>
                                    <div className='header'>
                                        <div className='portName'>{name}</div>
                                        <div className='des'>
                                            <span>{description}</span>
                                            <Button type='text' onClick={() => this.manageAppPort(id)}>
                                                <Icon type="edit" />&nbsp;{intl.formatMessage({ id: 'Update' })}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className='body'>
                                        <div>对象：{resourceObjectName}</div>
                                        <div className='addressList'>
                                            {
                                                (addressList || []).map(item => {
                                                    return <TagItem type='primary' size='small' name={item} className='addressItem' />
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : <NoData></NoData>
                    }
                </div>
                <Modal
                    title={`${intl.formatMessage({ id: currentPortId ? 'Update' : 'Create' })}${this.operaTarget}`}
                    className='createAppPortDialog'
                    visible={isManageAppPortModalVisible}
                    onCancel={() => this.setState({
                        isManageAppPortModalVisible: false
                    })}
                    onOk={this.handleManageAppPortSubmit}
                    className='createAppPortDialog'
                    destroyOnClose={true}
                >
                    <CreateAppPort
                        id={currentPortId}
                        dataList={dataList}
                        detail={detail}
                        intl={intl}
                        wrappedComponentRef={(node) => { this.$CreateAppPort = node }}
                    />
                </Modal>
            </div >
        )
    }
}

export default AppPortalManage
