/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { container as api, application } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, message, Button } from 'huayunui';
import ContainerDetail from './detail'
import './index.less'
import { Notification, Loading, Icon } from 'ultraui'
import { ContainerStateList, ContainerStatusList } from '~/constants'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'

const notification = Notification.newInstance()
const { RangePicker } = DatePicker;
class ContainerManage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            projectId: '',
            createTime: [],
            dataList: [], // 列表数据
            currentTableItem: {}, // 当前的应用
            pageNumber: 1,
            pageSize: 10,
            isFetching: false,
            projectList: [], // 项目列表
        }
    }
    componentDidMount() {
        this.addCreateApplicationButton()
        this.getProjectList()
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
                <ActionAuth action={actions.AdminApplicationCenterContainerOperate}>
                    <Button
                        type="primary"
                        size="large"
                        icon="icon-add"
                        onClick={this.handleCreate}
                        name={intl.formatMessage({ id: 'CreateContainerGroup' })}
                    />
                </ActionAuth>
            ),
            border: false
        })
    }
    handleCreate = () => {
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
    handleSearch = (isResetCurrentTableItem = false) => {
        const { name: nameLike, createTime, projectId, pageNumber, pageSize, currentTableItem } = this.state
        const params = {
            pageNumber,
            pageSize,
            nameLike,
            projectId,
            createTimeStart: createTime[0],
            createTimeEnd: createTime[1]
        }
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.list, params, {
            success: (res) => {
                const { data: { platformContainers } } = res
                this.setState({
                    dataList: platformContainers,
                    currentTableItem: (isResetCurrentTableItem && platformContainers[0]) ? platformContainers[0] : currentTableItem,
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
            currentTableItem: item
        })
    }
    render() {
        const { intl } = this.props
        const { name, createTime, projectId, dataList, currentTableItem, isFetching, projectList } = this.state
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
            </Select>
        ]
        return (
            <div id='applicationCenter_layout' className='containerManage'>
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
                                            const { id, name, projectName, state, secondState, containerCount } = item
                                            return (
                                                <div
                                                    className={`tableItem ${currentTableItem.id === id ? 'activeTableItem' : ''}`}
                                                    onClick={() => this.handleChangeTableItem(item)} >
                                                    <div className='basicInfo'>
                                                        <div className='stateLineWithDot'>
                                                            <div className={`stateDot ${secondState === 'NORMAL' ? 'bg-success' : 'bg-danger'}`}></div>
                                                            {`${name}(${containerCount})`}
                                                        </div>
                                                        <div className='bottomInfo'>{projectName}</div>
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
                                    currentTableItem.id ? (
                                        <ContainerDetail
                                            refreshTableList={this.handleSearch}
                                            currentTableItem={currentTableItem}
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

export default ContainerManage
