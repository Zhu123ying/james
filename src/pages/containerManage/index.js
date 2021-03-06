/* eslint-disable */
import React from 'react'
import { container as api, application } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, message, Button } from 'huayunui';
import ContainerDetail from './detail'
import './index.less'
import { Notification, Loading, Icon, NoData } from 'ultraui'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import { ContainerGroupStateDomList, ContainerGroupSecondStateColorList } from '~/constants'
import moment from 'moment'

const notification = Notification.newInstance()
const { RangePicker } = DatePicker
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
            pageSize: 30,
            isFetching: false,
            projectList: [], // 项目列表
            total: 0
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
            createTimeStart: createTime[0] ? moment(createTime[0]).format('YYYY-MM-DD') : undefined,
            createTimeEnd: createTime[1] ? moment(createTime[1]).format('YYYY-MM-DD') : undefined
        }
        isResetCurrentTableItem && this.setState({
            isFetching: true
        })
        HuayunRequest(api.list, params, {
            success: (res) => {
                const { data: { platformContainers, totalRecord } } = res
                this.setState({
                    dataList: platformContainers,
                    total: totalRecord,
                    currentTableItem: isResetCurrentTableItem ? (platformContainers[0] || {}) : currentTableItem,
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
    handleScroll = (e) => {
        const { total, dataList } = this.state
        let dom = e.currentTarget
        let viewH = dom.clientHeight
        let contentH = dom.scrollHeight
        let scrollTop = dom.scrollTop
        if (scrollTop === (contentH - viewH) && dataList.length !== total) {
            this.setState({
                pageSize: this.state.pageSize + 30
            }, () => {
                this.handleSearch()
            })
        }
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
            />,
            <Select
                placeholder={intl.formatMessage({ id: 'Project' })}
                style={{ width: 'auto' }}
                dropdownMatchSelectWidth={false}
                bordered={false}
                onChange={(val) => this.handleSearchParamChange('projectId', val)}>
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
                                <div className='tableList' onScroll={this.handleScroll}>
                                    {
                                        dataList.map(item => {
                                            const { id, name, projectName, state, status, containerCount } = item
                                            return (
                                                <div
                                                    className={`tableItem ${currentTableItem.id === id ? 'activeTableItem' : ''}`}
                                                    onClick={() => this.handleChangeTableItem(item)} >
                                                    <div className='basicInfo'>
                                                        <div className='stateLineWithDot'>
                                                            <div className={`stateDot ${ContainerGroupSecondStateColorList[status]}`}></div>
                                                            {`${name}(${containerCount})`}
                                                        </div>
                                                        <div className='bottomInfo'>{projectName}</div>
                                                    </div>
                                                    <div className='status'>{ContainerGroupStateDomList[state]}</div>
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
                                    ) : <NoData />
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
