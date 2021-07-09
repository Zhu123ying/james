/* eslint-disable */
import React from 'react'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, SearchBar, Button, Table, Modal, Space, Checkbox, Popover, Tooltip } from 'huayunui';
import { Icon, NoData, Notification } from 'ultraui'
import './index.less'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import TableCommon from '~/components/TableCommon'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import Dropdown from '~/components/Dropdown'
import DetailIcon from '~/components/DetailIcon'

const notification = Notification.newInstance()
class Log extends React.Component {
    constructor(props) {
        super(props)
        const { intl } = props
        this.state = {
            name: '',
            pageNumber: 1,
            pageSize: 10,
            total: 0,
            isFetching: false,
            tableData: [],
            currentDataItem: {},
            isDetailModalVisible: false
        }
        this.operationTarget = intl.formatMessage({ id: 'Log' })
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
                // this.setState({
                //     tableData: res.data.datas,
                //     total: res.data.total
                // })
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
                dataIndex: 'projectName',
                key: 'projectName',
                title: '容量上限(Gi)'
            },
            {
                dataIndex: 'versionCount',
                key: 'versionCount',
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
                                onClick={() => this.handleDelete([data.id])}
                            />
                        </ActionAuth>
                    )
                }
            }
        ]
    }
    handleDelete = (ids) => {
        const { intl, projectId } = this.props
        const action = intl.formatMessage({ id: 'Delete' })
        Modal.error({
            content: `${intl.formatMessage({ id: 'IsSureToDelete' }, { name: this.operationTarget })}`,
            onOk: () => {
                HuayunRequest(api.deleteApplicationPackage, { ids }, {
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
    handleAddLog = () => {

    }
    render() {
        const { intl } = this.props
        const { name, pageNumber, pageSize, total, tableData, isFetching, currentDataItem, isDetailModalVisible } = this.state
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
                    total={total}
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
                                    onClick={() => this.handleAddLog()} />
                            </Tooltip>
                        </ActionAuth>
                    ]}
                />
            </div>
        )
    }
}

export default Log
