/* eslint-disable */
import React from 'react'
import { Loading, Notification, NoData, Icon } from 'ultraui'
import './index.less'
import HuayunRequest from '~/http/request'
import { application as api } from '~/http/api'
import DetailDrawer from '~/components/DetailDrawer'
import { Collapse, Select, Button, Popover, Modal, Tabs, Table, DatePicker } from 'huayunui'
import { Dropdown, Menu } from 'antd'

const { Panel } = Collapse
const { RangePicker } = DatePicker
const _ = window._
const sizeList = [100, 200, 300, 400, 500]
class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            logList: [],
            size: sizeList[0],
            time: []
        }
    }
    componentDidMount() {
        this.getLogData()
    }
    componentWillReceiveProps({ currentDataItem }) {
        if (currentDataItem !== this.props.currentDataItem) {
            const { id, type } = currentDataItem
            this.getLogData(id, type)
        }
    }
    getLogData = (id = this.props.currentDataItem.id, type = this.props.currentDataItem.type) => {
        const { size, time } = this.state
        const params = {
            id, type, size,
            startTime: time[0],
            endTime: time[1]
        }
        HuayunRequest(api.queryContainerLog, params, {
            success: (res) => {
                this.setState({
                    logList: res.data
                })
            }
        })
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        }, () => {
            this.getLogData()
        })
    }
    logPanelHeader = () => {
        const { time, size } = this.state
        const dropdownMenu = (
            <Menu>
                {
                    sizeList.map(item => {
                        return (
                            <Menu.Item
                                key={item}
                                onClick={() => this.handleChange('size', item)}>
                                {`每页${item}条`}
                            </Menu.Item>
                        )
                    })
                }
            </Menu>
        )
        const searchItems = [
            <RangePicker
                onChange={(val) => this.handleChange('time', val)}
                themeType="huayun"
                selectType="dropDown"
                customerPlaceholder='时间'
                value={time}
            />,
            <Dropdown overlay={dropdownMenu} trigger={['click']} arrow={true}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    <span>条数{size}</span>
                    <Icon type="down_t" />
                </a>
            </Dropdown>
        ]
        return (
            <div className='searchBtn' onClick={e => e.stopPropagation()}>{searchItems}</div>
        )
    }
    render() {
        const { intl, onClose, visible, currentDataItem } = this.props
        const { logList, size, time } = this.state
        return (
            <DetailDrawer
                name={currentDataItem.name}
                icon='log-1'
                onRefresh={this.getLogData}
                onClose={onClose}
                visible={visible}
                className='applicationLogDetailDrawer'
            >
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={this.logPanelHeader()} key='1'>
                        {
                            logList.length ? (
                                <div className='logList'>
                                    {
                                        logList.map((item, index) => {
                                            return <p key={index}>{item}</p>
                                        })
                                    }
                                </div>
                            ) : <NoData />
                        }
                    </Panel>
                </Collapse>
            </DetailDrawer>
        )
    }
}

export default Detail
