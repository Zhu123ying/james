/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
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
    renderChart = (id, title, data) => {
        const { intl } = this.props
        let xAxisData = []
        let seriesData = []
        Array.isArray(data) && data.forEach(item => {
            xAxisData.push(moment(item[0] * 1000).format('HH:mm:ss'))
            seriesData.push(parseFloat(item[1]))
        })
        const color = id === 'cpu' ? '#4c8cca' : '#ed6f4d'
        let option = {
            color: [color],
            grid: {
                left: 10,
                top: 10,
                right: 10,
                bottom: 10
            },
            xAxis: {
                name: intl.formatMessage({ id: 'Time' }),
                type: 'category',
                data: xAxisData
            },
            yAxis: {
                name: title,
                type: 'value'
            },
            series: [{
                data: seriesData,
                type: 'line'
            }]
        }
        let dom = document.getElementById(id)
        if (dom) {
            echarts.init(dom).setOption(option)
        }
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
    render() {
        const { intl, onClose, visible, currentContainer } = this.props
        const { name, runVar, envs, image, probe } = currentContainer
        const { args, workDir, command } = runVar || {}
        const { envKey, envValue } = envs || {}
        const { project, repo, tag } = image || {}
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
                value: `${envKey || DEFAULT_EMPTY_LABEL} : ${envValue || DEFAULT_EMPTY_LABEL}`
            },
            {
                label: `${intl.formatMessage({ id: 'Image' })}${intl.formatMessage({ id: 'PullStrategy' })}`,
                value: [project, repo, tag].filter(item => !!item).join('/')
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
                    <Panel header="CPU(m)" forceRender={true} key='cpu' className='w50'>
                        <div id='cpu' className='chartItem'></div>
                    </Panel>
                    <Panel header="Memory(Mi)" forceRender={true} key='memory' className='w50'>
                        <div id='memory' className='chartItem'></div>
                    </Panel>
                </Collapse>
            </DetailDrawer >
        )
    }
}

export default Detail
