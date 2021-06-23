/* eslint-disable */
import React from 'react'
import { resource as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, message, Button, Modal } from 'huayunui';
import './index.less'
import { Notification, Loading, Icon } from 'ultraui'
import TableCommon from '~/components/TableCommon'
import moment from 'moment'
import echarts from 'echarts'
import DetailIcon from '~/components/DetailIcon'
import Detail from './detail'

const notification = Notification.newInstance()
class NodeManage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            dataList: [], // 列表数据
            pageNumber: 1,
            pageSize: 10,
            total: 0,
            isFetching: false,
            isDetailDrawerVisible: false, // 详情抽屉
            currentNode: {}
        }
    }
    componentDidMount() {
        this.handleSearch()
    }
    handleSearch = () => {
        const { name, pageNumber, pageSize } = this.state
        const params = {
            pageNumber,
            pageSize,
            conditions: {
                name
            }
        }
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.listNode, params, {
            success: (res) => {
                this.setState({
                    dataList: res.data
                }, () => {
                    setTimeout(() => {
                        res.data.forEach((item, index) => {
                            const { cpuUsed, memoryUsed, load } = item
                            this.renderChart('cpu', index, cpuUsed)
                            this.renderChart('memory', index, memoryUsed)
                            this.renderChart('load', index, load)
                        })
                    })
                })
            },
            complete: (res) => {
                this.setState({
                    isFetching: false
                })
            }
        })
    }
    getColums = () => {
        const { intl } = this.props
        return [
            {
                dataIndex: 'name',
                key: 'name',
                title: intl.formatMessage({ id: 'Name' }),
                render: (value, row) => {
                    return (
                        <>
                            <DetailIcon iconType="warehouse" className="m-r-sm" />
                            <a onClick={() => this.handleSeeNodeDetail(row)}>{value}</a>
                        </>
                    )
                }
            },
            {
                dataIndex: 'ready',
                key: 'ready',
                title: intl.formatMessage({ id: 'Status' }),
                render: (ready) => {
                    const readyState = Boolean(ready === 'True')
                    return (
                        <div className='nodeState'>
                            <div className={`stateDot ${readyState ? 'bg-success' : 'bg-danger'}`}></div>
                            &nbsp;{readyState ? 'ready' : 'nodeReady'}
                        </div>
                    )
                }
            },
            {
                dataIndex: 'roles',
                key: 'roles',
                title: '节点类型'
            },
            {
                dataIndex: 'cpuUsed',
                key: 'cpuUsed',
                title: 'CPU使用率(%)',
                className: 'chartCell',
                render: (cpuUsed, row, index) => {
                    return <div id={`cpu${index}`} className='chartItem'></div>
                }
            },
            {
                dataIndex: 'memoryUsed',
                key: 'memoryUsed',
                title: 'Memory使用值(GB)',
                className: 'chartCell',
                render: (cpuUsed, row, index) => {
                    return <div id={`memory${index}`} className='chartItem'></div>
                }
            },
            {
                dataIndex: 'load',
                key: 'load',
                title: '负载情况(m)',
                className: 'chartCell',
                render: (cpuUsed, row, index) => {
                    return <div id={`load${index}`} className='chartItem'></div>
                }
            }
        ]
    }
    renderChart = (type, index, data) => {
        const { intl } = this.props
        let xAxisData = []
        let seriesData = []
        Array.isArray(data) && data.forEach(item => {
            xAxisData.push(moment(item[0]).format('HH:mm:ss'))
            seriesData.push(parseFloat(item[1]))
        })
        let option = {
            color: ['#4C8CCA'],
            grid: {
                top: 20,
                bottom: 0,
                right: 0,
                left: 0
            },
            xAxis: {
                show: false,
                name: intl.formatMessage({ id: 'Time' }),
                type: 'category',
                data: xAxisData
            },
            yAxis: {
                show: false,
                name: type.toUpperCase(),
                type: 'value'
            },
            series: [{
                data: seriesData,
                type: 'line',
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 0.6// 0.1的线条是非常细的了
                        }
                    }
                },
            }]
        }
        let dom = document.getElementById(`${type}${index}`)
        if (dom) {
            echarts.init(dom).setOption(option)
        }
    }
    handleTableChange = ({ pageNumber, pageSize, name }) => {
        this.setState({
            pageNumber, pageSize, name
        }, () => {
            this.handleSearch()
        })
    }
    handleSeeNodeDetail = (item) => {
        this.setState({
            isDetailDrawerVisible: true,
            currentNode: item
        })
    }
    handleChange = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    render() {
        const { intl } = this.props
        const { name, pageNumber, pageSize, isFetching, dataList, total, currentNode, isDetailDrawerVisible } = this.state
        const params = {
            pageNumber,
            pageSize,
            name
        }
        return (
            <div className='NodeManage'>
                <TableCommon
                    searchOption={{
                        key: 'name',
                        title: intl.formatMessage({ id: 'Name' })
                    }}
                    paramsAlias={{
                        name: {
                            title: '名称'
                        }
                    }}
                    uniqueId='applicationCenter_NodeManage'
                    params={params}
                    onRefresh={this.handleSearch}
                    onTableChange={this.handleTableChange}
                    total={total}
                    columns={this.getColums()}
                    loading={isFetching}
                    data={dataList}
                    checkable={false}
                    rowKey='name'
                />
                <Detail
                    intl={intl}
                    nodeName={currentNode.name}
                    nodeAddress={currentNode.address}
                    visible={isDetailDrawerVisible}
                    onClose={() => this.handleChange('isDetailDrawerVisible', false)}
                ></Detail>
            </div>
        )
    }
}

export default NodeManage
