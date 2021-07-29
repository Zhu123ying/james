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
import { ContainerGroupStateList, ContainerGroupSecondStateList, DEFAULT_EMPTY_LABEL } from '~/constants'
import echarts from 'echarts'
import moment from 'moment'
import DetailIcon from '~/components/DetailIcon'

const notification = Notification.newInstance()
const _ = window._
const exposureModeObject = {
    Node: '节点网络',
    Container: '容器网络',
    LoadBalance: '外部网络'
}
class Preview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {
        this.renderCpuLineChart()
        this.renderMemoryLineChart()
    }
    renderCpuLineChart = () => {
        const { monitorData } = this.props
        const cpu_usage_rate = _.get(monitorData, 'cpu_usage_rate') || []
        if (!this.$cpu_line) {
            this.$cpu_line = echarts.init(document.getElementById('cpu_line'))// 初始化echarts
        }
        let xAxisData = []
        let seriesData = []
        cpu_usage_rate.forEach(item => {
            xAxisData.push(moment(item[0] * 1000).format('HH:mm:ss'))
            const yData = (parseFloat(item[1]) * 100).toFixed(2)
            seriesData.push(parseFloat(yData))
        })
        // 设置options
        this.$cpu_line.setOption({
            color: ['#0091AE'],
            grid: {
                left: 25,
                top: 10,
                right: 15,
                bottom: 35
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
        })
    }
    renderMemoryLineChart = () => {
        const { monitorData } = this.props
        const memory_usage_rate = _.get(monitorData, 'memory_usage_rate') || []
        if (!this.$memory_line) {
            this.$memory_line = echarts.init(document.getElementById('memory_line'))// 初始化echarts
        }
        let xAxisData = []
        let seriesData = []
        memory_usage_rate.forEach(item => {
            xAxisData.push(moment(item[0] * 1000).format('HH:mm:ss'))
            const yData = parseFloat(item[1]).toFixed(2)
            seriesData.push(parseFloat(yData))
        })
        // 设置options
        this.$memory_line.setOption({
            color: ['#5E6AB8'],
            grid: {
                left: 30,
                top: 10,
                right: 15,
                bottom: 35
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
        })
    }
    getAffinityConfigTableColumns() {
        const { intl } = this.props
        const columns = [ // 表格的列数组配置
            {
                dataIndex: 'type',
                title: intl.formatMessage({ id: 'Type' }),
                fixed: 'left',
                width: '10%'
            },
            {
                dataIndex: 'Level',
                title: intl.formatMessage({ id: 'AffinityLevel' }),
                width: '20%'
            },
            {
                dataIndex: 'weight',
                title: intl.formatMessage({ id: 'Weight' }),
                width: '10%'
            },
            {
                dataIndex: 'namespaces',
                title: intl.formatMessage({ id: 'Namespace' }),
                width: '10%',
                render(namespaces) {
                    return namespaces.join('、')
                }
            },
            {
                dataIndex: 'topologyKey',
                title: '拓扑域',
                width: '10%'
            },
            {
                dataIndex: 'matchManner',
                title: intl.formatMessage({ id: 'MatchType' }),
                width: '10%'
            },
            {
                dataIndex: 'labelsOrExpressions',
                title: intl.formatMessage({ id: 'Tag' }),
                width: '10%'
            },
            {
                dataIndex: 'operator',
                title: '操作符',
                width: '10%'
            },
            {
                dataIndex: 'values',
                title: '值',
                width: '20%'
            }
        ]
        return columns
    }
    getNetworkTableColumns() {
        const { intl } = this.props
        const columns = [ // 表格的列数组配置
            {
                dataIndex: 'name',
                title: `${intl.formatMessage({ id: 'Port' })}${intl.formatMessage({ id: 'Name' })}`,
                width: '15%'
            },
            {
                dataIndex: 'type',
                title: intl.formatMessage({ id: 'ExposureMode' }),
                width: '20%',
                render(type) {
                    return exposureModeObject[type] || DEFAULT_EMPTY_LABEL
                }
            },
            {
                dataIndex: 'ip',
                title: intl.formatMessage({ id: 'ClusterIP' }),
                width: '20%'
            },
            {
                dataIndex: 'protocol',
                title: intl.formatMessage({ id: 'ProtocolType' }),
                width: '15%'
            },
            {
                dataIndex: 'containerPort',
                title: intl.formatMessage({ id: 'ContainerGroupPort' }),
                width: '15%'
            },
            {
                dataIndex: 'externalPort',
                title: intl.formatMessage({ id: 'ExternalPort' }),
                width: '15%',
                render(val) {
                    return val || DEFAULT_EMPTY_LABEL
                }
            }
        ]
        return columns
    }
    render() {
        const { intl, detail, monitorData } = this.props
        const { name, projectId, projectName, createTime, resource, createdByName, imageList,
            startTime, labels, namespace, restartPolicy, restartTimes, state, status, affinityDetails, networkDetails
        } = detail
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
                value: (
                    <div className='name_state'>
                        <div className='name'>{name}</div>
                        <Tag color="geekblue" className='containerState'>{ContainerGroupStateList[state]}</Tag>
                        <Tag color={status === 'running' ? 'green' : 'red'} className='containerStatus'>{ContainerGroupSecondStateList[status]}</Tag>
                    </div>
                )
            },
            {
                label: intl.formatMessage({ id: 'Project' }),
                value: projectName || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'CreaterName' }),
                value: createdByName || DEFAULT_EMPTY_LABEL
            }
            // {
            //     label: intl.formatMessage({ id: 'Image' }),
            //     value: (
            //         <div>
            //             {
            //                 imageList.map(image => {
            //                     const { project, repo, tag } = image
            //                     const arr = [project, repo, tag].filter(item => !!item)
            //                     return <div>{arr.join('/')}</div>
            //                 })
            //             }
            //         </div>
            //     )
            // }
        ]
        const KeyValueData2 = [
            {
                value: intl.formatMessage({ id: 'CreateTime' }),
                label: createTime || DEFAULT_EMPTY_LABEL
            },
            {
                value: intl.formatMessage({ id: 'OnlineTime' }),
                label: state === 'config' ? DEFAULT_EMPTY_LABEL : startTime
            }
        ]
        const KeyValueData3 = [
            {
                value: intl.formatMessage({ id: 'ContainerGroupTag' }),
                label: Object.keys(labels || {}).length ? (
                    <div className='tagList'>
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
                    </div>
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
        const cpu_usage_current = _.get(monitorData, 'cpu_usage_current', '0')
        const memory_usage_current = _.get(monitorData, 'memory_usage_current', '0')
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
                                        <span className='value'>{cpu_usage_current}</span>
                                    </div>
                                    <div id="cpu_line" className="lineItem" />
                                </div>
                                <div className='monitorItem'>
                                    <div className='summary'>
                                        <span className='name'>Memory(Mi)</span>
                                        <span className='value'>{memory_usage_current}</span>
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
                                        dataSource={affinityDetails}
                                        pagination={false}
                                    />
                                </div>
                                <div className='infoItem'>
                                    <div className='itemTitle'>{intl.formatMessage({ id: 'NetworkConfig' })}</div>
                                    <Table
                                        columns={this.getNetworkTableColumns()}
                                        dataSource={networkDetails}
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
