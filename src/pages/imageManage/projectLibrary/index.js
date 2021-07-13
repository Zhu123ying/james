/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { image as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, message, Button } from 'huayunui';
import './index.less'
import { Notification, Loading, Icon } from 'ultraui'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import ProjectRepoList from './projectRepoList'

const notification = Notification.newInstance()
class ProjectLibrary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            dataList: [], // 列表数据
            currentTableItem: {}, // 当前的应用
            pageNumber: 1,
            pageSize: 30,
            isFetching: false
        }
    }
    componentDidMount() {
        this.handleSearch(true)
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
        let { name: nameLike, pageNumber, pageSize, currentTableItem } = this.state
        const params = {
            pageNumber,
            pageSize,
            conditions: {
                nameLike
            }
        }
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.getImageProjectList, params, {
            success: (res) => {
                const { datas, total } = res.data
                this.setState({
                    dataList: datas,
                    // 需要更新currentTableItem
                    currentTableItem: isResetCurrentTableItem ? (datas[0] || {}) : datas.find(item => item.id === currentTableItem.id),
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
        let dom = e.currentTarget
        let viewH = dom.clientHeight
        let contentH = dom.scrollHeight
        let scrollTop = dom.scrollTop
        if (scrollTop === (contentH - viewH)) {
            this.setState({
                pageSize: this.state.pageSize + 30
            }, () => {
                this.handleSearch()
            })
        }
    }
    render() {
        const { intl } = this.props
        const { name, dataList, currentTableItem, isFetching } = this.state
        return (
            <div id='applicationCenter_layout' className='projectLibrary'>
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
                                            const { id, name, updateTime, init } = item
                                            return (
                                                <div
                                                    className={`tableItem ${currentTableItem.id === id ? 'activeTableItem' : ''}`}
                                                    onClick={() => this.handleChangeTableItem(item)} >
                                                    <div className='basicInfo'>
                                                        <div className='stateLineWithDot'>
                                                            <div className={`stateDot ${init ? 'bg-success' : 'bg-danger'}`}></div>
                                                            {name}
                                                        </div>
                                                        <div className='bottomInfo'>{updateTime}</div>
                                                    </div>
                                                    <div className='status'></div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className='detailContainer'>
                                <ProjectRepoList
                                    refreshTableList={this.handleSearch}
                                    projectInitState={currentTableItem.init}
                                    projectId={currentTableItem.id}
                                    {...this.props} />
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default ProjectLibrary
