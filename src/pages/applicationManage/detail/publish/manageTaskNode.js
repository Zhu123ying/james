/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Notification, Loading } from 'ultraui'
import { Button, Collapse, Table, Checkbox, Modal, Input } from 'huayunui'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import './index.less'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import { formatChartValues } from '~/pages/utils'
import YamlTextArea from './addResourceManually'
const _ = window._
const { Panel } = Collapse;
const { TextArea } = Input
const notification = Notification.newInstance()
class ManageTaskNode extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired,
    }
    constructor(props) {
        super(props)
        const { taskNodeList, currentTaskNode } = props
        this.state = {
            taskNodeList, // 左侧的节点集合
            currentTaskNode, // 右侧的节点对象
            leftPartSelectedRowObject: {}, // 左侧选中的Keys,根据表格分类
            rightPartSelectedRow: [], // 右侧选中的资源对象集合
            currentResource: {}, // 右侧当前选中的资源对象
            isAddResourceManuallyModalShow: false, // 手动添加资源的modal
            isRightBatchSelectChecked: false, // 右侧的批量选中checkbox
        }
    }
    componentDidMount() {
        // 如果是编辑，则设置初始化选中的资源
        const { currentTaskNode: { id, resourceInfo } } = this.props
        id && this.handleSelectRightResourceItem(resourceInfo[0])
    }
    renderPanelTitle = (index) => {
        const { intl } = this.props
        const { taskNodeList } = this.state
        switch (index) {
            case 0:
                return intl.formatMessage({ id: 'InitialNodeResource' })
                break
            case parseInt(taskNodeList.length - 1):
                return intl.formatMessage({ id: 'TargetNodeResource' })
                break
            default:
                return intl.formatMessage({ id: 'PreviousNodeResource' })
                break
        }
    }
    renderLeftPanelHeader = (nodeId, index) => {
        const { intl } = this.props
        const { leftPartSelectedRowObject } = this.state
        return (
            <div className='panelHeader'>
                <div className='panelTitle'>{this.renderPanelTitle(index)}</div>
                <Button
                    disabled={!(leftPartSelectedRowObject[nodeId] || []).length}
                    onClick={(e) => this.handleAddResource(e, nodeId)}
                    type="link"
                    name={<div><Icon type='add' />{intl.formatMessage({ id: 'Add' })}</div>}
                    href="#" />
            </div>
        )
    }
    // 右侧的checkbox的全选
    handleBatchSelect = (e) => {
        const isChecked = e.target.checked
        const { rightPartSelectedRow, currentTaskNode } = this.state
        const resourceInfo = _.get(currentTaskNode, 'resourceInfo', [])
        this.setState({
            rightPartSelectedRow: isChecked ? [...resourceInfo] : [],
            isRightBatchSelectChecked: isChecked
        })
    }
    // 右侧checkbox点击选中，将数据插入rightPartSelectedRow
    handleRightBoxSelectChange = (record) => {
        let { rightPartSelectedRow } = this.state
        const index = rightPartSelectedRow.findIndex(item => {
            return item.id === record.id
        })
        if (index > -1) {
            rightPartSelectedRow.splice(index, 1)
        } else {
            rightPartSelectedRow.push(record)
        }
        this.setState({
            rightPartSelectedRow
        })
    }
    renderRightBoxHeader = () => {
        const { intl } = this.props
        const { currentTaskNode, rightPartSelectedRow, isRightBatchSelectChecked } = this.state
        const resourceInfo = _.get(currentTaskNode, 'resourceInfo', [])
        return (
            <div className='panelHeader'>
                <div className='panelTitle'>
                    <Checkbox onChange={this.handleBatchSelect} disabled={!resourceInfo.length} checked={isRightBatchSelectChecked} />
                    &nbsp;{intl.formatMessage({ id: 'CurrentNodeResource' })}
                </div>
                <div className='operaGroup'>
                    <Button
                        onClick={() => this.handleSetState('isAddResourceManuallyModalShow', true)}
                        type="link"
                        name={<div><Icon type='add' />{intl.formatMessage({ id: 'AddManually' })}</div>}
                        href="#" />
                    <Button
                        onClick={this.handleDeleteResource}
                        type="link"
                        disabled={!rightPartSelectedRow.length}
                        name={<div><Icon type='empty' />{intl.formatMessage({ id: 'Delete' })}</div>}
                        href="#" />
                </div>
            </div>
        )
    }
    handleAddResource = (e, nodeId) => {
        e.stopPropagation()
        // 将左侧的资源对象插入到右侧
        let { leftPartSelectedRowObject, currentTaskNode } = this.state
        let { resourceInfo } = currentTaskNode
        let itemsToPush = [] // 要插入的资源对象集合
        // 过滤已有的资源
        leftPartSelectedRowObject[nodeId].forEach(item => {
            let f = resourceInfo.find(item_ => item_.id === item.id)
            if (!f) {
                itemsToPush.push(item)
            }
        })
        this.setState({
            currentTaskNode: {
                ...currentTaskNode,
                resourceInfo: [...currentTaskNode.resourceInfo, ...itemsToPush]
            }
        }, () => {
            this.handleSelectRightResourceItem(this.state.currentTaskNode.resourceInfo[0])
        })
    }
    // 删除右侧当前资源里的资源
    handleDeleteResource = () => {
        let { rightPartSelectedRow, currentTaskNode, currentResource } = this.state
        let isDeletedCurrentResource = false
        rightPartSelectedRow.forEach(item => {
            let index = currentTaskNode.resourceInfo.findIndex(item_ => item.id === item_.id)
            currentTaskNode.resourceInfo.splice(index, 1)
            if (currentResource.id === item.id) {
                isDeletedCurrentResource = true
            }
        })
        this.setState({
            rightPartSelectedRow: [],
            currentTaskNode: { ...currentTaskNode },
            isRightBatchSelectChecked: false,
        }, () => {
            // 如果被删除的资源包含当前激活的资源，则要重置当前的currentResource
            isDeletedCurrentResource && this.handleSelectRightResourceItem(this.state.currentTaskNode.resourceInfo[0])
        })
    }
    getTableColumns = () => {
        const { intl } = this.props
        return [
            {
                key: 'name',
                dataIndex: 'name',
                title: intl.formatMessage({ id: 'Name' }),
                render: (val) => val || DEFAULT_EMPTY_LABEL,
                width: '50%'
            },
            {
                key: 'kind',
                dataIndex: 'kind',
                title: intl.formatMessage({ id: 'Type' }),
                render: (val) => val || DEFAULT_EMPTY_LABEL,
                width: '25%'
            },
            {
                key: 'num',
                dataIndex: 'num',
                title: intl.formatMessage({ id: 'NumberOfCopies' }),
                render: (val) => val || DEFAULT_EMPTY_LABEL,
                width: '80px',
                width: '25%'
            }
        ]
    }
    onSelectChange = (nodeId, keys, items) => {
        let { leftPartSelectedRowObject } = this.state
        leftPartSelectedRowObject[nodeId] = items
        this.setState({
            leftPartSelectedRowObject: { ...leftPartSelectedRowObject }
        })
    }
    // 右侧资源对象被选中
    handleSelectRightResourceItem = (item) => {
        this.setState({
            currentResource: item || {}
        })
    }
    // 右侧checkout的选中状态
    getRightBoxCheckProp = (row) => {
        const { rightPartSelectedRow } = this.state
        const f = rightPartSelectedRow.find(item => item.id === row.id)
        return !!f
    }
    handleValidYaml = (yamlinfo) => {
        const { intl } = this.props
        HuayunRequest(api.verifyResourceInfo, { yamlinfo }, {
            success: (res) => {
                notification.notice({
                    id: new Date(),
                    type: 'success',
                    title: intl.formatMessage({ id: 'Success' }),
                    content: `${intl.formatMessage({ id: 'Validate' })}${intl.formatMessage({ id: 'Success' })}`,
                    iconNode: 'icon-success-o',
                    duration: 5,
                    closable: true
                })
            }
        })
    }
    handleSetState = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    // 手动添加资源对象
    handleConfirmManuallyAddResource = () => {
        const { intl } = this.props
        const { yamlinfo } = this.$YamlTextArea.state
        HuayunRequest(api.verifyResourceInfo, { yamlinfo }, {
            success: (res) => {
                let { currentTaskNode } = this.state
                currentTaskNode.resourceInfo.push(res.data)
                this.setState({
                    currentTaskNode: { ...currentTaskNode },
                    isAddResourceManuallyModalShow: false
                })
            }
        })
    }
    render() {
        const { intl } = this.props
        const { taskNodeList, currentTaskNode, leftPartSelectedRowObject, rightPartSelectedRow, currentResource, isAddResourceManuallyModalShow } = this.state
        const resourceInfo = _.get(currentTaskNode, 'resourceInfo', [])
        return (
            <React.Fragment>
                <div className='header'>
                    <span className='title'>{intl.formatMessage({ id: 'SelectResource' })}</span>
                    <Button type="link" name={<Icon type='info-o' />} href="#" />
                </div>
                <div className='body'>
                    <div className='boxItem'>
                        <Collapse defaultActiveKey={[this.renderPanelTitle(0)]}>
                            {
                                taskNodeList.map(({ id: nodeId, resourceInfo }, index) => {
                                    const header = this.renderLeftPanelHeader(nodeId, index)
                                    const title = this.renderPanelTitle(index)
                                    return (
                                        <Panel header={header} key={title}>
                                            <Table
                                                columns={this.getTableColumns()}
                                                dataSource={resourceInfo || []}
                                                pagination={false}
                                                rowSelection={{
                                                    selectedRowKeys: (leftPartSelectedRowObject[nodeId] || []).map(item => item.id),
                                                    onChange: (keys, items) => this.onSelectChange(nodeId, keys, items),
                                                    getCheckboxProps: (record) => {
                                                        let f = currentTaskNode.resourceInfo.find(item => {
                                                            return item.id === record.id
                                                        })
                                                        return {
                                                            disabled: !!f
                                                        }
                                                    }
                                                }}
                                                rowKey='id'
                                            />
                                        </Panel>
                                    )
                                })
                            }
                        </Collapse>
                    </div>
                    <div className='boxItem'>
                        {this.renderRightBoxHeader()}
                        <div className='content'>
                            <div className='currentNodeResourceList'>
                                {
                                    resourceInfo.map(item => {
                                        return (
                                            <div className={`resourceItem ${currentResource.id === item.id ? 'activeBefore' : ''}`} onClick={() => this.handleSelectRightResourceItem(item)}>
                                                <Checkbox onChange={() => this.handleRightBoxSelectChange(item)} checked={this.getRightBoxCheckProp(item)} />
                                                &nbsp;{item.name}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='yamlValue'>
                                <div className='title'>详细声明</div>
                                <TextArea className="yamlContent" value={currentResource.config}></TextArea>
                                {/* <div className="yamlContent" dangerouslySetInnerHTML={{ __html: formatChartValues(currentResource.config) }}></div> */}
                                <Button
                                    type='operate'
                                    name={intl.formatMessage({ id: 'Validate' })}
                                    onClick={() => this.handleValidYaml(currentResource.config)} />
                            </div>
                        </div>
                    </div>
                    <Modal
                        visible={isAddResourceManuallyModalShow}
                        title='新增资源对象声明'
                        className='addResourceManuallyModal'
                        onCancel={() => this.handleSetState('isAddResourceManuallyModalShow', false)}
                        onOk={this.handleConfirmManuallyAddResource}>
                        <YamlTextArea ref={node => this.$YamlTextArea = node} />
                    </Modal>
                </div>
            </React.Fragment >
        )
    }
}

export default ManageTaskNode
