/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, Switch } from 'huayunui';
import { Icon, KeyValue } from 'ultraui'
import { Row, Col, Tag, Carousel } from 'antd'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import { ApplicationStatuList, ApplicationSecondStatuList, ApplicationSecondStatuColor, DEFAULT_EMPTY_LABEL } from '~/constants'
import echarts from 'echarts'

const pageNum = 4; // 暂定每页走马灯显示4张饼图
class Preview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isAllowVisit: true
        }
    }
    componentDidMount() {
        this.getIsolationState()
        this.renderPieChart()
    }
    // 绘制应用状态
    renderPieChart = (pageIndex = 0) => {
        const { detail: { resourceObjectStatistics } } = this.props
        resourceObjectStatistics && Object.keys(resourceObjectStatistics).forEach((key, index) => {
            // 做个条件判断，只渲染区间里的饼图，算是个小优化
            if ((index < (pageIndex + 1) * pageNum) && (index >= pageIndex * pageNum)) {
                this.initResourcePie(key, resourceObjectStatistics[key])
            }
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
            <Carousel className='pieCarousel' afterChange={(index) => this.renderPieChart(index)}>
                {carouselDom}
            </Carousel>
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
    render() {
        const { intl, detail } = this.props
        const { isAllowVisit } = this.state
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
        const contentStyle = {

        };
        return (
            <div className='applicationDetail_preview'>
                <Row gutter={20}>
                    <Col span={8}>
                        <div className='boxContainer'>
                            <div className='boxTitle'>
                                <div className='name_state'>
                                    <div className='appName'>{name}</div>
                                    <Tag color="geekblue" className='appState'>{ApplicationStatuList[state]}</Tag>
                                    <Tag color={secondState === 'NORMAL' ? 'green' : 'red'} className='appSecondState'>{ApplicationSecondStatuList[secondState]}</Tag>
                                </div>
                                <div className='update'><Icon type='edit-o' />&nbsp;编辑</div>
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
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}


export default Preview
