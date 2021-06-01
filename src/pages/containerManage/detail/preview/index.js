/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { container as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, Switch, Button, ButtonGroup, Progress, Modal, Drawer, Table } from 'huayunui';
import { Icon, KeyValue, Notification, TagItem } from 'ultraui'
import { Row, Col, Tag, Carousel } from 'antd'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import { ApplicationStatuList, ApplicationSecondStatuList, DEFAULT_EMPTY_LABEL } from '~/constants'
import echarts from 'echarts'
import moment from 'moment'
import DetailIcon from '~/components/DetailIcon'

const notification = Notification.newInstance()
const _ = window._
class Preview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {

    }
    initLineChart = (id, detail) => {
        if (!this[`$${id}`]) {
            this[`$${id}`] = echarts.init(document.getElementById(id))// 初始化echarts
        }
        // 设置options
        this[`$${id}`].setOption(this.getLineOption(id, detail))
    }
    getLineOption = (id, detail) => {
        const type = id.replace('_line', '')
        const { intl } = this.props
        const { cpu_usage_rate, memory_usage_rate } = detail
        let data = type === 'cpu' ? cpu_usage_rate : memory_usage_rate
        let xAxisData = []
        let seriesData = []
        Array.isArray(data) && data.forEach(item => {
            xAxisData.push(moment(item[0] * 1000).format('HH:mm:ss'))
            seriesData.push(parseFloat(item[1]))
        })
        const color = type === 'cpu' ? '#4c8cca' : '#ed6f4d'
        let option = {
            color: [color],
            grid: {
                left: 15,
                top: 10,
                right: 15,
                bottom: 20
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: seriesData,
                type: 'line'
            }]
        }
        return option
    }
    getAffinityConfigTableColumns() {
        const { intl } = this.props
        const columns = [ // 表格的列数组配置
            {
                dataIndex: 'type',
                title: intl.formatMessage({ id: 'Type' })
            },
            {
                dataIndex: 'matchType',
                title: intl.formatMessage({ id: 'MatchType' })
            },
            {
                dataIndex: 'labels',
                title: intl.formatMessage({ id: 'Tag' })
            },
            {
                dataIndex: 'level',
                title: intl.formatMessage({ id: 'AffinityLevel' })
            }
        ]
        return columns
    }
    render() {
        const { intl, detail } = this.props
        const { name, projectId, projectName, createTime, resource, createdByName, imageList, startTime, labels, namespace, restartPolicy, restartTimes } = detail
        const { cpu, ephemeralStorage, memory, storage } = resource
        const quotaData = [
            {
                iconType: 'CPU',
                title: 'CPU(m)',
                value: cpu
            },
            {
                iconType: 'RAM',
                title: 'Memory(Mi)',
                value: memory
            },
            {
                iconType: 'storage',
                title: 'cEphemeralStorage(Gi)',
                value: ephemeralStorage
            },
            {
                iconType: 'storage',
                title: 'cStorage(Gi)',
                value: storage
            }
        ]
        const KeyValueData = [
            {
                label: intl.formatMessage({ id: 'ContainerGroupName' }),
                value: name || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'Project' }),
                value: projectName || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'CreaterName' }),
                value: createdByName || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'Image' }),
                value: imageList.join('、') || DEFAULT_EMPTY_LABEL
            }
        ]
        const KeyValueData2 = [
            {
                value: intl.formatMessage({ id: 'CreateTime' }),
                label: createTime || DEFAULT_EMPTY_LABEL
            },
            {
                value: intl.formatMessage({ id: 'OnlineTime' }),
                label: startTime || DEFAULT_EMPTY_LABEL
            }
        ]
        const KeyValueData3 = [
            {
                value: intl.formatMessage({ id: 'ContainerGroupTag' }),
                label: Object.keys(labels).length ? (
                    <React.Fragment>
                        {
                            Object.keys(labels).map(key => {
                                return (
                                    <TagItem
                                        size='medium'
                                        key={key}
                                        name={labels[key]}
                                    />
                                )
                            })
                        }
                    </React.Fragment>
                ) : DEFAULT_EMPTY_LABEL
            },
            {
                value: intl.formatMessage({ id: 'Namespace' }),
                label: namespace || DEFAULT_EMPTY_LABEL
            },
            {
                value: intl.formatMessage({ id: 'RestartTimes' }),
                label: restartTimes || 0
            },
            {
                value: intl.formatMessage({ id: 'RestartPolicy' }),
                label: restartPolicy || DEFAULT_EMPTY_LABEL
            }
        ]
        const affinityConfigTableData = [

        ]
        return (
            <div className='commonDetail_preview containerDetail_preview'>
                <Row gutter={10}>
                    <Col span={8}>
                        <div className='boxContainer'>
                            <div className='boxTitle activeBefore'>{intl.formatMessage({ id: 'BasicInfo' })}</div>
                            <div className='boxContent'>
                                <KeyValue values={KeyValueData} />
                            </div>
                            <KeyValue className='horKeyValueContent' values={KeyValueData2} />
                        </div>
                    </Col>
                    <Col span={16}>
                        <div className='boxContainer'>
                            <div className='boxTitle activeBefore'>{intl.formatMessage({ id: 'QuotaStatistics' })}</div>
                            <div className='boxContent quotaInfo'>
                                {
                                    quotaData.map(({ iconType, title, value }) => {
                                        return (
                                            <div className='quotaItem'>
                                                <div className='quotaType'>
                                                    <DetailIcon iconType="done" className="m-r-sm" />&nbsp;
                                                    {title}
                                                </div>
                                                <div className='quotaValue'>{value}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div className='boxContainer'>
                            <div className='boxTitle activeBefore'>{intl.formatMessage({ id: 'ResourceUsageMonitor' })}</div>
                            <div className='boxContent cpu_memory_monitor'>
                                <div className='monitorItem'>
                                    <div className='summary'>
                                        <span className='name'>CPU(%)</span>
                                        <span className='value'>3%(写死)</span>
                                    </div>
                                    <div id="cpu_line" className="lineItem" />
                                </div>
                                <div className='monitorItem'>
                                    <div className='summary'>
                                        <span className='name'>Memory(Mi)</span>
                                        <span className='value'>100Mi(写死)</span>
                                    </div>
                                    <div id="memory_line" className="lineItem" />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div className='boxContainer containerGroupInfor'>
                            <div className='boxTitle activeBefore'>{intl.formatMessage({ id: 'ContainerGroupInfo' })}</div>
                            <div className='boxContent'>
                                <div className='infoItem'>
                                    <div className='itemTitle'>{intl.formatMessage({ id: 'BasicInfo' })}</div>
                                    <KeyValue className='horKeyValueContent' values={KeyValueData3} />
                                </div>
                                <div className='infoItem'>
                                    <div className='itemTitle'>{intl.formatMessage({ id: 'AffinityConfig' })}</div>
                                    <Table
                                        columns={this.getAffinityConfigTableColumns()}
                                        dataSource={affinityConfigTableData}
                                        pagination={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div >
        )
    }
}

export default Preview
