/* eslint-disable */
import React from 'react'
import { RcForm, Icon, Loading, SortTable, Dialog, Radio, Input, Button as UltrauiButton, KeyValue, TagItem, InlineInput, Notification, NoData } from 'ultraui'
import './index.less'
import moment from 'moment'
import HuayunRequest from '~/http/request'
import { resource as api } from '~/http/api'

const _ = window._
// echart的颜色选择
const colors = ['#80fdff', '#95f203', '#fffb01', '#ec808d'];
class NodeNetworkMonitor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false
        }
    }
    componentWillReceiveProps({ nodeName }) {
        nodeName && nodeName !== this.props.nodeName && this.getNodeNetMonitor(nodeName)
    }
    getNodeNetMonitor = () => {
        const { intl, nodeName: name } = this.props
        this.setState({
            isFetching: true
        })
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
                setTimeout(() => {
                    let legendData = [
                        `Inbound Current: ${network_in_Current}M | Average: ${network_in_Average}M | Maximun: ${network_in_Maximun}M | Total In: ${network_in_Total}GB`,
                        `Outbound Current:${network_out_Current} M | Average: ${network_out_Average}M | Maximun: ${network_out_Maximun}M | Total Out: ${network_out_Total}GB`
                    ]
                    let option = {
                        title: {
                            top: 10,
                            text: '每秒流量'
                        },
                        color: colors,
                        grid: {
                            right: 60,
                            left: 60,
                            top: 50,
                            bottom: 20,
                        },
                        legend: {
                            top: 5,
                            left: 'right',
                            icon: 'roundRect',
                            data: legendData,
                            orient: 'vertical',  //垂直显示
                            align: 'left',
                            itemGap: 5
                        },
                        tooltip: {},
                        xAxis: {
                            name: intl.formatMessage({ id: 'Time' }),
                            type: 'time',
                        },
                        yAxis: [
                            {
                                type: 'value',
                                axisLabel: {
                                    formatter: function (value, index) {
                                        return value + 'Byte';
                                    }
                                }
                            }
                        ],
                        series: [
                            {
                                name: legendData[0],
                                type: 'line',
                                stack: '总量',
                                areaStyle: {},
                                data: network_in_rate
                            },
                            {
                                name: legendData[1],
                                type: 'line',
                                stack: '总量',
                                areaStyle: {},
                                data: network_out_rate
                            }
                        ]
                    }
                    let dom = document.getElementById('nodeNetWorkMonitorChart')
                    if (dom) {
                        echarts.init(dom).setOption(option)
                    }
                })
            },
            complete: () => {
                this.setState({
                    isFetching: false
                })
            }
        })
    }
    render() {
        const { intl } = this.props
        const { isFetching } = this.state
        return (
            <>
                {
                    isFetching ? <Loading /> : (
                        <div id='nodeNetWorkMonitorChart'></div>
                    )
                }
            </>
        )
    }
}

export default NodeNetworkMonitor
