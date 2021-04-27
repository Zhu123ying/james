/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, message } from 'huayunui';
import { Icon } from 'ultraui'
import ApplicationDetail from './detail'
import './index.less'
import { Notification } from 'ultraui'
const notification = Notification.newInstance()
const { RangePicker } = DatePicker;
class ApplicationManage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            createTime: [],
            tags: [],
            projectId: '',
            dataList: [], // 列表数据
            applicationId: '', // 当前的应用
            pageNumber: 1,
            pageSize: 10,
        }
    }
    componentDidMount() {
        this.handleSearch()
    }
    handleSearchParamChange = (key, value) => {
        this.setState({
            key: value
        }, () => {
            this.handleSearch()
        })
    }
    handleSearch = () => {
        const { name, createTime, tags, projectId, pageNumber, pageSize } = this.state
        const params = {
            pageNumber,
            pageSize,
            conditions: {
                name,
                startTime: createTime[0],
                endTime: createTime[0],
                tags,
                projectId
            }
        }
        HuayunRequest(api.list, params, {
            success: (res) => {
                this.setState({
                    dataList: res.data.datas
                })
            },
            fail: (res) => {
                notification.notice({
                    id: 'getApplicationlistError',
                    type: 'danger',
                    title: '错误提示',
                    content: res.message,
                    iconNode: 'icon-error-o',
                    duration: 30,
                    closable: true
                })
            }
        })
    }
    render() {
        const { intl } = this.props
        const { name, createTime, tags, projectId, dataList, applicationId } = this.state
        const searchItems = [
            <RangePicker
                onChange={(val) => this.handleSearchParamChange('createTime', val)}
                themeType="huayun"
                selectType="dropDown"
                customerPlaceholder={intl.formatMessage({ id: 'CreateTime' })}
                value={createTime}
                key='RangePicker'
            />,
            <Select
                placeholder={intl.formatMessage({ id: 'Project' })}
                style={{ width: 'auto' }}
                bordered={false}
                onChange={(val) => this.handleSearchParamChange('createTime', val)}>
                <Select.Option value="jack">Jack</Select.Option>
            </Select>,
            <Select
                mode="tags"
                allowClear
                placeholder={intl.formatMessage({ id: 'Tag' })}
                style={{ width: 'auto' }}
                bordered={false}
                onChange={(val) => this.handleSearchParamChange('tags', val)}
                dropdownRender={(originNode) => (<div>{originNode}</div>)}
            >
                <Select.Option value="jack">Jaasasasck</Select.Option>
            </Select >
        ]
        return (
            <div id='applicationCenter_layout' className='applicationManage'>
                <div className='searchBar'>{searchItems}</div>
                <div className='content'>
                    <div className='tableContent'>
                        <div className='nameSearch'>
                            <Input.Search
                                placeholder={intl.formatMessage({ id: 'Search' })}
                                onSearch={(val) => this.handleSearchParamChange('name', val)}
                            />
                        </div>
                    </div>
                    <div className='detailContent'>
                        <ApplicationDetail
                            applicationId={applicationId}
                            intl={intl} />
                    </div>
                </div>
            </div>
        )
    }
}

ApplicationManage.propTypes = {
    intl: PropTypes.object
}

export default ApplicationManage
