/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { container as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, SearchBar, Button, Table, Modal, Space, Checkbox, Popover, Tooltip } from 'huayunui'
import { Icon, NoData, Notification, Loading } from 'ultraui'
import { Dropdown, Menu } from 'antd'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import moment from 'moment'

const { RangePicker } = DatePicker
const sizeList = [100, 200, 300, 400, 500]

class Event extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            containerName: '', // 容器名称
            logType: '', // 容器类型
            tail: 100, // 条数
            time: [],
            logList: [],
            containersObj: [], // 下拉搜索的数据
            isFetching: false
        }
    }
    componentDidMount() {
        this.getContainerLogsOptions()
    }
    getContainerLogsOptions = () => {
        const { id: platformContainerId } = this.props.detail
        HuayunRequest(api.getContainerLogsOptions, { platformContainerId }, {
            success: (res) => {
                this.setState({
                    containersObj: res.data.options
                })
            }
        })
    }
    getLogData = () => {
        const { id: platformContainerId } = this.props.detail
        const { containerName, logType, tail, time } = this.state
        if (containerName && logType) {
            const params = {
                platformContainerId,
                containerName,
                logType,
                tail,
                startTime: moment(time[0]).format('YYYY-MM-DD'),
                endTime: moment(time[1]).format('YYYY-MM-DD'),
            }
            this.setState({
                isFetching: true
            })
            HuayunRequest(api.getContainerLogs, params, {
                success: (res) => {
                    this.setState({
                        logList: res.data.logs
                    })
                },
                complete: () => {
                    this.setState({
                        isFetching: false
                    })
                }
            })
        }
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        }, () => {
            if (key === 'containerName') {
                this.setState({
                    logType: ''
                })
            }
            setTimeout(this.getLogData())
        })
    }
    handleDownload = () => {
        const { id: platformContainerId } = this.props.detail
        const { containerName, logType, tail, time } = this.state
        const params = {
            platformContainerId,
            containerName,
            logType,
            tail,
            startTime: moment(time[0]).format('YYYY-MM-DD'),
            endTime: moment(time[1]).format('YYYY-MM-DD'),
        }
        let url = '/api/downloadContainerLogs'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(res => res.blob().then(blob => {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
            var filename = res.headers.get('Content-Disposition').split('filename=')[1];
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        }))
    }
    render() {
        const { intl, detail } = this.props
        const { containerName, logType, tail, time, logList, containersObj, isFetching } = this.state
        const dropdownMenu = (
            <Menu>
                {
                    sizeList.map(item => {
                        return (
                            <Menu.Item
                                key={item}
                                onClick={() => this.handleChange('tail', item)}>
                                {`${item}条`}
                            </Menu.Item>
                        )
                    })
                }
            </Menu>
        )
        return (
            <div className='containerDetail_log'>
                <div className='header'>
                    <div className='searchBar'>
                        <Select
                            style={{ width: 'auto' }}
                            bordered={false}
                            value={containerName}
                            onChange={name => this.handleChange('containerName', name)}
                            placeholder='请选择'
                        >
                            {
                                Object.keys(containersObj).map(name => {
                                    return <Select.Option value={name} key={name}>{name}</Select.Option>
                                })
                            }
                        </Select>
                        <Select
                            style={{ width: 'auto' }}
                            bordered={false}
                            value={logType}
                            onChange={name => this.handleChange('logType', name)}
                            placeholder='请选择'
                            disabled={!containerName}
                        >
                            {
                                (containersObj[containerName] || []).map(item => {
                                    return <Select.Option value={item} key={item}>{item}</Select.Option>
                                })
                            }
                        </Select>
                        <Dropdown overlay={dropdownMenu} trigger={['click']} arrow={true}>
                            <a className="searchItem" onClick={e => e.preventDefault()}>
                                <span>条数{tail}</span>
                                <Icon type="down_t" />
                            </a>
                        </Dropdown>
                        <RangePicker
                            onChange={(val) => this.handleChange('time', val)}
                            themeType="huayun"
                            selectType="dropDown"
                            showData={true}
                        />
                    </div>
                    <ActionAuth action={actions.AdminApplicationCenterContainerOperate}>
                        <Tooltip title='下载'>
                            <Button
                                className='mr8'
                                size="middle-s"
                                type='operate'
                                icon={<Icon type="download" />}
                                disabled={!containerName || !logType}
                                onClick={this.handleDownload} />
                        </Tooltip>
                    </ActionAuth>
                </div>
                <div className='logList'>
                    {
                        isFetching ? <Loading /> : (
                            logList.length ? (
                                logList.map((item, index) => {
                                    return <p key={index}>{item}</p>
                                })
                            ) : <NoData />
                        )
                    }
                </div>
            </div>
        )
    }
}

export default Event
