/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Button, Icon, Loading, SortTable, Dialog, confirmForm, NoData } from 'ultraui'
import { Table, Modal } from 'huayunui'
import './index.less'
import { resourceTypeList } from './constant'
import resourceTypeTableProps from './resourceTypeTableProps'
import { formatChartValues } from '../../../utils'
import NodeEventInfo from './nodeEventInfo'
import NodeMessageInfo from './nodeMessageInfo'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import PodMonitorDetail from './podMonitorDetail'
import Webssh from './webssh'

const _ = window._
class ResourceObject extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            currentResourceType: null,
            tableDataObj: {}, // 根据资源类型归类后的资源对象数据
            historyTableDataObj: {}, // 历史的
            isPodMonitorDetailModalVisible: false,
            currentPod: {}, // 查看pod监控详情的传参数据
            isWebsshModalVisible: false, // webssh的modal显示
        }
    }

    componentDidMount() {
        const { detail: { resourceObjectDtos, historyResourceObjectDtos } } = this.props
        this.filterData(resourceObjectDtos, 'tableDataObj')
        this.filterData(historyResourceObjectDtos, 'historyTableDataObj')
    }

    componentWillReceiveProps({ detail }) {
        const { resourceObjectDtos, historyResourceObjectDtos } = detail
        this.filterData(resourceObjectDtos, 'tableDataObj')
        this.filterData(historyResourceObjectDtos, 'historyTableDataObj')
    }

    filterData = (dataArray, key) => {
        let tableDataObj = {}
        // 根据资源类型进行归类
        dataArray.forEach(item => {
            if (!item) return
            let index = resourceTypeList.findIndex(type => type === item.type)
            let type = index > -1 ? resourceTypeList[index] : 'Other'
            if (tableDataObj[type]) {
                tableDataObj[type].push(item)
            } else {
                tableDataObj[type] = [item]
            }
        })
        this.setState({
            [key]: tableDataObj
        })
    }

    handleTypeChange = (key, type) => {
        this.setState({
            currentResourceType: key
        })
        // 找到锚点
        let anchorElement = document.getElementById(`${key}_${type}`);
        // 如果对应id的锚点存在，就跳转到锚点
        if (anchorElement) { anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    }

    filterTableObjectKeys = (tableDataObj) => {
        let keys = Object.keys(tableDataObj)
        // 提取出other类型的资源
        let index = keys.findIndex(key => key === 'Other')
        if (index > -1) {
            keys.splice(index, 1)
            keys.push('Other')
        }
        // 对资源类型按照首字母进行排序
        let sortedKey = []
        resourceTypeList.forEach(type => {
            if (keys.indexOf(type) > -1) {
                sortedKey.push(type)
            }
        })
        return sortedKey
    }

    readStatementInfor = (row) => {
        const { intl } = this.props
        Modal.confirm({
            title: intl.formatMessage({ id: 'ReadStatementInfor' }),
            content: (<div className="chartValues" dangerouslySetInnerHTML={{ __html: formatChartValues(row.yamlConfigInfo) }}></div>),
            className: 'chartValueDialog noModalCancelBtn',
        })
    }

    readNodeEvent = (row) => {
        const { name, namespace } = _.get(row, 'metadata', {})
        const { intl } = this.props
        Modal.confirm({
            title: intl.formatMessage({ id: 'ReadNodeEvent' }),
            content: (<NodeEventInfo name={name} namespace={namespace} intl={intl} />),
            className: 'w600 noModalCancelBtn',
        })
    }

    readNodeMessage = (row) => {
        const { intl } = this.props
        const tableData = _.get(row, 'runInfo.messages', []) || []
        Modal.confirm({
            title: intl.formatMessage({ id: 'ReadNodeMessage' }),
            content: (<NodeMessageInfo intl={intl} tableData={tableData} />),
            className: 'w600 noModalCancelBtn',
        })
    }

    seePodMonitorDetail = (podName, namespace) => {
        this.setState({
            currentPod: {
                name: podName, namespace
            },
            isPodMonitorDetailModalVisible: true
        })
    }

    handleRemoteAccess = (podName, namespace) => {
        this.setState({
            currentPod: {
                name: podName, namespace
            },
            isWebsshModalVisible: true
        })
    }

    handleDeletePvc = ({ name, namespace }) => {
        const { intl, getDetail } = this.props
        const title = `${intl.formatMessage({ id: 'Delete' })}PVC——${name}`
        Modal.error({
            content: intl.formatMessage({ id: 'IsSureToDelete' }, { name: `PVC——${name}` }),
            onOk: () => {
                HuayunRequest(api.deletePvc, { name, namespace }, {
                    success: () => {
                        getDetail()
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${title}${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    handleSetState = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    render() {
        const { intl, type } = this.props // type用于区分是当前的资源列表还是历史的资源列表
        const { currentResourceType, tableDataObj, historyTableDataObj, isPodMonitorDetailModalVisible, currentPod, isWebsshModalVisible } = this.state
        const tableDataObjKeys = this.filterTableObjectKeys(type === 'current' ? tableDataObj : historyTableDataObj)
        return (
            <div className="resourceObject">
                <div className="tableList">
                    {
                        tableDataObjKeys.length ? (
                            tableDataObjKeys.map(key => {
                                let tableProps = resourceTypeTableProps(intl, key, this, type)
                                const { data: dataSource, ...otherTableProps } = tableProps
                                return (
                                    <div id={`${key}_${type}`} key={key} className="sourceTableItem">
                                        <div className="sourceType">{key}</div>
                                        <Table
                                            {...otherTableProps}
                                            dataSource={dataSource}
                                            pagination={false}
                                            scroll={{ x: '100%' }}
                                        />
                                    </div>
                                )
                            })
                        ) : <NoData />
                    }
                </div>
                {
                    tableDataObjKeys.length ? (
                        <div className="slider">
                            {
                                tableDataObjKeys.map(item => {
                                    return (
                                        <div className={`typeItem ${currentResourceType === item ? 'activeType activeBefore' : ''}`} key={item} onClick={() => this.handleTypeChange(item, type)}>{item}</div>
                                    )
                                })
                            }
                        </div>
                    ) : null
                }
                <PodMonitorDetail
                    intl={intl}
                    {...currentPod}
                    visible={isPodMonitorDetailModalVisible}
                    onClose={() => this.handleSetState('isPodMonitorDetailModalVisible', false)}
                ></PodMonitorDetail>
                <Modal
                    title={intl.formatMessage({ id: 'RemoteAccess' })}
                    visible={isWebsshModalVisible}
                    onCancel={() => this.handleSetState('isWebsshModalVisible', false)}
                    footer={null}
                    destroyOnClose={true}
                    className='websshModal'
                >
                    <Webssh
                        podName={currentPod.name}
                        namespace={currentPod.namespace}
                        handleClose={() => this.handleSetState('isWebsshModalVisible', false)}
                    />
                </Modal>
            </div>
        )
    }
}

export default ResourceObject
