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
import { ContainerStateList, ContainerStatusList, DEFAULT_EMPTY_LABEL } from '~/constants'
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
        const { monitorData } = this.props
        const cpu_usage_rate = _.get(monitorData, 'cpu_usage_rate', [])
        const memory_usage_rate = _.get(monitorData, 'memory_usage_rate', [])
        this.initLineChart('cpu_line', cpu_usage_rate)
        this.initLineChart('memory_line', memory_usage_rate)
    }
    initLineChart = (id, data) => {
        if (!this[`$${id}`]) {
            this[`$${id}`] = echarts.init(document.getElementById(id))// 初始化echarts
        }
        // 设置options
        this[`$${id}`].setOption(this.getLineOption(id, data))
    }
    getLineOption = (id, data) => {
        const type = id.replace('_line', '')
        const { intl } = this.props
        let xAxisData = []
        let seriesData = []
        Array.isArray(data) && data.forEach(item => {
            xAxisData.push(moment(item[0] * 1000).format('HH:mm:ss'))
            seriesData.push(parseFloat(item[1]))
        })
        const color = type === 'cpu' ? '#0091AE' : '#5E6AB8 '
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
                width: '20%'
            },
            {
                dataIndex: 'ip',
                title: intl.formatMessage({ id: 'ClusterIP' }),
                width: '20%'
            },
            {
                dataIndex: 'namespace',
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
                width: '15%'
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
                        <Tag color="geekblue" className='containerState'>{ContainerStateList[state]}</Tag>
                        <Tag color={status === 'running' ? 'green' : 'red'} className='containerStatus'>{ContainerStatusList[status] || '未知'}</Tag>
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
            },
            {
                label: intl.formatMessage({ id: 'Image' }),
                value: (
                    <div>
                        {
                            imageList.map(image => {
                                const { project, repo, tag } = image
                                const arr = [project, repo, tag].filter(item => !!item)
                                return <div>{arr.join('/')}</div>
                            })
                        }
                    </div>
                )
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
                                    <div className='itemTitle'>{intl.formatMessage({ id: 'PortConfig' })}</div>
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
