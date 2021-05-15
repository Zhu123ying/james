/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, SearchBar, Button, Table, Modal } from 'huayunui';
import { Icon, NoData, Notification } from 'ultraui'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import { DEFULT_PAGE_SIZE, DEFAULT_EMPTY_LABEL, ApplicationPublishTaskStatuList } from '~/constants'
import ManageTask from './manageTask'
import Dropdown from '~/components/Dropdown'
import DetailIcon from '~/components/DetailIcon'
import TaskDetail from './taskDetail'

const notification = Notification.newInstance()
class Publish extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            tableData: [],
            loading: false,
            pageNumber: 1,
            pageSize: window.PageSize || DEFULT_PAGE_SIZE,
            totalCount: 0,
            isTaskModalVisible: false, // 创建编辑的modal
            currentTask: {}, // 当前task,发布任务的编辑
            isTaskDetailDrawerVisible: false, // task详情抽屉是否显示
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
        const { name, pageNumber, pageSize } = this.state
        this.setState({
            loading: true
        })
        const params = {
            conditions: {
                applicationId: detail.id,
                name,
            },
            pagenum: pageNumber,
            pagesize: pageSize
        }
        HuayunRequest(api.queryApplicationReleaseTasks, params, {
            success: (res) => {
                this.setState({
                    tableData: res.data.datas,
                    totalCount: res.totalCount
                })
            },
            complete: () => {
                this.setState({
                    loading: false
                })
            }
        })
    }
    handleSearchParamsChange = (type, params) => {
        this.setState({
            ...this.state,
            ...params
        }, () => {
            this.handleRefresh()
        })
    }
    handleUpdatePublishTask = (data) => {
        this.setState({
            isTaskModalVisible: true,
            currentTask: data
        })
    }
    handleDeletePublishTask = ({ id, name }) => {
        const { intl } = this.props
        const content = `${intl.formatMessage({ id: 'Delete' })}${intl.formatMessage({ id: 'Task' })}`
        Modal.error({
            content: `${intl.formatMessage({ id: 'IsSureToDelete' }, { name: intl.formatMessage({ id: 'Task' }) })}`,
            onOk: () => {
                HuayunRequest(api.deleteApplicationReleaseTask, { id }, {
                    success: () => {
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${content}${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                        this.handleRefresh()
                    }
                })
            }
        })
    }
    seeDetail = (row) => {
        this.setState({
            isTaskDetailDrawerVisible: true,
            currentTask: row
        })
    }
    getColums = () => {
        const { intl } = this.props
        return [
            {
                dataIndex: 'name',
                key: 'name',
                title: intl.formatMessage({ id: 'TaskName' }),
                render: (value, row) => {
                    return (
                        <div className='nameCeil'>
                            <DetailIcon iconType="done" className="m-r-sm" />
                            <div className='ceilRight'>
                                <a className='name' onClick={() => this.seeDetail(row)}>{row.name}</a>
                                <span className='description'>{row.description}</span>
                            </div>
                        </div>
                    )
                }
            },
            {
                dataIndex: 'state',
                key: 'state',
                title: intl.formatMessage({ id: 'TaskState' }),
                render: (state, row) => {
                    return <div>{ApplicationPublishTaskStatuList[state] || DEFAULT_EMPTY_LABEL}</div>
                }
            },
            {
                dataIndex: 'createrName',
                key: 'createrName',
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
                render: (id, data) => {
                    const options = [
                        {
                            name: intl.formatMessage({ id: 'Manage' }),
                            callback: () => {
                                this.seeDetail(data)
                            }
                        },
                        {
                            name: intl.formatMessage({ id: 'Delete' }),
                            callback: () => {
                                this.handleDeletePublishTask(data)
                            }
                        }
                    ]
                    return (
                        <ActionAuth action={actions.AdminApplicationCenterApplicationOperate}>
                            <Dropdown options={options} placement='bottomRight' />
                        </ActionAuth>
                    )
                }
            }
        ]
    }
    handleConfirmManage = () => {
        const { intl, detail: { id: applicationId } } = this.props
        this.$ManageTask.props.form.validateFields((error, values) => {
            if (error) {
                return false
            }
            const { configInfo: endVersionValue, versionId: endVersionId, name, description, id } = this.$ManageTask.state
            const urlType = id ? 'updateApplicationReleaseTask' : 'createApplicationReleaseTask'
            let params = id ? {
                id, name, description
            } : {
                name, description, applicationId, endVersionValue, endVersionId
            }
            HuayunRequest(api[urlType], params, {
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
                    // 如果是编辑，则要刷新抽屉，目前编辑的入口只有抽屉有
                    id && this.$TaskDetail.getDetail(id)
                }
            })
        })
    }
    handleSetState = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    render() {
        const { intl, detail } = this.props
        const { name, tableData, loading, pageNumber, pageSize, totalCount, isTaskModalVisible, currentTask, isTaskDetailDrawerVisible } = this.state
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
                                    isTaskModalVisible: true,
                                    currentTask: {}
                                })
                            }}
                            name="新建发布任务"
                        />
                    )}
                    params={{
                        name
                    }}
                    paramsAlias={{
                        name: {
                            title: '名称'
                        }
                    }}
                    searchOption={{
                        key: 'name',
                        title: intl.formatMessage({ id: 'Name' }),
                    }}
                    onRefresh={this.handleRefresh}
                    onChange={this.handleSearchParamsChange}
                />
                <Table
                    pagination={{
                        pageNumber,
                        pageSize,
                        totalCount
                    }}
                    onChange={this.handleSearchParamsChange}
                    dataSource={tableData}
                    columns={this.getColums()}
                    loading={loading}
                    emptyText={<NoData />}
                ></Table>
                <Modal
                    title={`${intl.formatMessage({ id: action })}${intl.formatMessage({ id: 'Task' })}`}
                    visible={isTaskModalVisible}
                    onOk={this.handleConfirmManage}
                    onCancel={() => this.handleSetState('isTaskModalVisible', false)}
                    className='manageTaskModal'
                    destroyOnClose={true}
                >
                    <ManageTask
                        {...this.props}
                        currentTask={currentTask}
                        wrappedComponentRef={node => this.$ManageTask = node} />
                </Modal>
                <TaskDetail
                    intl={intl}
                    detail={detail}
                    currentTask={currentTask}
                    handleUpdatePublishTask={this.handleUpdatePublishTask}
                    visible={isTaskDetailDrawerVisible}
                    onClose={() => this.setState({
                        isTaskDetailDrawerVisible: false
                    })}
                    ref={node => this.$TaskDetail = node}
                ></TaskDetail>
            </div>
        )
    }
}

export default Publish
