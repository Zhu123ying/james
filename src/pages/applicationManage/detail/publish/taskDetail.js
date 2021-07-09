/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Icon, Loading, SortTable, Dialog, Radio, Input, KeyValue, Button, Notification } from 'ultraui'
import './index.less'
import HuayunRequest from '~/http/request'
import { application as api } from '~/http/api'
import DetailDrawer from '~/components/DetailDrawer'
import { Collapse, Modal, Select, Popover } from 'huayunui'
import { Steps } from 'antd'
import { DEFAULT_EMPTY_LABEL, ApplicationPublishTaskStatuList } from '~/constants'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import ManageTaskNode from './manageTaskNode'
import NodeResource from './nodeResource'

const { Step } = Steps
const _ = window._
const { Panel } = Collapse;
const notification = Notification.newInstance()
const taskNodeStateColor = {
    success: 'text-success',
    fail: 'text-danger',
    config: 'text-warning'
}
class TaskDetail extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired,
    }
    constructor(props) {
        super(props)
        this.state = {
            taskDetail: {}, // 任务基础信息
            taskNodeList: [],
            isFetching: false,
            isManageTaskNodeModalVisible: false, // 任务节点的添加和编辑modal
            manageTaskNodeType: 'Create', // 添加还是编辑
            modal_TaskNodeList: [], // 创建、编辑任务节点的左侧节点数据
            modal_CurrentTaskNode: {}, // 创建、编辑任务节点的右侧节点详情
            isSeeCurrentNodeResourceModalVisible: false, // 查看当前节点资源
            currentTaskNode: {}, // 当前查看的任务节点，用于查看节点的资源对象
        }
    }
    componentWillReceiveProps({ currentTask, visible }) {
        if (currentTask.id !== this.props.currentTask.id) {
            currentTask.id && this.getDetail(currentTask.id)
        }
    }
    getDetail = (id) => {
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.queryApplicationReleaseTaskNodes, { id }, {
            success: (res) => {
                const { applicationReleaseTaskNodes, applicationReleaseTaskDetail } = res.data
                this.setState({
                    taskDetail: applicationReleaseTaskDetail,
                    taskNodeList: applicationReleaseTaskNodes
                })
            },
            complete: () => {
                this.setState({
                    isFetching: false
                })
            }
        })
    }
    handleStartPublish = () => {
        const { intl, currentTask: { id: taskId } } = this.props
        const content = intl.formatMessage({ id: 'StartPublish' })
        Modal.warning({
            content: `确认${content} ？`,
            onOk: () => {
                HuayunRequest(api.releaseTask, { taskId }, {
                    success: (res) => {
                        this.getDetail(taskId)
                        notification.notice({
                            id: new Date(),
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
    // 取消发布任务
    handleCancelPublish = (id) => {
        const { intl } = this.props
        const content = intl.formatMessage({ id: 'CancelPublish' })
        Modal.warning({
            content: `确认${content} ？`,
            onOk: () => {
                HuayunRequest(api.cancelApplicationReleaseTask, { id }, {
                    success: (res) => {
                        this.getDetail(id)
                        notification.notice({
                            id: new Date(),
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
    // 任务回滚
    handleRollback = (id) => {
        const { intl } = this.props
        const content = intl.formatMessage({ id: 'RollBack' })
        Modal.warning({
            content: `确认${content} ？`,
            onOk: () => {
                HuayunRequest(api.roolbackApplicationReleaseTask, { id }, {
                    success: (res) => {
                        this.getDetail(id)
                        notification.notice({
                            id: new Date(),
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
    handleSeeNodeResourceInfo = (item) => {
        this.setState({
            currentTaskNode: item,
            isSeeCurrentNodeResourceModalVisible: true
        })

    }
    handleDeleteTaskNode = (id, name) => {
        const { intl, currentTask } = this.props
        const content = `${intl.formatMessage({ id: 'Task' })}${intl.formatMessage({ id: 'Node' })}`
        Modal.error({
            content: `${intl.formatMessage({ id: 'IsSureToDelete' }, { name: `${content} - ${name}` })}`,
            onOk: () => {
                HuayunRequest(api.deleteApplicationReleaseTaskNode, { id }, {
                    success: (res) => {
                        this.getDetail(currentTask.id)
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${intl.formatMessage({ id: 'Delete' })}${content}${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    handleExcuteTaskNode = (name, taskNodeId) => {
        const { intl, currentTask: { id } } = this.props
        const params = {
            taskId: id,
            taskNodeId
        }
        Modal.warning({
            content: `您确认${intl.formatMessage({ id: 'ExcuteTaskNode' })} - ${name} 吗？`,
            onOk: () => {
                HuayunRequest(api.executeTaskNode, params, {
                    success: (res) => {
                        this.getDetail(id)
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${intl.formatMessage({ id: 'ExcuteTaskNode' })}${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    renderTaskNodeSatePopover = (result) => {
        return result
    }
    renderStep = (item, index) => {
        const { intl } = this.props
        const { taskNodeList, taskDetail: { currentNode } } = this.state
        const { name, resourceInfo, state, startTime, finishTime } = item
        const nameObj = {
            title: intl.formatMessage({ id: 'Node' }),
            value: name
        }
        const resourceInfoObj = {
            title: intl.formatMessage({ id: 'ResourceObject' }),
            value: (
                <div className='resourceInfo'>
                    {resourceInfo.length}&nbsp;
                    <Popover
                        placement="top"
                        content={<div>{intl.formatMessage({ id: 'View' })}</div>}
                        trigger="hover"
                        type="text"
                    ><i className='iconfont icon-view' onClick={() => this.handleSeeNodeResourceInfo(item)}></i></Popover>
                </div>
            )
        }
        const stateObj = {
            title: intl.formatMessage({ id: 'Status' }),
            value: (
                <Popover title={this.renderTaskNodeSatePopover(item.result)}>
                    <span className={taskNodeStateColor[state]}>
                        {ApplicationPublishTaskStatuList[state]}
                    </span>
                </Popover>
            )
        }
        const startTimeObj = {
            title: intl.formatMessage({ id: 'StartTime' }),
            value: startTime || DEFAULT_EMPTY_LABEL
        }
        const finishTimeObj = {
            title: intl.formatMessage({ id: 'FinishTime' }),
            value: finishTime || DEFAULT_EMPTY_LABEL
        }
        const operate_add = <Icon type='add-o' onClick={() => this.handleAddTaskNode(item, index)}></Icon>  // 添加
        const operate_edit = <Icon type='edit-o' onClick={() => this.handleEditTaskNode(item, index)}></Icon> // 编辑
        const operate_delete = <Icon type='empty' onClick={() => this.handleDeleteTaskNode(item.id, item.name)}></Icon> // 删除
        switch (index) {
            case 0:
                return <Step title={this.renderStepContent([nameObj, resourceInfoObj], [operate_add], index)} icon={<Icon type='boot' />} />
                break
            case parseInt(taskNodeList.length - 1):
                return <Step title={this.renderStepContent([nameObj, resourceInfoObj], [], index)} icon={<Icon type='shutdown' />} />
                break
            default:
                return <Step title={this.renderStepContent([nameObj, resourceInfoObj, stateObj], [operate_add, operate_edit, operate_delete], index)} icon={<Icon type='connection' />} className='middleNode' />
                break
        }
    }
    renderStepContent = (data, operaOptions = [], nodeIndex = 0) => {
        const { taskNodeList, taskDetail: { state, currentNode } } = this.state
        const { id, name, state: nodeState } = taskNodeList[nodeIndex]
        const isExcuteable = _.get(taskNodeList, `${parseInt(nodeIndex - 1)}.name`, '') === currentNode
        return (
            <div className='stepContent'>
                <div className='keyValues'>
                    {
                        data.map(({ title, value }) => {
                            return (
                                <div className='valueItem' key={title}>
                                    <div className='value'>{value}</div>
                                    <div className='title'>{title}</div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='operaGroup'>
                    {
                        // 任务状态为config才有
                        state === 'config' ? operaOptions : null
                    }
                    {
                        // 任务状态为releasing，上一个节点为当前执行的节点，节点状态为config，有执行按钮
                        state === 'releasing' && nodeState === 'config' && isExcuteable ? (
                            // 执行节点
                            <Icon type='boot' onClick={() => this.handleExcuteTaskNode(name, id)}></Icon>
                        ) : null
                    }
                </div>
            </div>
        )
    }
    // 添加节点
    handleAddTaskNode = (item, index) => {
        const { currentTask } = this.props
        const { taskNodeList } = this.state
        const firstNode = taskNodeList[0]
        const lastNode = taskNodeList[taskNodeList.length - 1]
        const isMiddleNode = (index > 0) && (index < taskNodeList.length - 1)
        this.setState({
            isManageTaskNodeModalVisible: true, // 任务节点的添加和编辑modal
            manageTaskNodeType: 'Create', // 添加还是编辑
            modal_TaskNodeList: isMiddleNode ? [firstNode, item, lastNode] : [firstNode, lastNode],
            modal_CurrentTaskNode: {
                applicationReleaseTaskId: currentTask.id,
                previousTaskNode: taskNodeList[index].id,
                nextTaskNode: taskNodeList[index + 1].id,
                resourceInfo: [],
            }
        })
    }
    // 编辑节点
    handleEditTaskNode = (item, index) => {
        const { currentTask } = this.props
        const { taskNodeList } = this.state
        const firstNode = taskNodeList[0]
        const lastNode = taskNodeList[taskNodeList.length - 1]
        const isMiddleNode = (index > 1) && (index < taskNodeList.length - 1)
        this.setState({
            isManageTaskNodeModalVisible: true, // 任务节点的添加和编辑modal
            manageTaskNodeType: 'Update', // 添加还是编辑
            modal_TaskNodeList: isMiddleNode ? [firstNode, taskNodeList[index - 1], lastNode] : [firstNode, lastNode],
            modal_CurrentTaskNode: item
        })
    }
    handleConfirmManage = () => {
        const { currentTask, intl } = this.props
        const { currentTaskNode } = this.$ManageTaskNode.state
        const content = `${intl.formatMessage({ id: currentTaskNode.id ? 'Update' : 'Create' })}${intl.formatMessage({ id: 'TaskNode' })}`
        const urlType = currentTaskNode.id ? 'updateApplicationReleaseTaskNode' : 'createApplicationReleaseTaskNode'
        HuayunRequest(api[urlType], currentTaskNode, {
            success: (res) => {
                this.setState({
                    isManageTaskNodeModalVisible: false
                })
                this.getDetail(currentTask.id)
                notification.notice({
                    id: new Date(),
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
    render() {
        const { intl, detail, onClose, visible, currentTask, handleUpdatePublishTask } = this.props
        const { taskNodeList, isFetching, taskDetail, isManageTaskNodeModalVisible, manageTaskNodeType, modal_TaskNodeList, modal_CurrentTaskNode, isSeeCurrentNodeResourceModalVisible, currentTaskNode } = this.state
        const { id, name, state, startTime, finishTime, createTime, createrName, description, currentNode } = taskDetail
        const basicInfor = [
            {
                label: intl.formatMessage({ id: 'TaskName' }),
                value: (
                    <Button type='text' onClick={() => handleUpdatePublishTask(currentTask)}>
                        {name}&nbsp;<Icon type='edit' />
                    </Button>
                )
            },
            {
                label: intl.formatMessage({ id: 'StartTime' }),
                value: startTime
            },
            {
                label: intl.formatMessage({ id: 'TaskState' }),
                value: ApplicationPublishTaskStatuList[state] || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'FinishTime' }),
                value: finishTime
            },
            {
                label: intl.formatMessage({ id: 'CreaterName' }),
                value: createrName
            },
            {
                label: intl.formatMessage({ id: 'CreateTime' }),
                value: createTime
            },
            {
                label: intl.formatMessage({ id: 'InitialApplicationVersion' }),
                value: detail.reversionNum
            },
            {
                label: intl.formatMessage({ id: 'CurrentNode' }),
                value: currentNode
            },
            {
                label: intl.formatMessage({ id: 'TaskDescription' }),
                value: description
            }
        ]
        const operaOptions = [
            <Button className='operaItem' type='text' onClick={() => this.handleStartPublish()} disabled={state !== 'config' ? true : false}>
                <Icon type="boot" />&nbsp;{intl.formatMessage({ id: 'StartPublish' })}
            </Button>,
            <Button className='operaItem' type='text' onClick={() => this.handleCancelPublish(id)} disabled={state !== 'releasing' ? true : false}>
                <Icon type="error-o" />&nbsp;{intl.formatMessage({ id: 'CancelPublish' })}
            </Button>,
            <Button className='operaItem' type='text' onClick={() => this.handleRollback(id)} disabled={state !== 'fail' ? true : false}>
                <Icon type="synchro" />&nbsp;{intl.formatMessage({ id: 'RollBack' })}
            </Button>,
        ]
        return (
            <DetailDrawer
                name={name}
                onRefresh={() => this.getDetail(id)}
                onClose={onClose}
                visible={visible}
                icon="done"
            >
                {
                    isFetching ? <Loading /> : null
                }
                <div className='taskDetailDrawerContent'>
                    <div className='operaBar'>
                        {
                            operaOptions.map((item, index) => {
                                return <ActionAuth action={actions.AdminApplicationCenterApplicationMaintain} key={index}>{item}</ActionAuth>
                            })
                        }
                    </div>
                    <Collapse defaultActiveKey={['BasicInfo', 'TaskDetail']} >
                        <Panel header={intl.formatMessage({ id: 'BasicInfo' })} key='BasicInfo'>
                            <KeyValue values={basicInfor} className='basicInfo' />
                        </Panel>
                        <Panel header={intl.formatMessage({ id: 'TaskDetail' })} key='TaskDetail'>
                            <Steps direction="vertical" className='taskDetail'>
                                {
                                    taskNodeList.map((item, index) => {
                                        return this.renderStep(item, index)
                                    })
                                }
                            </Steps>
                        </Panel>
                    </Collapse>
                </div>
                <Modal
                    visible={isManageTaskNodeModalVisible}
                    title={`${intl.formatMessage({ id: manageTaskNodeType })}${intl.formatMessage({ id: 'Node' })}`}
                    onOk={this.handleConfirmManage}
                    onCancel={() => {
                        this.setState({
                            isManageTaskNodeModalVisible: false
                        })
                    }}
                    className='manageTaskNodeModal'
                    destroyOnClose={true}>
                    <ManageTaskNode
                        intl={intl}
                        taskNodeList={modal_TaskNodeList}
                        currentTaskNode={modal_CurrentTaskNode}
                        ref={node => this.$ManageTaskNode = node}></ManageTaskNode>
                </Modal>
                <Modal
                    visible={isSeeCurrentNodeResourceModalVisible}
                    title='当前节点资源'
                    onCancel={() => {
                        this.setState({
                            isSeeCurrentNodeResourceModalVisible: false
                        })
                    }}
                    cancelText='知道了'
                    width={616}
                    className='nodeResourceModal'
                    destroyOnClose={true}>
                    <NodeResource
                        intl={intl}
                        tableData={_.get(currentTaskNode, 'resourceInfo', [])}
                        ref={node => this.$NodeResource = node}></NodeResource>
                </Modal>
            </DetailDrawer >
        )
    }
}

export default TaskDetail
