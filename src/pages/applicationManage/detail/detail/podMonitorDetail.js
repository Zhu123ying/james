/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Icon, Loading, SortTable, Dialog, Radio, Input } from 'ultraui'
import './index.less'
import { formatChartValues } from '../../../utils'
import echarts from 'echarts'
import moment from 'moment'
import HuayunRequest from '~/http/request'
import { application as api } from '~/http/api'
import DetailDrawer from '~/components/DetailDrawer'
import { Collapse, Select, Button } from 'huayunui'
import { Row, Col } from 'antd'
const _ = window._
const { Panel } = Collapse

class PodMonitorDetail extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props)
        this.state = {
            containerName: '',
            lastTerminatedContainer: false, // 是否查询上一个终止的容器的日志
            since: '', // 最后多少秒内的日志
            podInfo: {}, // pod的信息
            podLog: '', // 日志内容
            isFetching: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.namespace !== this.props.namespace) {
            this.handleRefresh(nextProps)
        }
    }

    getChartLineData = (props) => {
        const { name, namespace } = props
        HuayunRequest(api.queryPodResourceInfo, { name, namespace }, {
            success: (res) => {
                const { cpu_usage_rate, memory_usage_rate } = res.data
                cpu_usage_rate && this.renderChart('cpu', 'CPU(%)', cpu_usage_rate)
                memory_usage_rate && this.renderChart('memory', 'Memory(Mi)', memory_usage_rate)
            }
        })
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

    queryPodInfo = (props) => {
        const { name, namespace } = props
        HuayunRequest(api.queryPodInfo, { name, namespace }, {
            success: (res) => {
                const containerName = _.get(res.data, 'status.containerStatuses.0.name', '')
                this.setState({
                    podInfo: res.data,
                    containerName
                }, () => {
                    this.handleSearchPodLog(props)
                })
            }
        })
    }

    handleSearchPodLog = (props) => {
        const { name: podName, namespace } = props
        const { containerName, lastTerminatedContainer, since } = this.state
        let params = {
            podName, namespace, containerName, lastTerminatedContainer, since
        }
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.getPodLogs, params, {
            success: (res) => {
                this.setState({
                    podLog: res.log
                })
            },
            complete: () => {
                this.setState({
                    isFetching: false
                })
            }
        })
    }
    handleRefresh = (props) => {
        this.getChartLineData(props) // 获取图表的数据
        this.queryPodInfo(props) // 获取pod的描述
    }
    renderLogSearchBar = () => {
        const { intl } = this.props
        const { podInfo, lastTerminatedContainer, containerName, since } = this.state
        const containerList = _.get(podInfo, 'status.containerStatuses', [])
        return (
            <div className='header' onClick={e => e.stopPropagation()}>
                <div className='title'>{intl.formatMessage({ id: 'Log' })}</div>
                <div className='logSearchBar'>
                    <Select
                        value={containerName}
                        style={{ width: 120 }}
                        bordered={false}
                        onSelect={(val) => this.handleChange('containerName', val)}
                    >
                        {
                            containerList.map((item) => {
                                return <Select.Option value={item.name} key={item.containerID}>{item.name}</Select.Option>
                            })
                        }
                    </Select>
                    <div className='right'>
                        <Radio
                            name="lastTerminatedContainer"
                            inline
                            onClick={() => this.handleChange('lastTerminatedContainer', !lastTerminatedContainer)}
                            checked={lastTerminatedContainer}
                            title="上一个终止的容器"
                        />
            最后&nbsp;
            <Input
                            onChange={(val) => this.handleChange('since', val)}
                            value={since}
                            type='number'
                            unit="s" />
                        <Icon type='search' onClick={() => this.handleSearchPodLog(this.props)} />
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { intl, name, onClose, visible } = this.props
        const { podLog, podInfo, isFetching } = this.state
        const podDescribe = _.get(podInfo, 'data.data.describe', '')

        return (
            <DetailDrawer
                name={name}
                onRefresh={() => this.handleRefresh(this.props)}
                onClose={onClose}
                visible={visible}
            >
                {
                    isFetching ? <Loading /> : null
                }
                <div id='podMonitorDetail'>
                    <Row gutter={20} className='cpu_memory_cost'>
                        <Col span={12}>
                            <Collapse defaultActiveKey={['cpu']}>
                                <Panel header="CPU开销(核)" forceRender={true} key='cpu'>
                                    <div id='cpu' className='chartItem'></div>
                                </Panel>
                            </Collapse>
                        </Col>
                        <Col span={12}>
                            <Collapse defaultActiveKey={['memory']}>
                                <Panel header="Memory开销(Gi)" forceRender={true} key='memory'>
                                    <div id='memory' className='chartItem'></div>
                                </Panel>
                            </Collapse>
                        </Col>
                    </Row>
                    <Collapse defaultActiveKey={['resourceDes']}>
                        <Panel header="资源描述" key='resourceDes'>
                            <div className="podInfo" dangerouslySetInnerHTML={{ __html: formatChartValues(podInfo) }}></div>
                        </Panel>
                    </Collapse>
                    <Collapse className='log-collapse'>
                        <Panel header={this.renderLogSearchBar()}>
                            <div className="chartValues" dangerouslySetInnerHTML={{ __html: formatChartValues(podLog) }}></div>
                        </Panel>
                    </Collapse>
                </div >
            </DetailDrawer >
        )
    }
}

export default PodMonitorDetail
