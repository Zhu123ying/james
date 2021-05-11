/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, SearchBar, Button, Table, Modal } from 'huayunui';
import { Icon, NoData } from 'ultraui'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import { DEFULT_PAGE_SIZE } from '~/constants'
import ManageTask from './manageTask'
class Publish extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            tableData: [],
            loading: false,
            pageNumber: 1,
            pageSize: window.PageSize || DEFULT_PAGE_SIZE,
            total: 0,
            isTaskModalVisible: false, // 创建编辑的modal
            currentTask: {}, // 当前task
        }
    }
    componentDidMount() {
        this.handleRefresh()
    }
    handlePageChange = (pageNumber, pageSize) => {
        this.setState({
            pageNumber, pageSize
        }, () => {
            this.handleRefresh()
        })
    }
    handleRefresh = () => {
        const { detail } = this.props
        this.setState({
            loading: true
        })
        HuayunRequest(api.queryApplicationReleaseTasks, { applicationId: detail.id }, {
            success: (res) => {
                this.setState({
                    tableData: res.data
                })
            },
            complete: () => {
                this.setState({
                    loading: false
                })
            }
        })
    }
    handleTableChange = (type, { name }) => {
        this.setState({
            name
        }, () => {
            this.handleRefresh()
        })
    }
    handleUpdatePublishTask = () => {

    }
    getColums = () => {
        const { intl } = this.props
        return [
            {
                dataIndex: 'name',
                key: 'name',
                title: intl.formatMessage({ id: 'TaskName' }),
            },
            {
                dataIndex: 'state',
                key: 'state',
                title: intl.formatMessage({ id: 'TaskState' }),
            },
            {
                dataIndex: 'createBy',
                key: 'createBy',
                title: intl.formatMessage({ id: 'CreaterName' }),
            },
            {
                dataIndex: 'startTime',
                key: 'startTime',
                title: intl.formatMessage({ id: 'StartTime' }),
            },
            {
                dataIndex: 'finishTime',
                key: 'finishTime',
                title: intl.formatMessage({ id: 'FinishTime' }),
            },
            {
                dataIndex: 'createTime',
                key: 'createTime',
                title: intl.formatMessage({ id: 'CreateTime' }),
            },
            {
                dataIndex: 'operate',
                key: 'operate',
                title: intl.formatMessage({ id: 'Operate' }),
            }
        ]
    }
    handleConfirmManage = () => {
        const { intl, detail: { id: applicationId } } = this.props
        this.$ManageTask.props.form.validateFields((error, values) => {
            if (error) {
                return false
            }
            const { configInfo: endVersionValue, versionId: endVersionId } = this.$ManageTask.state
            let params = {
                applicationId, endVersionValue, endVersionId
            }
            HuayunRequest(api.createApplicationReleaseTask, params, {
                success: (res) => {
                    notification.notice({
                        id: new Date(),
                        type: 'success',
                        title: intl.formatMessage({ id: 'Success' }),
                        content: `${intl.formatMessage({ id: 'Operate' })}${intl.formatMessage({ id: 'Success' })}`,
                        iconNode: 'icon-success-o',
                        duration: 5,
                        closable: true
                    })
                    this.setState({
                        isTaskModalVisible: false
                    })
                    this.handleRefresh()
                }
            })
        })
    }
    render() {
        const { intl } = this.props
        const { name, tableData, loading, pageNumber, pageSize, total, isTaskModalVisible, currentTask } = this.state
        const pagination = {
            pageNumber,
            pageSize,
            total,
            onChange: this.handlePageChange
        }
        const action = currentTask.id ? 'Update' : 'Create'
        return (
            <div className='applicationDetail_publish'>
                <SearchBar
                    slot={() => (
                        <Button
                            type="operate"
                            icon={<Icon type="add" />}
                            onClick={() => {
                                this.setState({
                                    isTaskModalVisible: true
                                })
                            }}
                            name="新建发布任务"
                        />
                    )}
                    params={{
                        '名称 ': name
                    }}
                    searchOption={{
                        key: 'name',
                        title: intl.formatMessage({ id: 'Name' }),
                    }}
                    onRefresh={this.handleRefresh}
                    onChange={this.handleTableChange}
                />
                <Table
                    pagination={pagination}
                    dataSource={tableData}
                    columns={this.getColums()}
                    loading={loading}
                    emptyText={<NoData />}
                ></Table>
                <Modal
                    title={`${intl.formatMessage({ id: action })}${intl.formatMessage({ id: 'Task' })}`}
                    visible={isTaskModalVisible}
                    onOk={this.handleConfirmManage}
                    onCancel={() => this.setState({
                        isTaskModalVisible: false
                    })}
                    className='manageTaskModal'
                    destroyOnClose={true}
                >
                    <ManageTask
                        {...this.props}
                        currentTask={currentTask}
                        wrappedComponentRef={node => this.$ManageTask = node} />
                </Modal>
            </div>
        )
    }
}

export default Publish
