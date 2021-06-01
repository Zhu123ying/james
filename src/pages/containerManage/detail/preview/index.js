/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { container as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, Switch, Button, ButtonGroup, Progress, Modal, Drawer } from 'huayunui';
import { Icon, KeyValue, Notification } from 'ultraui'
import { Row, Col, Tag, Carousel } from 'antd'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import { ApplicationStatuList, ApplicationSecondStatuList, DEFAULT_EMPTY_LABEL } from '~/constants'
import echarts from 'echarts'
import moment from 'moment'

const notification = Notification.newInstance()
const _ = window._
class Preview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {

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
    render() {
        const { intl, detail } = this.props
        const { name, projectId, projectName, createTime, resource } = detail
        const { cpu, ephemeralStorage, memory, storage } = resource
        const KeyValueData = [
            {
                label: intl.formatMessage({ id: 'ContainerGroupName' }),
                value: name || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'Project' }),
                value: projectName || DEFAULT_EMPTY_LABEL
            }
        ]
        const KeyValueData2 = [
            {
                value: intl.formatMessage({ id: 'CreaterTime' }),
                label: createTime || DEFAULT_EMPTY_LABEL
            },
            {
                value: intl.formatMessage({ id: 'OnlineTime' }),
                label: createTime || DEFAULT_EMPTY_LABEL
            }
        ]
        return (
            <div className='commonDetail_preview containerDetail_preview'>
                <Row gutter={10}>
                    <Col span={8}>
                        <div className='boxContainer'>
                            <div className='boxTitle activeBefore'>{intl.formatMessage({ id: 'BasicInfo' })}</div>
                            <div className='boxContent'>
                                <KeyValue values={KeyValueData} />
                            </div>
                            <KeyValue className='otherContent' values={KeyValueData2} />
                        </div>
                    </Col>
                    <Col span={16}>
                        <div className='boxContainer'>
                            <div className='boxTitle activeBefore'>{intl.formatMessage({ id: 'QuotaStatistics' })}</div>
                            <div className='boxContent'>
    
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div className='boxContainer'>
                            <div className='boxTitle activeBefore'>{intl.formatMessage({ id: 'ResourceUsageMonitor' })}</div>
                            <div className='boxContent'>

                            </div>
                        </div>
                    </Col>
                </Row>
            </div >
        )
    }
}

export default Preview
