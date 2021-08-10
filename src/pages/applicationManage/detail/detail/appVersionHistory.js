/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Button, Icon, Loading, SortTable, Dialog } from 'ultraui'
import { Table } from 'huayunui'
import './index.less'
import { formatChartValues } from '~/pages/utils'
import HuayunRequest from '~/http/request'
import { application as api } from '~/http/api'

const _ = window._

class AppVersionHistory extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            expandedRowBtnType: [], // 某一行展开行显示的是values还是template, 2显示template,其他显示values
            tableData: [],
            isFetching: false,
        }
    }

    componentDidMount() {
        this.queryApplicationVersionHistory()
    }

    queryApplicationVersionHistory = () => {
        const { detail: { id } } = this.props
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.queryApplicationVersionHistory, { applicationId: id }, {
            success: (res) => {
                this.setState({
                    tableData: res.data
                })
            },
            complete: () => {
                this.setState({
                    isFetching: false
                })
            }
        })
    }

    getTableColumns = () => {
        const { intl } = this.props
        return [
            {
                title: intl.formatMessage({ id: 'ApplicationVersion' }),
                dataIndex: 'revision',
                render: (val, row, index) => {
                    return index + 1
                }
            },
            {
                title: intl.formatMessage({ id: 'UpdateTime' }),
                dataIndex: 'updateTime'
            },
            {
                title: intl.formatMessage({ id: 'Status' }),
                dataIndex: 'status'
            },
            {
                title: intl.formatMessage({ id: 'AppPackage' }),
                dataIndex: 'packageName'
            },
            {
                title: intl.formatMessage({ id: 'Version' }),
                dataIndex: 'packageVersion'
            },
            // {
            //     dataIndex: 'id',
            //     key: 'operate',
            //     minCalcuWidth: 100,
            //     title: intl.formatMessage({ id: 'Operate' }),
            //     render: (id, data) => {
            //         return (
            //             <Button type="text" onClick={() => this.handleViewClick(id)}>{intl.formatMessage({ id: 'View' })}</Button>
            //         )
            //     }
            // }
        ]
    }

    expandedRowRender = (row, index, indent, expanded) => {
        const { expandedRowBtnType } = this.state
        return (
            <div className='rowRender'>
                <Button.List>
                    <Button type={expandedRowBtnType[index] !== 2 ? 'primary' : 'default'} onClick={() => this.handleSelectType(index, 1)}>Values</Button>
                    <Button type={expandedRowBtnType[index] === 2 ? 'primary' : 'default'} onClick={() => this.handleSelectType(index, 2)}>Template</Button>
                </Button.List>
                <div className='rowRenderContent'>
                    <div className="chartValues" dangerouslySetInnerHTML={{ __html: expandedRowBtnType[index] !== 2 ? formatChartValues(row.configInfo) : formatChartValues(row.templateInfo) }}></div>
                </div>
            </div>
        )
    }

    handleSelectType = (index, type) => {
        const { expandedRowBtnType } = this.state
        expandedRowBtnType[index] = type
        this.setState({
            expandedRowBtnType: [...expandedRowBtnType]
        })
    }

    render() {
        const { intl, detail } = this.props
        const { tableData, isFetching } = this.state

        return (
            <>
                {
                    isFetching ? <Loading /> : <Table
                        rowKey={row => row.id}
                        dataSource={tableData}
                        columns={this.getTableColumns()}
                        expandedRowRender={this.expandedRowRender}
                        rowExpandable={() => true}
                        pagination={false}
                    />
                }
            </>
        )
    }
}

export default AppVersionHistory
