/* eslint-disable */
import React from 'react'
import { RcForm, Icon, Loading, SortTable, Dialog, Radio, Input, Button as UltrauiButton } from 'ultraui'
import './index.less'
import echarts from 'echarts'
import moment from 'moment'
import HuayunRequest from '~/http/request'
import { container as api } from '~/http/api'
import DetailDrawer from '~/components/DetailDrawer'
import { Collapse, Select, Button } from 'huayunui'
import { Row, Col } from 'antd'
import { KeyValue } from '@huayun/ultraui'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
const _ = window._
const { Panel } = Collapse;
class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentWillReceiveProps({ visible, monitorData }) {
        visible && visible !== this.props.visible && this.initData(monitorData)
    }
    initData = (monitorData) => {
        const cpu_usage_rate = _.get(monitorData, 'cpu_usage_rate', [])
        const memory_usage_rate = _.get(monitorData, 'memory_usage_rate', [])
        setTimeout(() => {
            this.initLineChart('cpu', cpu_usage_rate)
            this.initLineChart('memory', memory_usage_rate)
        })
    }
    initLineChart = (id, data) => {
        if (!this[`$${id}`]) {
            this[`$${id}`] = echarts.init(document.getElementById(id))// 初始化echarts
        }
        console.log(id)
        console.log(data)

        // 设置options
        this[`$${id}`].setOption(this.getLineOption(id, data))
    }
    getLineOption = (id, data) => {
        const { intl } = this.props
        let xAxisData = []
        let seriesData = []
        Array.isArray(data) && data.forEach(item => {
            xAxisData.push(moment(item[0] * 1000).format('HH:mm:ss'))
            seriesData.push(parseFloat(item[1]))
        })
        const color = id === 'cpu' ? '#0091AE' : '#5E6AB8 '
        let option = {
            color: [color],
            grid: {
                left: 35,
                top: 20,
                right: 20,
                bottom: 30
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
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    handleRemoteAccess = () => {

    }
    handleReadLog = () => {

    }
    renderChartPanelTitle = (left, right) => {
        return (
            <div className='chartPanelTitle'>
                <div className='left'>{left}</div>
                <div className='right'>当前值：{right}</div>
            </div>
        )
    }
    render() {
        const { intl, onClose, visible, currentContainer, monitorData } = this.props
        const { name, runVar, envs, image, probe } = currentContainer
        const { args, workDir, command } = runVar || {}
        const { project, repo, tag, pullStrategy } = image || {}
        const { type, command: probeCommand, periodSeconds, failureThreshold, initialDeploy, timeoutSeconds, manner } = probe || {}
        const basicKeyValue = [
            {
                label: intl.formatMessage({ id: 'StartParameter' }),
                value: command || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'WorkingDirectory' }),
                value: workDir || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'EnvironmentVariable' }),
                value: (envs || []).map(({ envKey, envValue }) => {
                    return `${envKey || DEFAULT_EMPTY_LABEL} : ${envValue || DEFAULT_EMPTY_LABEL}`
                }).join('、')
            },
            {
                label: `${intl.formatMessage({ id: 'Image' })}${intl.formatMessage({ id: 'PullStrategy' })}`,
                // value: [project, repo, tag].filter(item => !!item).join('/')
                value: pullStrategy
            }
        ]
        // const mountPointConfigKeyValue = [
        //     {
        //         label: '挂载对象',
        //         value: command || DEFAULT_EMPTY_LABEL
        //     },
        //     {
        //         label: '挂载子路径/变量',
        //         value: workDir || DEFAULT_EMPTY_LABEL
        //     },
        //     {
        //         label: '挂载路径',
        //         value: `${envKey || DEFAULT_EMPTY_LABEL} : ${envValue || DEFAULT_EMPTY_LABEL}`
        //     },
        //     {
        //         label: '是否只读',
        //         value: [project, repo, tag].filter(item => !!item).join('/')
        //     }
        // ]
        const healthyTestKeyValue = [
            {
                label: '探针类型',
                value: type || DEFAULT_EMPTY_LABEL
            },
            {
                label: '检测间隔(秒)',
                value: periodSeconds || DEFAULT_EMPTY_LABEL
            },
            {
                label: '检测方式',
                value: manner || DEFAULT_EMPTY_LABEL
            },
            {
                label: '超时时间(秒)',
                value: timeoutSeconds || DEFAULT_EMPTY_LABEL
            },
            {
                label: '检测命令',
                value: probeCommand || DEFAULT_EMPTY_LABEL
            },
            {
                label: '失败时重复(次)',
                value: failureThreshold || DEFAULT_EMPTY_LABEL
            },
            {
                label: '初始化等待(秒)',
                value: initialDeploy || DEFAULT_EMPTY_LABEL
            }
        ]
        const cpu_usage_current = _.get(monitorData, 'cpu_usage_current', '0')
        const memory_usage_current = _.get(monitorData, 'memory_usage_current', '0')
        return (
            <DetailDrawer
                name={name}
                // onRefresh={this.getDetail}
                onClose={onClose}
                visible={visible}
                className='containerDetailDrawer'
            >
                <div className='operaBar'>
                    <UltrauiButton
                        type="text"
                        onClick={this.handleRemoteAccess}
                        className='br'
                    >
                        <Icon type="telecontrol" />&nbsp;{intl.formatMessage({ id: 'RemoteAccess' })}
                    </UltrauiButton>
                    <UltrauiButton
                        type="text"
                        onClick={this.handleReadLog}
                    >
                        <Icon type="xunjian" />&nbsp;{intl.formatMessage({ id: 'ReadStaticLog' })}
                    </UltrauiButton>
                </div>
                <Collapse defaultActiveKey={['1', '2', '3']}>
                    <Panel header="基础配置" key='1'>
                        <KeyValue values={basicKeyValue} className='basicKeyValue' />
                    </Panel>
                    {/* <Panel header="挂载点配置" key='2'>
                        <KeyValue values={mountPointConfigKeyValue} className='mountPointConfigKeyValue' />
                    </Panel> */}
                    <Panel header="健康检测" key='3'>
                        <KeyValue values={healthyTestKeyValue} className='healthyTestKeyValue' />
                    </Panel>
                </Collapse>
                <Collapse defaultActiveKey={['cpu', 'memory']} className='cpu_memory'>
                    <Panel header={this.renderChartPanelTitle('CPU(m)', `${cpu_usage_current}m`)} forceRender={true} key='cpu' className='w50'>
                        <div id='cpu' className='chartItem'></div>
                    </Panel>
                    <Panel header={this.renderChartPanelTitle('Memory(Mi)', `${memory_usage_current}Mi`)} forceRender={true} key='memory' className='w50'>
                        <div id='memory' className='chartItem'></div>
                    </Panel>
                </Collapse>
            </DetailDrawer >
        )
    }
}

export default Detail
