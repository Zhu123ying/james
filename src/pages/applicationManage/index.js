/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, message, Button } from 'huayunui';
import ApplicationDetail from './detail'
import './index.less'
import { Notification, Loading, Icon } from 'ultraui'
import { ApplicationStatuList } from '~/constants'
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
            isFetching: false,
            projectList: [], // 项目列表
        }
    }
    componentDidMount() {
        this.addCreateApplicationButton()
        this.handleSearch(true)
    }
    componentWillUnmount() {
        this.props.handleExtra({
            extraChildren: null
        })
    }
    // 获取项目列表
    getProjectList = () => {
        let params = {
            pageNumber: 1,
            pageSize: 10000
        }
        HuayunRequest(application.listProject, params, {
            success: (res) => {
                this.setState({
                    projectList: res.data
                })
            }
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
        // 此处的请求逻辑有问题，暂不改
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        }, () => {
            isFetch && this.handleSearch(true)
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
                endTime: createTime[1],
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
                    currentApplication: (isResetCurrentApplication && datas[0]) ? datas[0] : currentApplication,
                })
            },
            complete: (res) => {
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
                dropdownMatchSelectWidth={false}
                bordered={false}
                onChange={(arr) => this.handleSearchParamChange('projectId', arr[0])}>
                {
                    projectList.map(({ id, name }) => {
                        return <Select.Option value={id} key={id}>{name}</Select.Option>
                    })
                }
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
                <div className='layoutSearchBar'>{searchItems}</div>
                {
                    isFetching ? <Loading /> : (
                        <div className='layoutContent'>
                            <div className='tableContainer'>
                                <div className='nameSearch'>
                                    <Input.Search
                                        value={name}
                                        placeholder={intl.formatMessage({ id: 'Search' })}
                                        onChange={(val) => this.handleSearchParamChange('name', val, false)}
                                        onSearch={() => this.handleSearch(true)}
                                    />
                                </div>
                                <div className='tableList'>
                                    {
                                        dataList.map(item => {
                                            const { id, name, projectName, state, secondState } = item
                                            return (
                                                <div
                                                    className={`tableItem ${currentApplication.id === id ? 'activeTableItem' : ''}`}
                                                    onClick={() => this.handleChangeTableItem(item)} >
                                                    <div className='basicInfo'>
                                                        <div className='name'>
                                                            <div className={`stateDot ${secondState === 'NORMAL' ? 'bg-success' : 'bg-danger'}`}></div>
                                                            {name}
                                                        </div>
                                                        <div className='projectName'>{projectName}</div>
                                                    </div>
                                                    <div className='status'></div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className='detailContainer'>
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

export default ApplicationManage
