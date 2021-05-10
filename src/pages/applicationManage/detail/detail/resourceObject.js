/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Button, Icon, Loading, SortTable, Dialog, confirmForm } from 'ultraui'
import { Table, Modal } from 'huayunui'
import './index.less'
import { resourceTypeList } from './constant'
import resourceTypeTableProps from './resourceTypeTableProps'
import { formatChartValues } from '../../../utils'
import NodeEventInfo from './nodeEventInfo'
import NodeMessageInfo from './nodeMessageInfo'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'

const _ = window._

class ResourceObject extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props)
        this.state = {
            currentResourceType: null,
            tableDataObj: {}, // 根据资源类型归类后的资源对象数据
            historyTableDataObj: {}, // 历史的
        }
    }

    componentDidMount() {
        const { detail: { resourceObjectDtos, historyResourceObjectDtos } } = this.props
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
        Modal.info({
            title: intl.formatMessage({ id: 'ReadStatementInfor' }),
            content: (<div className="chartValues" dangerouslySetInnerHTML={{ __html: formatChartValues(row.yamlConfigInfo) }}></div>),
            className: 'chartValueDialog',
        })
    }

    readNodeEvent = (row) => {
        const { name, namespace } = _.get(row, 'metadata', {})
        const { intl } = this.props
        Modal.info({
            title: intl.formatMessage({ id: 'ReadNodeEvent' }),
            content: (<NodeEventInfo name={name} namespace={namespace} intl={intl} />),
            className: 'w600',
        })
    }

    readNodeMessage = (row) => {
        const { intl } = this.props
        const tableData = _.get(row, 'runInfo.messages', []) || []
        Modal.info({
            title: intl.formatMessage({ id: 'ReadNodeMessage' }),
            content: (<NodeMessageInfo intl={intl} tableData={tableData} />),
            className: 'w600',
        })
    }

    seePodMonitorDetail = (podName, namespace) => {
        const { match: { url }, history } = this.props
        history.push(`${url}/podMonitorDetail/${podName}/${namespace}`)
    }

    handleDeletePvc = (row) => {
        // const { intl, baseFetch, getDetail } = this.props
        // confirmForm({
        //     title: `${intl.formatMessage({ id: 'Delete' })}PVC`,
        //     content: '',
        //     label: `是否确认删除?`,
        //     type: 'warning',
        //     prefixCls: 'ult',
        //     confirm: () => {
        //         const { name, namespace } = row
        //         baseFetch('appCenter', 'app.deletePvc', 'post', { name, namespace }, {}, {
        //             callback: () => {
        //                 getDetail()
        //             }
        //         })
        //     }
        // })
    }

    render() {
        const { intl, type } = this.props // type用于区分是当前的资源列表还是历史的资源列表
        const { currentResourceType, tableDataObj, historyTableDataObj } = this.state
        const tableDataObjKeys = this.filterTableObjectKeys(type === 'current' ? tableDataObj : historyTableDataObj)
        return (
            <div className="resourceObject">
                <div className="tableList">
                    {
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
                                    />
                                </div>
                            )
                        })
                    }
                </div>
                <div className="slider">
                    {
                        tableDataObjKeys.map(item => {
                            return (
                                <div className={`typeItem ${currentResourceType === item ? 'activeType activeBefore' : ''}`} key={item} onClick={() => this.handleTypeChange(item, type)}>{item}</div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default ResourceObject
