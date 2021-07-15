/* eslint-disable */
import React from 'react'
import { RcForm, Icon, Loading, SortTable, Dialog, Radio, Input, Button as UltrauiButton, KeyValue, TagItem, InlineInput, Notification, NoData } from 'ultraui'
import { Collapse } from 'huayunui'
import { Progress } from 'antd'
import './index.less'
import HuayunRequest from '~/http/request'
import { resource as api } from '~/http/api'
import echarts from 'echarts'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import moment from 'moment'

const { Panel } = Collapse
const _ = window._
class ResourceMonitor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            capacityCpu: 0,
            allocatableCpu: 0,
            requestCpu: 0,
            limitCpu: 0,
            maxCpu: 0,
            minCpu: 0,
            meanCpu: 0,
            currentCpu: 0,
            capacityMemory: 0,
            allocatableMemory: 0,
            requestMemory: 0,
            limitMemory: 0,
            maxMemory: 0,
            minMemory: 0,
            meanMemory: 0,
            currentMemory: 0,
            capacityEphemeralStorage: 0,
            allocatableEphemeralStorage: 0,
            requestEphemeralStorage: 0,
            limitEphemeralStorage: 0,
            maxEphemeralStorage: 0,
            minEphemeralStorage: 0,
            meanEphemeralStorage: 0,
            currentEphemeralStorage: 0
        }
    }
    componentDidMount() {
        const { nodeName, nodeCpuUsed, nodeMemoryUsed, nodeLoadUsed } = this.props
        this.getNodeResourceMonitor(nodeName)
        this.renderChart('CpuChart', nodeCpuUsed)
        this.renderChart('MemoryChart', nodeMemoryUsed)
        this.renderChart('EphemeralStorageChart', nodeLoadUsed)
        this.getMax_Min_Mean_CurrentData('Cpu', nodeCpuUsed)
        this.getMax_Min_Mean_CurrentData('Memory', nodeMemoryUsed)
        this.getMax_Min_Mean_CurrentData('EphemeralStorage', nodeLoadUsed)
    }
    componentWillReceiveProps({ nodeName, nodeCpuUsed, nodeMemoryUsed, nodeLoadUsed }) {
        if (nodeName && nodeName !== this.props.nodeName) {
            this.getNodeResourceMonitor(nodeName)
            this.renderChart('CpuChart', nodeCpuUsed)
            this.renderChart('MemoryChart', nodeMemoryUsed)
            this.renderChart('EphemeralStorageChart', nodeLoadUsed)
            this.getMax_Min_Mean_CurrentData('Cpu', nodeCpuUsed)
            this.getMax_Min_Mean_CurrentData('Memory', nodeMemoryUsed)
            this.getMax_Min_Mean_CurrentData('EphemeralStorage', nodeLoadUsed)
        }
    }
    getMax_Min_Mean_CurrentData = (key, data) => {
        let max = 0, min = _.get(data, '0.0', 0), mean = 0, current = 0, total = 0
        Array.isArray(data) && data.forEach((item, index) => {
            // 计算总和
            total = (parseFloat(total) + parseFloat(item[1])).toFixed(2)
            // 计算当前值和平均值
            if (index === (data.length - 1)) {
                current = parseFloat(item[1]).toFixed(2)
                mean = (total / data.length).toFixed(2)
            }
            if (item[1] > max) {
                max = parseFloat(item[1]).toFixed(2)
            }
            if (item[1] < min) {
                min = parseFloat(item[1]).toFixed(2)
            }
        })
        this.setState({
            [`max${key}`]: max,
            [`min${key}`]: min,
            [`mean${key}`]: mean,
            [`current${key}`]: current,
        })
    }
    getNodeResourceMonitor = (name = this.props.nodeName) => {
        HuayunRequest(api.queryNodeResource, { name }, {
            success: (res) => {
                setTimeout(() => {
                    const {
                        capacityCpu, allocatableCpu, requestCpu, limitCpu,
                        capacityMemory, allocatableMemory, requestMemory, limitMemory,
                        capacityEphemeralStorage, allocatableEphemeralStorage, requestEphemeralStorage, limitEphemeralStorage
                    } = res.data
                    this.setState({
                        capacityCpu, allocatableCpu, requestCpu, limitCpu,
                        capacityMemory, allocatableMemory, requestMemory, limitMemory,
                        capacityEphemeralStorage, allocatableEphemeralStorage, requestEphemeralStorage, limitEphemeralStorage
                    })
                })
            }
        })
    }
    renderChart = (id, data) => {
        const { intl } = this.props
        let xAxisData = []
        let seriesData = []
        Array.isArray(data) && data.forEach(item => {
            xAxisData.push(moment(item[0] * 1000).format('HH:mm:ss'))
            seriesData.push(parseFloat(item[1]))
        })
        let option = {
            color: ['#4C8CCA'],
            grid: {
                top: 20,
                bottom: 20,
                left: 50
            },
            xAxis: {
                type: 'category',
                data: xAxisData
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function (value, index) {
                        return parseFloat(value) + '%';
                    }
                }
            },
            series: [{
                data: seriesData,
                type: 'line',
            }]
        }
        let dom = document.getElementById(id)
        if (dom) {
            echarts.init(dom).setOption(option)
        }
    }
    renderPanelItem = (title, key, type) => {
        const { intl } = this.props
        const current = _.get(this.state, `current${type}`, 0)
        const max = _.get(this.state, `max${type}`, 0)
        const min = _.get(this.state, `min${type}`, 0)
        const mean = _.get(this.state, `mean${type}`, 0)
        const capacity = _.get(this.state, `capacity${type}`, 0)
        const request = _.get(this.state, `request${type}`, 0)
        const limit = _.get(this.state, `limit${type}`, 0)
        const allocatable = _.get(this.state, `allocatable${type}`, 0)
        const requestPercent = request / capacity * 100
        const limitPercent = limit / capacity * 100
        const allocatablePercent = allocatable / capacity * 100

        return (
            <Panel header={title} key={key} >
                <div className='left'>
                    <div className='panelHeader'>
                        <span>波段趋势(最近10s)</span>
                        <div>当前<span>&nbsp;{current ? `${current}%` : 0}</span></div>
                    </div>
                    <div className='numLine'>
                        <div className='labelItem'>Max:&nbsp;<span className='text-danger'>{max ? `${max}%` : 0}</span></div>
                        <div className='labelItem'>Min:&nbsp;<span className='text-warning'>{min ? `${max}%` : 0}</span></div>
                        <div className='labelItem'>Mean:&nbsp;<span className='text-primary'>{mean ? `${max}%` : 0}</span></div>
                    </div>
                    <div id={`${type}Chart`} className='chartItem'></div>
                </div>
                <div className='right'>
                    <div className='panelHeader'>
                        <span>资源监控</span>
                        <div>总计<span>&nbsp;{capacity}</span></div>
                    </div>
                    <div className='progressList'>
                        <div className='progressItem'>
                            <div className='numberLine'>
                                <span>Request</span>
                                <span>{request}</span>
                            </div>
                            <Progress percent={requestPercent} strokeColor='#0091AE' showInfo={false} />
                        </div>
                        <div className='progressItem'>
                            <div className='numberLine'>
                                <span>Limites</span>
                                <span>{limit}</span>
                            </div>
                            <Progress percent={limitPercent} strokeColor='#E7BD2F' showInfo={false} />
                        </div>
                        <div className='progressItem'>
                            <div className='numberLine'>
                                <span>可分配</span>
                                <span>{allocatable}</span>
                            </div>
                            <Progress percent={allocatablePercent} strokeColor='#A6C682' showInfo={false} />
                        </div>
                    </div>
                </div>
            </Panel>
        )
    }
    render() {
        const { intl } = this.props
        const Load_StoragePanelTitle = (
            <div className='Load_StoragePanelTitle'>
                <span>Load(1m)</span>
                <span>&nbsp;&nbsp;Storage</span>
            </div>
        )
        return (
            <Collapse defaultActiveKey={['1', '2', '3']} className='resourceMonitorPanel'>
                {
                    this.renderPanelItem('CPU(%)', '1', 'Cpu')
                }
                {
                    this.renderPanelItem('Memory(Gi)', '2', 'Memory')
                }
                {
                    this.renderPanelItem(Load_StoragePanelTitle, '3', 'EphemeralStorage')
                }
            </Collapse >
        )
    }
}

export default ResourceMonitor
