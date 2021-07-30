/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { Table, Drawer, Modal } from 'huayunui';
import { Icon, Notification, Loading, Button, SortTable, Dialog } from 'ultraui'
import './index.less'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import { clusterResourceTypeList, clusterResourceTypeColumns } from './constant'
import DetailDrawer from '~/components/DetailDrawer'
import ManageNameSpaceLabel from './manageNameSpaceLabel'

const notification = Notification.newInstance()
class ClusterResources extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentResourceType: clusterResourceTypeList[0],
            tableDataObj: {}, // 根据资源类型归类后的资源对象数据
            isFetching: false,
            isManageNameSpaceLabelModalVisible: false, // 是否显示namespace的modal
            currentNameSpaceRowName: '', // nameSpace的id
            labelObj: {}, // label集合
        }
    }
    componentDidMount() {
        this.handleRefresh()
    }
    handleRefresh = () => {
        const { id, intl } = this.props
        // 获取集群资源数据，并进行整合
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.clusterResourceInfor, { id }, {
            success: (res) => {
                const { namespaceList, nodeList, persistentVolumeList, storageClassList } = res.data
                this.setState({
                    tableDataObj: {
                        Namespace: namespaceList,
                        Node: nodeList,
                        'PersistentVolume': persistentVolumeList,
                        'StorageClass': storageClassList
                    }
                })
            },
            complete: () => {
                this.setState({
                    isFetching: false
                })
            }
        })
    }
    handleTypeChange = (type) => {
        this.setState({
            currentResourceType: type
        })
        // 找到锚点
        let anchorElement = document.getElementById(type);
        // 如果对应id的锚点存在，就跳转到锚点
        if (anchorElement) { anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    }
    handleManageNameSpaceLabel = (row) => {
        const { intl } = this.props
        let labelObj = _.get(row, 'runInfo.metadata.labels', {}) || {}
        this.setState({
            isManageNameSpaceLabelModalVisible: true,
            currentNameSpaceRowName: row.name,
            labelObj
        })
    }
    handleConfirmManageNameSpaceLabel = () => {
        const { intl } = this.props
        const { labelList } = this.$ManageNameSpaceLabel.state
        const { labelObj, currentNameSpaceRowName: name } = this.state
        let labels = {}
        labelList.forEach(({ key, value }, index) => {
            if (key) {
                labels[key] = value
            }
        })
        const params = {
            name,
            labels
        }
        HuayunRequest(api.updateNamespaceLabels, params, {
            success: (res) => {
                notification.notice({
                    id: new Date(),
                    type: 'success',
                    title: intl.formatMessage({ id: 'Success' }),
                    content: `${intl.formatMessage({ id: 'Update' })}标签${intl.formatMessage({ id: 'Success' })}`,
                    iconNode: 'icon-success-o',
                    duration: 5,
                    closable: true
                })
            }
        })
        this.setState({
            isManageNameSpaceLabelModalVisible: false,
            currentNameSpaceRowName: '',
            labelObj: {}
        })
        this.handleRefresh()
    }
    render() {
        const { intl, onClose, visible } = this.props
        const { currentResourceType, tableDataObj, isFetching, labelObj, isManageNameSpaceLabelModalVisible } = this.state
        return (
            <React.Fragment>
                <DetailDrawer
                    name={intl.formatMessage({ id: 'Cluster resources' })}
                    onRefresh={this.handleRefresh}
                    onClose={onClose}
                    visible={visible}
                >
                    <div id="clusterResources">
                        {
                            isFetching ? (<Loading />) : null
                        }
                        <div className="resourceObject">
                            <div className="tableList">
                                {
                                    Object.keys(tableDataObj).map(key => {
                                        // 不同类型的资源对应的列表项
                                        let columns = clusterResourceTypeColumns(this)[key]
                                        return (columns.length > 1) && tableDataObj[key].length ? (
                                            <div id={key} key={key} className="sourceTableItem">
                                                <div className="sourceType">{key}</div>
                                                <Table
                                                    columns={columns}
                                                    dataSource={tableDataObj[key]}
                                                    pagination={false}
                                                />
                                            </div>
                                        ) : null
                                    })
                                }
                            </div>
                            <div className="slider">
                                {
                                    Object.keys(tableDataObj).map(key => {
                                        return tableDataObj[key].length ? (
                                            <div className={`typeItem ${currentResourceType === key ? 'activeType activeBefore' : ''}`} key={key} onClick={() => this.handleTypeChange(key)}>{key}</div>
                                        ) : null
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </DetailDrawer>
                <Modal
                    title={`${intl.formatMessage({ id: 'AppTag' })}${intl.formatMessage({ id: '::Manage' })}`}
                    visible={isManageNameSpaceLabelModalVisible}
                    onOk={this.handleConfirmManageNameSpaceLabel}
                    onCancel={() => this.setState({
                        isManageNameSpaceLabelModalVisible: false
                    })}
                    className='manageNameSpaceLabelDialog'
                    destroyOnClose={true}
                >
                    <ManageNameSpaceLabel
                        intl={intl}
                        labelObj={labelObj}
                        ref={node => this.$ManageNameSpaceLabel = node} />
                </Modal>
            </React.Fragment>
        )
    }
}

export default ClusterResources
