/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, Switch, Button, ButtonGroup, Progress } from 'huayunui';
import { Icon, KeyValue } from 'ultraui'
import { Row, Col, Tag, Carousel } from 'antd'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import { ApplicationStatuList, ApplicationSecondStatuList, ApplicationSecondStatuColor, DEFAULT_EMPTY_LABEL } from '~/constants'
import echarts from 'echarts'
import moment from 'moment'

const _ = window._
const pageNum = 4 // 暂定每页走马灯显示4张饼图
class Preview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isAllowVisit: true,
            currentSlide: 0,
            resourceInfor: {}
        }
    }
    componentDidMount() {
        const { detail } = this.props
        this.getResourceInfor()
        this.getIsolationState()
        this.renderPieChart() // 应用状态拼图
    }
    // cpu.memory,storage的饼图和折线图数据
    getResourceInfor = () => {
        HuayunRequest(api.resourceInfor, { id: this.props.detail.id }, {
            success: (res) => {
                this.setState({
                    resourceInfor: res.data
                })
                this.initLineChart('cpu_line', res.data) // cpu折线图
                this.initLineChart('memory_line', res.data) // memory折线图
            }
        })
    }
    // 绘制应用状态
    renderPieChart = () => {
        const { detail: { resourceObjectStatistics } } = this.props
        resourceObjectStatistics && Object.keys(resourceObjectStatistics).forEach((key, index) => {
            this.initResourcePie(key, resourceObjectStatistics[key])
        })
    }
    // 先绘制Carousel的dom树结构，然后再插入pie图
    renderCarousel = () => {
        const { detail: { resourceObjectStatistics } } = this.props
        const pieKeys = resourceObjectStatistics ? Object.keys(resourceObjectStatistics) : []
        const carouselDom = []
        // 每页走马灯上的饼图
        const renderPieDom = (i) => {
            let carouselItem = []
            for (let num = i * pageNum; num < (i + 1) * pageNum; num++) {
                let pieDom = num < pieKeys.length ? (<div id={`${pieKeys[num]}_pie`} key={pieKeys[num]} className="pieChart" />) : null
                carouselItem.push(pieDom)
            }
            return carouselItem
        }
        // 先渲染有多少页走马灯
        for (let i = 0; i < Math.ceil(pieKeys.length / pageNum); i++) {
            carouselDom.push(
                <div key={i} className='carouselItem'>
                    {
                        renderPieDom(i)
                    }
                </div>
            )
        }
        return (
            <Carousel
                ref={node => this.$Carousel = node}
                dots={false}
                className='pieCarousel' >
                { carouselDom}
                <div></div>
            </Carousel >
        )
    }
    getIsolationState = () => {
        const { intl, detail } = this.props
        HuayunRequest(api.getIsolationState, { id: detail.id }, {
            success: (res) => {
                this.setState({
                    isAllowVisit: res.data.isolationState
                })
            }
        })
    }
    handleSwitchChange = (val) => {
        const { isAllowVisit } = this.state
        const { detail } = this.props
        HuayunRequest(api[val ? 'openIsolation' : 'closeIsolation'], { id: detail.id }, {
            success: (res) => {
                this.setState({
                    isAllowVisit: !val
                })
            }
        })
    }
    initResourcePie = (key, { normal, total }) => {
        const { intl } = this.props
        let dom = document.getElementById(`${key}_pie`)
        if (!dom) return
        const pieKey = `$${key}_pie`
        // 防止每次刷新资源对象饼图报warning
        if (this[pieKey] != null && this[pieKey] != "" && this[pieKey] != undefined) {
            this[pieKey].dispose();//销毁
        }
        this[pieKey] = echarts.init(dom) // 初始化echarts
        let option = {
            color: ['#3da4f1', '#f0a332'],
            tooltip: {
                trigger: 'item',
                formatter: '<span>{b}占比：{d}%</span>'
            },
            series: [
                {
                    type: 'pie',
                    radius: ['60%', '80%'],
                    center: ['50%', '50%'],
                    data: [
                        { name: intl.formatMessage({ id: 'Normal' }), value: normal },
                        { name: intl.formatMessage({ id: 'Abnormal' }), value: total - normal }
                    ],
                    labelLine: {
                        normal: {
                            show: false,
                        }
                    },
                    label: {
                        normal: {
                            show: false,
                        }
                    }
                }
            ],
            graphic: {
                type: "text",
                left: "center",
                top: "45%",
                style: {
                    text: key,
                    textAlign: "center",
                    fill: "#333",
                    fontSize: 15,
                    fontWeight: 500
                }
            }
        }
        this[pieKey].setOption(option)
    }
    handleOperCarousel = (type) => {
        const { currentSlide } = this.state
        this.setState({
            currentSlide: currentSlide + type
        })
        this.$Carousel[type === 1 ? 'next' : 'prev']()
    }
    handleQuotaManage = () => {

    }
    handleSeeClusterResources = () => {

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
    handleUpdateApplication = () => {
        this.props.history.push(`${this.props.match.path}/edit/${this.props.detail.id}`)
    }
    render() {
        const { intl, detail } = this.props
        const { isAllowVisit, currentSlide, resourceInfor } = this.state
        const {
            id, name, createrName, createTime, description, tags, resourceObjectDtos, state, secondState, resourceObjectStatistics,
            commandExecuteLogs, applicationType, reversionNum, projectName, updateTime, historyResourceObjectDtos, quota, usedCpu, usedMemory
        } = detail
        const KeyValueData = [
            {
                label: intl.formatMessage({ id: 'Tag' }),
                value: tags && tags.length ? tags.map(tag => {
                    return <Tag color="geekblue" key={item}>{item}</Tag>
                }) : DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'Project' }),
                value: projectName || DEFAULT_EMPTY_LABEL
            }
        ]
        const KeyValueData2 = [
            {
                value: intl.formatMessage({ id: 'CreaterName' }),
                label: createrName || DEFAULT_EMPTY_LABEL
            },
            {
                value: intl.formatMessage({ id: 'CreaterName' }),
                label: createTime || DEFAULT_EMPTY_LABEL
            },
            {
                value: intl.formatMessage({ id: 'IsAllowOutSideVisit' }),
                label: (
                    <div>
                        &nbsp;&nbsp;<Switch checked={isAllowVisit} onChange={() => this.handleSwitchChange(isAllowVisit)} />
                    </div>
                )
            }
        ]
        const carouselPages = resourceObjectStatistics ? Math.floor(Object.keys(resourceObjectStatistics).length / 4) : 0
        const quotaCpu = _.get(quota, 'cpu', 0)
        const quotaMemory = _.get(quota, 'memory', 0)
        const progressGroup = [
            {
                name: `CPU分配(m)`,
                percentText: `${usedCpu}/${quotaCpu}`,
                percentValue: Math.round(usedCpu) / Math.round(quotaCpu) * 100,
                strokeColor: { '0%': '#61AAF0', '100%': '#4C8CCA' }
            },
            {
                name: `Memory(Mi)`,
                percentText: `${usedMemory}/${quotaMemory}`,
                percentValue: Math.round(usedMemory) / Math.round(quotaMemory) * 100,
                strokeColor: { '0%': '#F8C640', '100%': '#F0A332' }
            }
        ]
        return (
            <div className='applicationDetail_preview'>
                <Row gutter={10}>
                    <Col span={8}>
                        <div className='boxContainer'>
                            <div className='boxTitle'>
                                <div className='name_state'>
                                    <div className='appName'>{name}</div>
                                    <Tag color="geekblue" className='appState'>{ApplicationStatuList[state]}</Tag>
                                    <Tag color={secondState === 'NORMAL' ? 'green' : 'red'} className='appSecondState'>{ApplicationSecondStatuList[secondState]}</Tag>
                                </div>
                                <div className='update' onClick={this.handleUpdateApplication}><Icon type='edit-o' />&nbsp;编辑</div>
                            </div>
                            <div className='boxContent'>
                                <div className='description'>{description || DEFAULT_EMPTY_LABEL}</div>
                                <KeyValue values={KeyValueData} />
                            </div>
                            <KeyValue className='otherContent' values={KeyValueData2} />
                        </div>
                    </Col>
                    <Col span={16}>
                        <div className='boxContainer'>
                            <div className='boxTitle'>{intl.formatMessage({ id: 'ApplicationState' })}</div>
                            <div className='boxContent'>
                                {
                                    this.renderCarousel()
                                }
                            </div>
                            <ButtonGroup>
                                <Button type="operate" size='small' icon="icon-left" onClick={() => this.handleOperCarousel(-1)} disabled={currentSlide === 0} />
                                <Button type="operate" size='small' icon="icon-right" onClick={() => this.handleOperCarousel(1)} disabled={currentSlide === carouselPages} />
                            </ButtonGroup>
                        </div>
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={8}>
                        <div className='boxContainer'>
                            <div className='boxTitle'>
                                <div className='name'>
                                    {intl.formatMessage({ id: 'ApplicationQuota' })}
                                </div>
                                <div className='opera'>
                                    <div onClick={this.handleQuotaManage}><Icon type='edit-o' />&nbsp;{intl.formatMessage({ id: 'AppCenterQuotaManage' })}&nbsp;&nbsp;</div>
                                    <div onClick={this.handleSeeClusterResources}><Icon type='listing' />&nbsp;{intl.formatMessage({ id: 'Cluster resources' })}</div>
                                </div>
                            </div>
                            <div className='boxContent'>
                                <div className='progressGroup'>
                                    {
                                        progressGroup.map(item => {
                                            const { name, percentText, percentValue, strokeColor } = item
                                            return (
                                                <div className='progressItem'>
                                                    <div className='summary'>
                                                        <span className='progressName'>{name}</span>
                                                        <span className='progressPercent'>{percentText}</span>
                                                    </div>
                                                    <Progress
                                                        percent={percentValue}
                                                        strokeColor={strokeColor}
                                                        showInfo={false}
                                                    />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={16}>
                        <div className='boxContainer'>
                            <div className='boxTitle'>{intl.formatMessage({ id: 'ResourceUsageMonitor' })}</div>
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
            </div>
        )
    }
}


export default Preview
