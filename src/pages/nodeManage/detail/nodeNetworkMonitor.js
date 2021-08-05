/* eslint-disable */
import React from 'react'
import { RcForm, Icon, Loading, SortTable, Dialog, Radio, Input, Button as UltrauiButton, KeyValue, TagItem, InlineInput, Notification, NoData } from 'ultraui'
import './index.less'
import moment from 'moment'
import HuayunRequest from '~/http/request'
import { resource as api } from '~/http/api'
import echarts from 'echarts'
import { renderStateWithDot } from '~/pages/utils'
import { DEFAULT_EMPTY_LABEL } from '~/constants'

const _ = window._
// echart的颜色选择
const colors = ['#80fdff', '#95f203', '#fffb01', '#ec808d'];
class NodeNetworkMonitor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            network_in_Current: 0,
            network_in_Average: 0,
            network_in_Maximun: 0,
            network_in_Total: 0,
            network_out_Current: 0,
            network_out_Average: 0,
            network_out_Maximun: 0,
            network_out_Total: 0
        }
    }
    componentDidMount() {
        this.getNodeNetMonitor()
    }
    componentWillReceiveProps({ nodeName }) {
        nodeName && nodeName !== this.props.nodeName && this.getNodeNetMonitor(nodeName)
    }
    getNodeNetMonitor = (name = this.props.nodeName) => {
        const { intl } = this.props
        HuayunRequest(api.queryNodeNetMonitorData, { name }, {
            success: (res) => {
                let { network_in_rate, network_out_rate } = res.data
                let network_in_Current = 0
                let network_in_Average = 0
                let network_in_Maximun = 0
                let network_in_Total = 0
                let network_out_Current = 0
                let network_out_Average = 0
                let network_out_Maximun = 0
                let network_out_Total = 0
                network_in_rate.forEach((item, index) => {
                    network_in_rate[index][0] = item[0] * 1000
                    // 计算总和
                    network_in_Total = (parseFloat(network_in_Total) + parseFloat(item[1])).toFixed(2)
                    // 计算当前值和平均值
                    if (index === (network_in_rate.length - 1)) {
                        network_in_Current = parseFloat(item[1]).toFixed(2)
                        network_in_Average = (network_in_Total / network_in_rate.length).toFixed(2)
                    }
                    if (item[1] > network_in_Maximun) {
                        network_in_Maximun = parseFloat(item[1]).toFixed(2)
                    }
                })
                network_out_rate.forEach((item, index) => {
                    network_out_rate[index][0] = item[0] * 1000
                    // 计算总和
                    network_out_Total = (parseFloat(network_out_Total) + parseFloat(item[1])).toFixed(2)
                    // 计算当前值和平均值
                    if (index === (network_out_rate.length - 1)) {
                        network_out_Current = parseFloat(item[1]).toFixed(2)
                        network_out_Average = (network_out_Total / network_out_rate.length).toFixed(2)
                    }
                    if (item[1] > network_out_Maximun) {
                        network_out_Maximun = parseFloat(item[1]).toFixed(2)
                    }
                })
                this.setState({
                    network_in_Current, network_in_Average, network_in_Maximun, network_in_Total,
                    network_out_Current, network_out_Average, network_out_Maximun, network_out_Total
                })
                setTimeout(() => {
                    let option = {
                        title: {
                            top: 10,
                            text: '每秒流量',
                            textStyle: {
                                color: '#516F90',
                                fontSize: '12px'
                            }
                        },
                        color: colors,
                        grid: {
                            right: 60,
                            left: 60,
                            top: 50,
                            bottom: 20,
                        },
                        tooltip: {
                            show: true,
                        },
                        xAxis: {
                            name: intl.formatMessage({ id: 'Time' }),
                            type: 'time',
                        },
                        yAxis: [
                            {
                                type: 'value',
                                axisLabel: {
                                    formatter: function (value, index) {
                                        return value ? value + 'M' : 0
                                    }
                                }
                            }
                        ],
                        series: [
                            {
                                type: 'line',
                                stack: '总量',
                                data: network_in_rate
                            },
                            {
                                type: 'line',
                                stack: '总量',
                                data: network_out_rate
                            }
                        ]
                    }
                    let dom = document.getElementById('nodeNetWorkMonitorChart')
                    if (dom) {
                        echarts.init(dom).setOption(option)
                    }
                })
            }
        })
    }
    render() {
        const { intl } = this.props
        const {
            network_in_Current, network_in_Average, network_in_Maximun, network_in_Total,
            network_out_Current, network_out_Average, network_out_Maximun, network_out_Total
        } = this.state
        const network_in_keyValueData = [
            {
                value: '',
                label: renderStateWithDot('bg-success', 'Inbound')
            },
            {
                value: 'Current(M)',
                label: network_in_Current || DEFAULT_EMPTY_LABEL
            },
            {
                value: 'Average(M)',
                label: network_in_Average || DEFAULT_EMPTY_LABEL
            },
            {
                value: 'Maximun(M)',
                label: network_in_Maximun || DEFAULT_EMPTY_LABEL
            },
            {
                value: 'Total In(GB)',
                label: network_in_Total || DEFAULT_EMPTY_LABEL
            },
        ]
        const network_out_keyValueData = [
            {
                value: '',
                label: renderStateWithDot('bg-warning', 'Outbound')
            },
            {
                value: 'Current(M)',
                label: network_out_Current || DEFAULT_EMPTY_LABEL
            },
            {
                value: 'Average(M)',
                label: network_out_Average || DEFAULT_EMPTY_LABEL
            },
            {
                value: 'Maximun(M)',
                label: network_out_Maximun || DEFAULT_EMPTY_LABEL
            },
            {
                value: 'Total In(GB)',
                label: network_out_Total || DEFAULT_EMPTY_LABEL
            },
        ]
        return (
            <div className='nodeNetWorkPanelContainer'>
                <div id='nodeNetWorkMonitorChart'></div>
                <div className='summary'>
                    <KeyValue values={network_in_keyValueData} />
                    <KeyValue values={network_out_keyValueData} />
                </div>
            </div>
        )
    }
}

export default NodeNetworkMonitor
