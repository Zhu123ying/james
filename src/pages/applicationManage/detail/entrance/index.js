/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Button, Icon, Loading, SortTable, Dialog, confirmForm } from 'ultraui'
import { Modal } from 'huayunui'
import './index.less'
import CreateAppPort from './createAppPort'
import HuayunRequest from '~/http/request'
import { application as api } from '~/http/api'

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
        const { intl, dataList, detail } = this.props
        Modal.info({
            content: (
                <CreateAppPort
                    id={id}
                    dataList={dataList}
                    detail={detail}
                    intl={intl}
                    wrappedComponentRef={(node) => { this.$CreateAppPort = node }}
                />),
            title: `${intl.formatMessage({ id: id ? 'Edit' : 'Create' })}${this.operaTarget}`,
            style: { width: '600px' },
            className: 'createAppPortDialog',
            confirm: () => {
                let valid = true
                this.$CreateAppPort.props.form.validateFields((error, values) => {
                    valid = !error
                    if (valid) {
                        const { name, description, config, portKey } = this.$CreateAppPort.state
                        const { type, resourceObjectId } = config
                        config.portKey = portKey // 这个后端不需要，但是前端编辑赋初始值的时候需要
                        const params = {
                            name, type, description, resourceObjectId, applicationId: this.id, config, id
                        }
                        // baseFetch('appCenter', `app.${id ? 'updateApplicationGateway' : 'createApplicationGateway'}`, 'post', params, {}, {
                        //     callback: (res) => {
                        //         handleResponseStatus({
                        //             type: HANDLE_RESPONSE_STATUS,
                        //             code: 200,
                        //             msg: {
                        //                 success: `${intl.formatMessage({ id: id ? 'Edit' : 'Create' })}${this.operaTarget}${intl.formatMessage({ id: 'Success' })}`
                        //             }
                        //         })
                        //         this.getData()
                        //     },
                        //     onError: (res) => {
                        //         handleResponseStatus({
                        //             type: HANDLE_RESPONSE_STATUS,
                        //             code: 200,
                        //             msg: {
                        //                 error: intl.formatMessage({ id: res.code === 400 ? res.data.errorCode : 'Internal Server Error' })
                        //             }
                        //         })
                        //     }
                        // })
                    }
                })
                return valid
            }
        })
    }

    handleDelete = (id, name) => {
        const { intl } = this.props
        // confirmForm({
        //     title: `${intl.formatMessage({ id: 'Delete' })}${intl.formatMessage({ id: 'ApplicationPort' })}`,
        //     content: `${intl.formatMessage({ id: 'IsSureToDeleteAppPort' })} - ${name}`,
        //     type: 'warning',
        //     prefixCls: 'ult',
        //     confirm: () => {
        //         baseFetch('appCenter', 'app.deleteApplicationGateway', 'post', { id }, {}, {
        //             callback: (res) => {
        //                 handleResponseStatus({
        //                     type: HANDLE_RESPONSE_STATUS,
        //                     code: 200,
        //                     msg: {
        //                         success: `${intl.formatMessage({ id: 'Delete' })}${this.operaTarget}${intl.formatMessage({ id: 'Success' })}`
        //                     }
        //                 })
        //                 this.getData()
        //             },
        //             onError: (res) => {
        //                 handleResponseStatus({
        //                     type: HANDLE_RESPONSE_STATUS,
        //                     code: 200,
        //                     msg: {
        //                         error: intl.formatMessage({ id: res.code === 400 ? res.data.errorCode : 'Internal Server Error' })
        //                     }
        //                 })
        //             }
        //         })
        //     }
        // })
    }

    render() {
        const { intl } = this.props
        const { dataList, isFetching } = this.state

        return (
            <div id="appPortalManage">
                {
                    isFetching.isFetching ? (<Loading />) : null
                }
                <Button.List>
                    <Button icon="refresh" type="default" onClick={() => { this.getData() }} />
                    <Button type='primary' onClick={() => this.manageAppPort()}>{`${intl.formatMessage({ id: 'Create' })}${this.operaTarget}`}</Button>
                </Button.List>
                <div className='dataList'>
                    {
                        dataList.map(({ id, name, description, resourceObjectName, addressList }) => {
                            return (
                                <div className='dataItem' key={id}>
                                    <div className='title'>
                                        <span>名称：{name}</span>&nbsp;&nbsp;
                                        <Button.List>
                                            <Button type="danger" onClick={() => { this.handleDelete(id, name) }} >{intl.formatMessage({ id: 'Delete' })}</Button>
                                            <Button type='primary' onClick={() => this.manageAppPort(id)}>{intl.formatMessage({ id: '::Manage' })}</Button>
                                        </Button.List>
                                    </div>
                                    <div className='itemLine'>入口描述：{description}</div>
                                    <div className='itemLine'>入口对象：{resourceObjectName}</div>
                                    {
                                        (addressList || []).join('、')
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default AppPortalManage
