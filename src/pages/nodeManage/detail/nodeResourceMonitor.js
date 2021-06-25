/* eslint-disable */
import React from 'react'
import { RcForm, Icon, Loading, SortTable, Dialog, Radio, Input, Button as UltrauiButton, KeyValue, TagItem, InlineInput, Notification, NoData } from 'ultraui'
import { Collapse } from 'huayunui'
import './index.less'
import HuayunRequest from '~/http/request'
import { resource as api } from '~/http/api'
import echarts from 'echarts'
import { DEFAULT_EMPTY_LABEL } from '~/constants'

const { Panel } = Collapse
const _ = window._

class ResourceMonitor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {
        this.getNodeResourceMonitor()
    }
    componentWillReceiveProps({ nodeName }) {
        nodeName && nodeName !== this.props.nodeName && this.getNodeResourceMonitor(nodeName)
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
                    // 节点资源监控的三张柱状图
                    // this.renderNodeResourceMonitorBarEchart('CPU(核)', [capacityCpu, allocatableCpu, requestCpu, limitCpu], 'cpuMonitor')
                    // this.renderNodeResourceMonitorBarEchart('Memory(Gi)', [capacityMemory, allocatableMemory, requestMemory, limitMemory], 'memoryMonitor')
                    // this.renderNodeResourceMonitorBarEchart('Ephemeral-storage(Gi)', [capacityEphemeralStorage, allocatableEphemeralStorage, requestEphemeralStorage, limitEphemeralStorage], 'storageMonitor')
          
                  })
            }
        })
    }
    renderNodeResourceMonitorBarEchart = (data, id) => {
        let option = {
            color: ['#4C8CCA'],
            grid: {
                right: 60,
                left: 60,
                top: 50,
                bottom: 20,
            },
            xAxis: {
                name: intl.formatMessage({ id: 'Time' }),
                type: 'time',
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function (value, index) {
                        return value + '%';
                    }
                }
            },
            series: [{
                data: data,
                type: 'line'
            }]
        }
        let dom = document.getElementById(`${id}Chart`)
        if (dom) {
            echarts.init(dom).setOption(option)
        }
    }
    render() {
        const { intl } = this.props
        return (
            <Collapse defaultActiveKey={['1', '2', '3']} className='resourceMonitorPanel'>
                <Panel header='CPU(%)' key='1' >
                    <div className='chartItem'>
                        <div className='panelHeader'>
                            <span>波段趋势(最近10s)</span>
                            <div>当前<span>4.9%</span></div>
                        </div>
                        <div id='cpuChart'></div>

                    </div>
                    <div className='summary'>

                    </div>
                </Panel>
            </Collapse >
        )
    }
}

export default ResourceMonitor
