/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, Switch, Button, ButtonGroup, Progress, Modal, Drawer, Popover } from 'huayunui';
import { Icon, KeyValue, Notification, Button as UltrauiButton } from 'ultraui'
import { Row, Col, Tag, Carousel } from 'antd'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import { ApplicationStatuList, ApplicationSecondStatuList, DEFAULT_EMPTY_LABEL } from '~/constants'
import echarts from 'echarts'
import moment from 'moment'
import QuotaManage from './quotaManage'
import ClusterResources from './clusterResources'
import EditApplication from '../EditApplication'

const notification = Notification.newInstance()
const _ = window._
const pageNum = 4 // 暂定每页走马灯显示4张饼图
class Preview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isAllowVisit: true,
            currentSlide: 0,
            resourceInfor: {
                cpu_usage_rate: [],
                memory_usage_rate: []
            },
            netWorkMonitorData: {
                network_out_rate: [],
                network_in_rate: []
            },
            isQuotaManageModalVisible: false, // 配额管理模态框是否显示
            isClusterResourcesDrawerVisible: false, // 集群资源是否显示
            availableQuotaData: {}, // 剩余可用配额
            isApplicationEditModalVisible: false, // 编辑应用
        }
    }
    componentDidMount() {
        this.getNetworkMonitorData() // 网络监控数据
        this.getResourceInfor() // 资源使用监控数据
        this.getIsolationState()
        this.renderPieChart() // 应用状态拼图
        this.getAvailableQuota()
    }
    componentWillReceiveProps({ detail }) {
        if (detail !== this.props.detail) {
            this.getNetworkMonitorData() // 网络监控数据
            this.getResourceInfor()
            this.renderPieChart()
        }
    }
    // 获取剩余可用配额
    getAvailableQuota = () => {
        HuayunRequest(api.getAvailableQuota, { projectId: this.props.detail.projectId }, {
            success: (res) => {
                this.setState({
                    availableQuotaData: res.data
                })
            }
        })
    }
    // 网络监控数据
    getNetworkMonitorData = () => {
        HuayunRequest(api.queryApplicationNetMonitorData, { id: this.props.detail.id }, {
            success: (res) => {
                this.setState({
                    netWorkMonitorData: res.data || {
                        network_out_rate: [],
                        network_in_rate: []
                    }
                })
                this.renderNetworkLineChart() // cpu折线图
            }
        })
    }
    // cpu.memory,storage的饼图和折线图数据
    getResourceInfor = () => {
        HuayunRequest(api.resourceInfor, { id: this.props.detail.id }, {
            success: (res) => {
                this.setState({
                    resourceInfor: res.data || {
                        cpu_usage_rate: [],
                        memory_usage_rate: []
                    }
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
                {carouselDom}
                {pieKeys.length > pageNum ? <div></div> : null}
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
    handleConfirmQuotaManage = () => {
        const { intl, detail: { id }, getDetail } = this.props
        this.$QuotaManage.props.form.validateFields((error, values) => {
            if (error) {
                return false
            }
            const { cCPU, cMemory, storageInfo } = this.$QuotaManage.state
            let params = {
                id,
                quota: {
                    cCPU, cMemory, storageInfo
                }
            }
            HuayunRequest(api.updateApplicationQuota, params, {
                success: (res) => {
                    notification.notice({
                        id: new Date(),
                        type: 'success',
                        title: intl.formatMessage({ id: 'Success' }),
                        content: `${intl.formatMessage({ id: 'Operate' })}${intl.formatMessage({ id: 'Success' })}`,
                        iconNode: 'icon-success-o',
                        duration: 5,
                        closable: true
                    })
                    this.setState({
                        isQuotaManageModalVisible: false
                    }, () => {
                        // 要刷新详情页
                        getDetail(id)
                    })
                }
            })
        })
    }
    initLineChart = (id, detail) => {
        if (!this[`$${id}`]) {
            this[`$${id}`] = echarts.init(document.getElementById(id))// 初始化echarts
        }
        // 设置options
        this[`$${id}`].setOption(this.getLineOption(id, detail))
    }
    // cpu和memory的线图
    getLineOption = (id, detail) => {
        const type = id.replace('_line', '')
        const { intl } = this.props
        const { cpu_usage_rate, memory_usage_rate } = detail
        let data = type === 'cpu' ? cpu_usage_rate : memory_usage_rate
        let xAxisData = []
        let seriesData = []
        Array.isArray(data) && data.forEach(item => {
            xAxisData.push(moment(item[0] * 1000).format('HH:mm:ss'))
            const yData = parseFloat(item[1]).toFixed(2)
            seriesData.push(parseFloat(yData))
        })
        const color = type === 'cpu' ? '#4c8cca' : '#ed6f4d'
        let option = {
            color: [color],
            grid: {
                left: 35,
                top: 10,
                right: 5,
                bottom: 20
            },
            tooltip: {
                show: true,
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
    // 网络的线图
    renderNetworkLineChart = () => {
        const { netWorkMonitorData } = this.state
        let network_in_rate = _.get(netWorkMonitorData, 'network_in_rate') || []
        let network_out_rate = _.get(netWorkMonitorData, 'network_out_rate') || []
        if (!this.$network_line) {
            this.$network_line = echarts.init(document.getElementById('network_line'))// 初始化echarts
        }
        network_in_rate.forEach((item, index) => {
            const yData = parseFloat(item[1]).toFixed(2)
            network_in_rate[index][1] = parseFloat(yData)
        })
        network_out_rate.forEach((item, index) => {
            const yData = parseFloat(item[1]).toFixed(2)
            network_out_rate[index][1] = parseFloat(yData)
        })
        // 设置options
        this.$network_line.setOption({
            color: ['#80fdff', '#95f203'],
            grid: {
                left: 30,
                top: 10,
                right: 5,
                bottom: 20
            },
            tooltip: {
                show: true,
            },
            xAxis: {
                type: 'time',
                axisLabel: {
                    formatter: function (value, index) {
                        return moment(value * 1000).format('HH:mm:ss')
                    }
                },
                axisLabel: {
                    interval: 50
                }
            },
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    type: 'line',
                    stack: '入',
                    data: network_in_rate
                },
                {
                    type: 'line',
                    stack: '出',
                    data: network_out_rate
                }
            ]
        })
    }
    handleSetState = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    renderQuotaManageModalTitle = () => {
        const { intl } = this.props
        return (
            <div className='quotaManageModalTitle'>
                {intl.formatMessage({ id: 'AppCenterQuotaManage' })}
                <Popover
                    placement="top"
                    content={this.renderQuotaAvailablePopover()}
                    type="text"
                    getPopupContainer={() => document.querySelector('.quotaManageModalTitle')}
                >
                    &nbsp;<i className='iconfont icon-view' />
                </Popover>
            </div>
        )
    }
    renderQuotaAvailablePopover = () => {
        const { intl } = this.props
        const { availableQuotaData } = this.state
        const avail_cEphemeralStorage = _.get(availableQuotaData, 'availableStorageQuota.cEphemeralStorage', 0)
        const avail_cStorage = _.get(availableQuotaData, 'availableStorageQuota.cStorage', 0)
        return <div className='quotaAvailablePopoverContent'>
            <div className='title'>{intl.formatMessage({ id: 'RemainingAvailableQuota' })}</div>
            <div className='lineItem'><span>容器CPU(m)</span><div className='dottedLine'></div>{availableQuotaData.cCPU}</div>
            <div className='lineItem'><span>容器内存(Mi)</span><div className='dottedLine'></div>{availableQuotaData.cMemory}</div>
            <div className='lineItem'><span>容器宿主机存储(Gi)</span><div className='dottedLine'></div>{avail_cEphemeralStorage}</div >
            <div className='lineItem'><span>容器持久存储(Gi)</span><div className='dottedLine'></div>{avail_cStorage}</div>
        </div >
    }
    handleConfirmEditApplication = () => {
        const { intl, detail: { id }, getDetail } = this.props
        this.$EditApplication.props.form.validateFields(['name', 'description', 'tags'], (errs, values) => {
            if (!errs) {
                const { name, description, tags } = this.$EditApplication.state
                let data = {
                    id, name, description, tags
                }
                let content = `${intl.formatMessage({ id: 'Update' })}${intl.formatMessage({ id: 'Application' })}`
                HuayunRequest(api.update, data, {
                    success: (res) => {
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${content}'${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                        this.setState({
                            isApplicationEditModalVisible: false
                        })
                        getDetail(id)
                    }
                })
            }
        })
    }
    render() {
        const { intl, detail } = this.props
        const { isAllowVisit, currentSlide, resourceInfor, isQuotaManageModalVisible, isClusterResourcesDrawerVisible, availableQuotaData, isApplicationEditModalVisible, netWorkMonitorData } = this.state
        const {
            id, name, createrName, createTime, description, tags, resourceObjectDtos, state, secondState, resourceObjectStatistics, projectId,
            commandExecuteLogs, applicationType, reversionNum, projectName, updateTime, historyResourceObjectDtos, quota
        } = detail
        const { cEphemeralStorageAllocated, cEphemeralStorageTotal, cStorageAllocated, cStorageTotal, cpuAllocated, memoryAllocated } = resourceInfor
        const KeyValueData = [
            {
                label: intl.formatMessage({ id: 'Tag' }),
                value: tags && tags.length ? tags.map(item => {
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
                value: intl.formatMessage({ id: 'CreateTime' }),
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
        const quotaCpu = _.get(quota, 'cCPU', 0)
        const quotaMemory = _.get(quota, 'cMemory', 0)
        const progressGroup = [
            {
                name: `容器CPU`,
                percentText: `${cpuAllocated}/${quotaCpu}`,
                percentValue: Math.round(cpuAllocated) / Math.round(quotaCpu) * 100,
                strokeColor: { '0%': '#61AAF0', '100%': '#4C8CCA' }
            },
            {
                name: `容器内存`,
                percentText: `${memoryAllocated}/${quotaMemory}`,
                percentValue: Math.round(memoryAllocated) / Math.round(quotaMemory) * 100,
                strokeColor: { '0%': '#F8C640', '100%': '#F0A332' }
            },
            {
                name: `容器宿主机存储(Gi)`,
                percentText: `${cEphemeralStorageAllocated}/${cEphemeralStorageTotal}`,
                percentValue: Math.round(cEphemeralStorageAllocated) / Math.round(cEphemeralStorageTotal) * 100,
                strokeColor: { '0%': '#F0A332 ', '100%': '#F8C640' }
            },
            {
                name: `容器持久存储(Gi)`,
                percentText: `${cStorageAllocated}/${cStorageTotal}`,
                percentValue: Math.round(cStorageAllocated) / Math.round(cStorageTotal) * 100,
                strokeColor: { '0%': '#5AB55E', '100%': '#5AB55E' }
            },
        ]
        const currentCpu = _.get(resourceInfor.cpu_usage_rate.pop(), '1', 0)
        const currentMemory = _.get(resourceInfor.memory_usage_rate.pop(), '1', 0)
        const current_network_in_rate = _.get(netWorkMonitorData.network_in_rate.pop(), '1', 0)
        const current_network_out_rate = _.get(netWorkMonitorData.network_out_rate.pop(), '1', 0)
        return (
            <div className='commonDetail_preview applicationDetail_preview'>
                <Row gutter={10} className='topRow'>
                    <Col span={8}>
                        <div className='boxContainer'>
                            <div className='boxTitle activeBefore'>
                                <div className='name_state'>
                                    <div className='appName'>{name}</div>
                                    <Tag color="geekblue" className='appState'>{ApplicationStatuList[state]}</Tag>
                                    <Tag color={secondState === 'NORMAL' ? 'green' : 'red'} className='appSecondState'>
                                        {ApplicationSecondStatuList[secondState] || (state === 'config' ? '配置中' : '未知')}
                                    </Tag>
                                </div>
                                <ActionAuth action={actions.AdminApplicationCenterApplicationOperate}>
                                    <UltrauiButton type='text' className='p7-0' onClick={() => this.handleSetState('isApplicationEditModalVisible', true)}><Icon type='edit-o' />&nbsp;{intl.formatMessage({ id: 'Edit' })}</UltrauiButton>
                                </ActionAuth>
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
                            <div className='boxTitle activeBefore'>{intl.formatMessage({ id: 'ApplicationState' })}</div>
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
                <Row gutter={10} className='bottomRow'>
                    <Col span={8}>
                        <div className='boxContainer'>
                            <div className='boxTitle activeBefore'>
                                <div className='name'>
                                    {intl.formatMessage({ id: 'ApplicationQuota' })}
                                </div>
                                <div className='operaGroup'>
                                    <ActionAuth action={actions.AdminApplicationCenterApplicationQuotaManage}>
                                        <UltrauiButton type='text' className='p7-0' onClick={() => this.handleSetState('isQuotaManageModalVisible', true)}>
                                            <Icon type='edit-o' />{intl.formatMessage({ id: 'AppCenterQuotaManage' })}&nbsp;&nbsp;
                                        </UltrauiButton>
                                    </ActionAuth>
                                    <ActionAuth action={actions.AdminApplicationCenterApplicationQuotaManage}>
                                        <UltrauiButton type='text' className='p7-0' onClick={() => this.handleSetState('isClusterResourcesDrawerVisible', true)}>
                                            <Icon type='listing' />{intl.formatMessage({ id: 'Cluster resources' })}
                                        </UltrauiButton>
                                    </ActionAuth>
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
                            <div className='boxTitle activeBefore'>{intl.formatMessage({ id: 'ResourceUsageMonitor' })}</div>
                            <div className='boxContent cpu_memory_monitor'>
                                <div className='monitorItem'>
                                    <div className='summary'>
                                        <span className='name'>CPU(%)</span>
                                        <span className='value'>{parseFloat(currentCpu) ? parseFloat(currentCpu).toFixed(2) + '%' : 0}</span>
                                    </div>
                                    <div id="cpu_line" className="lineItem" />
                                </div>
                                <div className='monitorItem'>
                                    <div className='summary'>
                                        <span className='name'>Memory(Mi)</span>
                                        <span className='value'>{currentMemory ? currentMemory + 'Mi' : 0}</span>
                                    </div>
                                    <div id="memory_line" className="lineItem" />
                                </div>
                                <div className='monitorItem'>
                                    <div className='summary'>
                                        <span className='name'>{intl.formatMessage({ id: 'Network' })}</span>
                                        <span className='value'>{`${parseFloat(current_network_in_rate).toFixed(2)} / ${parseFloat(current_network_out_rate).toFixed(2)}`}</span>
                                    </div>
                                    <div id="network_line" className="lineItem" />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Modal
                    title={this.renderQuotaManageModalTitle()}
                    visible={isQuotaManageModalVisible}
                    onOk={this.handleConfirmQuotaManage}
                    onCancel={() => this.handleSetState('isQuotaManageModalVisible', false)}
                    className='quotaManageDialog'
                    destroyOnClose={true}
                    width={512}
                >
                    <QuotaManage
                        intl={intl}
                        projectId={projectId}
                        quota={quota}
                        availableQuotaData={availableQuotaData}
                        wrappedComponentRef={node => this.$QuotaManage = node} />
                </Modal>
                <ClusterResources
                    intl={intl}
                    id={id}
                    visible={isClusterResourcesDrawerVisible}
                    onClose={() => this.handleSetState('isClusterResourcesDrawerVisible', false)}
                ></ClusterResources>
                <Modal
                    title={`${intl.formatMessage({ id: 'Edit' })}${intl.formatMessage({ id: 'Application' })}`}
                    visible={isApplicationEditModalVisible}
                    onOk={this.handleConfirmEditApplication}
                    onCancel={() => this.handleSetState('isApplicationEditModalVisible', false)}
                    className='applicationEditModalVisible'
                    destroyOnClose={true}
                >
                    <EditApplication
                        intl={intl}
                        detail={detail}
                        wrappedComponentRef={node => this.$EditApplication = node} />
                </Modal>
            </div >
        )
    }
}


export default Preview
