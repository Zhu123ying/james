/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, message, Button } from 'huayunui';
import ApplicationDetail from './detail'
import './index.less'
import { Notification, Loading, Icon } from 'ultraui'
import { ApplicationStatuList, ApplicationSecondStatuColor } from '~/constants'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'

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
            currentApplication: {}, // 当前的应用
            pageNumber: 1,
            pageSize: 10,
            isFetching: false
        }
    }
    componentDidMount() {
        this.addCreateApplicationButton()
        this.handleSearch()
    }
    componentWillUnmount(){
        this.props.handleExtra({
            extraChildren: null
        })
    }
    addCreateApplicationButton = () => {
        const { handleExtra, intl } = this.props
        handleExtra({
            extraChildren: (
                <ActionAuth action={actions.AdminApplicationCenterApplicationOperate}>
                    <Button
                        type="primary"
                        size="large"
                        icon="icon-add"
                        onClick={this.handleCreateApplication}
                        name={intl.formatMessage({ id: 'CreateApplication' })}
                    />
                </ActionAuth>
            ),
            border: false
        })
    }
    handleCreateApplication = () => {
        this.props.history.push(`${this.props.match.path}/create`)
    }
    handleSearchParamChange = (key, val, isFetch = true) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        }, () => {
            isFetch && this.handleSearch()
        })
    }
    handleSearch = (isResetCurrentApplication = false) => {
        const { name, createTime, tags, projectId, pageNumber, pageSize, currentApplication } = this.state
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
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.list, params, {
            success: (res) => {
                const { data: { datas } } = res
                this.setState({
                    dataList: datas,
                    currentApplication: (!isResetCurrentApplication && datas[0]) ? datas[0] : currentApplication,
                    isFetching: false
                })
            },
            fail: (res) => {
                notification.notice({
                    id: 'getApplicationlistError',
                    type: 'danger',
                    title: '错误提示',
                    content: res.message,
                    iconNode: 'icon-error-o',
                    duration: 5,
                    closable: true
                })
                this.setState({
                    isFetching: false
                })
            }
        })
    }
    handleChangeTableItem = (item) => {
        this.setState({
            currentApplication: item
        })
    }
    render() {
        const { intl } = this.props
        const { name, createTime, tags, projectId, dataList, currentApplication, isFetching } = this.state
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
                {
                    isFetching ? <Loading /> : (
                        <div className='content'>
                            <div className='tableContent'>
                                <div className='nameSearch'>
                                    <Input.Search
                                        value={name}
                                        placeholder={intl.formatMessage({ id: 'Search' })}
                                        onChange={(val) => this.handleSearchParamChange('name', val, false)}
                                        onSearch={this.handleSearch}
                                    />
                                </div>
                                <div className='tableList'>
                                    {
                                        dataList.map(item => {
                                            const { id, name, projectName, state, secondState } = item
                                            return (
                                                <div
                                                    className={`tableItem ${currentApplication.id === id ? 'activeItem' : ''}`}
                                                    onClick={() => this.handleChangeTableItem(item)} >
                                                    <div className='appInfor'>
                                                        <div className='appName'>
                                                            <div className={`appSecondStatu ${ApplicationSecondStatuColor[secondState]}`}></div>{name}
                                                        </div>
                                                        <div className='projectName'>{projectName}</div>
                                                    </div>
                                                    <div className='appStatu'></div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className='detailContent'>
                                {
                                    currentApplication.id ? (
                                        <ApplicationDetail
                                            refreshTableList={this.handleSearch}
                                            currentApplication={currentApplication}
                                            {...this.props} />
                                    ) : null
                                }
                            </div>
                        </div>
                    )
                }
            </div >
        )
    }
}

ApplicationManage.propTypes = {
    intl: PropTypes.object
}

export default ApplicationManage
