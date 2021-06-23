/* eslint-disable */
import React from 'react'
import { RcForm, Icon, Loading, SortTable, Dialog, Radio, Input, Button as UltrauiButton, KeyValue, TagItem, InlineInput, Notification } from 'ultraui'
import './index.less'
import moment from 'moment'
import HuayunRequest from '~/http/request'
import { resource as api } from '~/http/api'
import DetailDrawer from '~/components/DetailDrawer'
import { Collapse, Select, Button, Popover, Modal, Tabs, Table } from 'huayunui'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import AddLabel from './addLabel'
import Card from '~/components/Card'

const _ = window._
const { Panel } = Collapse
const { TabPane } = Tabs
const notification = Notification.newInstance()
// 提交是更新标签，还是污点，还是备注
const urlObj = {
    labels: 'updateLabels',
    taints: 'updateTaints',
    annotations: 'updateAnnotations',
}
// modal的title
const modalTitleObj = {
    labels: '标签',
    taints: '污点',
    annotations: '备注',
}
class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,
            basicInfo: {}, // 基础信息
            stateTableData: [], // 状态表格数据
            eventTableData: [], // 事件表格数据
            isAddLableModalVisible: false, // 添加标签
            addType: '', // 区分添加的是标签、污点、备注等
        }
    }
    componentWillReceiveProps({ nodeName }) {
        nodeName && nodeName !== this.props.nodeName && this.getDetailData(nodeName)
    }
    // 获取详情数据
    getDetailData = (name = this.props.nodeName) => {
        this.getBasicDetail(name)
        // this.getNodeEvents(name)
        // this.getNodePods(name)
    }
    getBasicDetail = (name) => {
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.getNodeDetail, { name }, {
            success: (res) => {
                this.setState({
                    basicInfo: res.data
                })
            },
            complete: () => {
                this.setState({
                    isFetching: false
                })
            }
        })
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    renderLabelsLine = () => {
        const { intl } = this.props
        const { basicInfo } = this.state
        const labels = _.get(basicInfo, 'labels', {}) || {}
        return (
            <div className='tagLine'>
                <div className='opera'>
                    <Button
                        type="primary"
                        size="small"
                        icon="icon-add"
                        onClick={() => this.handleAddLabel('labels')}
                    />
                    <div className='labelList'>
                        {
                            Object.keys(labels).map((key) => {
                                return (
                                    <TagItem
                                        size='small'
                                        key={key}
                                        name={`${key}=${labels[key]}`}
                                        icon="error"
                                        onClick={() => this.handleRemoveLabel(key)}
                                        className='tagWithClose'
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
    renderTaintsLine = () => {
        const { intl } = this.props
        const { basicInfo } = this.state
        const taints = _.get(basicInfo, 'taints', []) || []
        return (
            <div className='tagLine'>
                <div className='opera'>
                    <Button
                        type="primary"
                        size="small"
                        icon="icon-add"
                        onClick={() => this.handleAddLabel('taints')}
                    />
                    <div className='labelList'>
                        {
                            taints.map(({ key, value, effect }, index) => {
                                return (
                                    <TagItem
                                        size='small'
                                        key={key}
                                        name={`${key}=${value}:${effect}`}
                                        icon="error"
                                        onClick={() => this.handleRemoveTaint(index)}
                                        className='tagWithClose'
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
    handleAddLabel = (key) => {
        this.setState({
            isAddLableModalVisible: true,
            addType: key
        })
    }
    handleAddLabelModalConfirm = () => {
        let { basicInfo, addType } = this.state
        this.$AddLabel.props.form.validateFields((error, values) => {
            if (!error) {
                const { key, value, effect } = this.$AddLabel.state
                let data
                // taints传参是数组，其他两种是对象
                if (addType === 'taints') {
                    data = _.get(basicInfo, addType, []) || []
                    data.push({ key, value, effect })
                } else {
                    data = _.get(basicInfo, addType, {}) || {}
                    data[key] = value
                }
                this.handleUpdateLables_Taints_Annotations(addType, data)
            }
        })
    }
    // 删除labels
    handleRemoveLabel = (key) => {
        let { basicInfo: { labels } } = this.state
        delete labels[key]
        this.handleUpdateLables_Taints_Annotations('labels', labels)
    }
    // 删除taints
    handleRemoveTaint = (index) => {
        let { basicInfo: { taints } } = this.state
        taints.splice(index, 1)
        this.handleUpdateLables_Taints_Annotations('taints', taints)
    }
    // 删除annotations
    handleRemoveAnnotation = (key) => {
        let { basicInfo: { annotations } } = this.state
        delete annotations[key]
        this.handleUpdateLables_Taints_Annotations('annotations', annotations)
    }
    // 提交标签和污点用同一个方法
    handleUpdateLables_Taints_Annotations = (type, data) => {
        const { nodeName: name } = this.props
        let params = {
            name,
            [type]: data
        }
        const url = urlObj[type]
        HuayunRequest(api[url], params, {
            success: (res) => {
                this.getBasicDetail(name)
                this.setState({
                    isAddLableModalVisible: false
                })
            }
        })
    }
    getTableColumns = () => {
        const { intl } = this.props
        const columns = [ // 表格的列数组配置
            {
                key: 'id',
                dataIndex: 'id',
                title: '缺陷码'
            },
            {
                key: 'package',
                dataIndex: 'package',
                title: '组件'
            },
            {
                key: 'version',
                dataIndex: 'version',
                title: '当前版本'
            },
            {
                key: 'fix_version',
                dataIndex: 'fix_version',
                title: '修复版本'
            },
        ]
        return columns
    }
    render() {
        const { intl, onClose, visible, nodeId } = this.props
        const { isFetching, basicInfo, stateTableData, eventTableData, isAddLableModalVisible, addType } = this.state
        const { name, roles, address, os, kernelVersion, labels, taints, annotations } = basicInfo
        const basicKeyValue = [
            {
                label: '主机名',
                value: name || DEFAULT_EMPTY_LABEL
            },
            {
                label: '角色',
                value: roles || DEFAULT_EMPTY_LABEL
            },
            {
                label: '地址',
                value: address || DEFAULT_EMPTY_LABEL
            },
            {
                label: 'OS',
                value: os || DEFAULT_EMPTY_LABEL
            },
            {
                label: 'Kernel Version',
                value: kernelVersion || DEFAULT_EMPTY_LABEL
            },
            {
                label: '标签',
                value: this.renderLabelsLine('labels')
            },
            {
                label: '污点',
                value: this.renderTaintsLine('taints')
            },
        ]
        return (
            <>
                <DetailDrawer
                    name={name}
                    icon='relationship'
                    onRefresh={this.getDetailData}
                    onClose={onClose}
                    visible={visible}
                    className='nodeDetailDrawer'
                >
                    {
                        isFetching ? <Loading /> : (
                            <Tabs defaultActiveKey="1">
                                <TabPane tab={intl.formatMessage({ id: 'SystemInfo' })} key="1">
                                    <Collapse defaultActiveKey={['1']} className='basicInforCollapse'>
                                        <Panel header={intl.formatMessage({ id: 'BasicInfo' })} key='1'>
                                            <KeyValue values={basicKeyValue} className='basicKeyValue' />
                                            <div className='descriptionLine'>
                                                <div className='header'>
                                                    <span>备注</span>
                                                    <UltrauiButton
                                                        type="text"
                                                        onClick={() => this.handleAddLabel('annotations')}
                                                    >
                                                        <Icon type="add" />&nbsp;新增备注
                                                    </UltrauiButton>
                                                </div>
                                                <div className='desList'>
                                                    {
                                                        Object.keys(annotations || {}).map(key => {
                                                            return (
                                                                <Card handleDelete={() => this.handleRemoveAnnotation(key)} key={key}>
                                                                    {`${key}:${annotations[key]}`}
                                                                </Card>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </Panel>
                                    </Collapse>
                                </TabPane>
                                <TabPane tab={intl.formatMessage({ id: 'ResourceMonitor' })} key="2">
                                    {/* <Collapse defaultActiveKey={['1']} className='imageLayerInfoCollapse'>
                                <Panel header={intl.formatMessage({ id: 'ImageLayerInformation' })} key='1'>
                                    {
                                        buildHistory.map(({ created, created_by }) => {
                                            return (
                                                <div className='historyItem'>
                                                    <div className='createdBy'>{created_by}</div>
                                                    <div className='createdItem'>{moment(created).format("YYYY-MM-DD HH:mm:ss")}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </Panel>
                            </Collapse> */}
                                </TabPane>
                                <TabPane tab={intl.formatMessage({ id: 'Status' })} key="3">

                                </TabPane>
                                <TabPane tab={intl.formatMessage({ id: 'Event' })} key="4">

                                </TabPane>
                                <TabPane tab={intl.formatMessage({ id: 'Network' })} key="5">

                                </TabPane>
                                <TabPane tab='pods' key="6">

                                </TabPane>
                                <TabPane tab={intl.formatMessage({ id: 'ContainerImage' })} key="7">

                                </TabPane>
                            </Tabs>
                        )
                    }
                </DetailDrawer >
                <Modal
                    title={`添加${modalTitleObj[addType]}`}
                    visible={isAddLableModalVisible}
                    onOk={this.handleAddLabelModalConfirm}
                    onCancel={() => this.handleChange('isAddLableModalVisible', false)}
                    destroyOnClose={true}
                >
                    <AddLabel
                        intl={intl}
                        type={addType}
                        wrappedComponentRef={node => this.$AddLabel = node} />
                </Modal>
            </>
        )
    }
}

export default Detail
