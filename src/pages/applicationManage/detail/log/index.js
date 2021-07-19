/* eslint-disable */
import React from 'react'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, SearchBar, Button, Table, Modal, Space, Checkbox, Popover, Tooltip } from 'huayunui';
import { Icon, NoData, Notification } from 'ultraui'
import './index.less'
import TableCommon from '~/components/TableCommon'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import DetailIcon from '~/components/DetailIcon'
import AddLog from './addLog'
import Detail from './detail'

const notification = Notification.newInstance()
class Log extends React.Component {
    constructor(props) {
        super(props)
        const { intl } = props
        this.state = {
            name: '',
            pageNumber: 1,
            pageSize: 10,
            isFetching: false,
            totalData: [],
            currentDataItem: {},
            isDetailModalVisible: false,
            isAddLogModalVisible: false
        }
        this.operationTarget = intl.formatMessage({ id: 'Log' })
    }
    componentDidMount() {
        this.handleSearch()
    }
    handleSearch = () => {
        const { name } = this.state
        const { detail: { id: namespace } } = this.props
        const params = {
            namespace, name
        }
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.listContainerLogConfig, params, {
            success: (res) => {
                this.setState({
                    totalData: res
                })
            },
            complete: (res) => {
                this.setState({
                    isFetching: false
                })
            }
        })
    }
    getColums = () => {
        const { intl } = this.props
        return [
            {
                dataIndex: 'name',
                key: 'name',
                title: `${intl.formatMessage({ id: 'Log' })}${intl.formatMessage({ id: 'Name' })}`,
                render: (val, row) => {
                    return (
                        <>
                            <DetailIcon iconType="done" className="m-r-sm" />
                            <a onClick={() => this.handleSeeDetail(row)}>{val}</a>
                        </>
                    )
                }
            },
            {
                dataIndex: 'maxSize',
                key: 'maxSize',
                title: '容量上限(Gi)'
            },
            {
                dataIndex: 'expireTime',
                key: 'expireTime',
                title: '保存天数'
            },
            {
                dataIndex: 'action',
                key: 'operate',
                width: '13%',
                minCalcuWidth: 76,
                title: intl.formatMessage({ id: 'Operate' }),
                render: (value, data) => {
                    return (
                        <ActionAuth action={actions.AdminApplicationCenterApplicationMaintain}>
                            <Button
                                type="link"
                                name={intl.formatMessage({ id: 'Delete' })}
                                onClick={() => this.handleDelete(data.id, data.type)}
                            />
                        </ActionAuth>
                    )
                }
            }
        ]
    }
    handleDelete = (id, type) => {
        const { intl } = this.props
        const action = intl.formatMessage({ id: 'Delete' })
        Modal.error({
            content: `${intl.formatMessage({ id: 'IsSureToDelete' }, { name: this.operationTarget })}`,
            onOk: () => {
                HuayunRequest(api.deleteContainerLogConfig, { id, type }, {
                    success: (res) => {
                        this.handleSearch()
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${action}${this.operationTarget}${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    handleTableChange = ({ pageNumber, pageSize, name }) => {
        this.setState({
            pageNumber, pageSize, name
        }, () => {
            this.handleSearch()
        })
    }
    handleSeeDetail = (item) => {
        this.setState({
            currentDataItem: item,
            isDetailModalVisible: true
        })
    }
    handleChange = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    handleAddLogModalConfirm = () => {
        const { intl, detail: { id: namespace } } = this.props
        let { cascaderValue, kind, isStandardLogConfig, standardLogConfig, isServiceLogConfig, serviceLogConfig } = this.$AddLog.state
        if (!cascaderValue.length) {
            this.$AddLog.handleChange('cascaderPanelErrorMessage', '请选择容器！')
        }
        this.$AddLog.props.form.validateFields((errs, values) => {
            if (errs || !cascaderValue) {
                return
            }
            let containerName = cascaderValue.pop()
            let podName = cascaderValue.pop()
            let params = {
                kind, podName, namespace, containerName, isStandardLogConfig, standardLogConfig, isServiceLogConfig, serviceLogConfig
            }
            let content = `${intl.formatMessage({ id: 'Add' })}${intl.formatMessage({ id: 'Container' })}${intl.formatMessage({ id: 'Log' })}`
            HuayunRequest(api.confirmContainerLogConfig, params, {
                success: (res) => {
                    notification.notice({
                        id: new Date(),
                        type: 'success',
                        title: intl.formatMessage({ id: 'Success' }),
                        content: `${content}${intl.formatMessage({ id: 'Success' })}`,
                        iconNode: 'icon-success-o',
                        duration: 5,
                        closable: true
                    })
                    this.setState({
                        isAddLogModalVisible: false
                    })
                    this.handleSearch()
                }
            })
        })
    }
    render() {
        const { intl } = this.props
        const { name, pageNumber, pageSize, totalData, isFetching, currentDataItem, isDetailModalVisible, isAddLogModalVisible } = this.state
        const tableData = _.cloneDeep(totalData).splice((pageNumber - 1) * pageSize, pageSize)
        return (
            <div className='applicationDetail_log'>
                <TableCommon
                    searchOption={{
                        key: 'name',
                        title: intl.formatMessage({ id: 'Name' })
                    }}
                    params={{
                        pageNumber, pageSize, name
                    }}
                    paramsAlias={{
                        name: {
                            title: '名称'
                        }
                    }}
                    uniqueId='ApplicationCenter_Application_Detail_Log'
                    onRefresh={this.handleSearch}
                    columns={this.getColums()}
                    data={tableData}
                    checkable={false}
                    total={totalData.length}
                    onTableChange={this.handleTableChange}
                    loading={isFetching}
                    operateButtons={[
                        <ActionAuth action={actions.AdminApplicationCenterApplicationPackageOperate}>
                            <Tooltip title='新增日志'>
                                <Button
                                    className='mr8'
                                    size="middle-s"
                                    type='operate'
                                    name='新增日志'
                                    icon={<Icon type="add" />}
                                    onClick={() => this.handleChange('isAddLogModalVisible', true)} />
                            </Tooltip>
                        </ActionAuth>
                    ]}
                />
                <Modal
                    title='新增日志'
                    visible={isAddLogModalVisible}
                    onOk={this.handleAddLogModalConfirm}
                    onCancel={() => this.handleChange('isAddLogModalVisible', false)}
                    className='addLogModal'
                    destroyOnClose={true}
                    width={440}
                    getContainer={() => document.querySelector('.applicationDetail_log')}
                >
                    <AddLog
                        {...this.props}
                        wrappedComponentRef={node => this.$AddLog = node} />
                </Modal>
                <Detail
                    intl={intl}
                    currentDataItem={currentDataItem}
                    visible={isDetailModalVisible}
                    onClose={() => this.handleChange('isDetailModalVisible', false)}
                ></Detail>
            </div>
        )
    }
}

export default Log
