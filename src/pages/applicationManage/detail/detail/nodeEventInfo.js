/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Button, Icon, Loading, SortTable, Dialog } from 'ultraui'
import { Table } from 'huayunui'
import './index.less'
import { resource as api } from '~/http/api'
import HuayunRequest from '~/http/request'

const _ = window._

class NodeEventInfo extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            isFetching: false
        }
    }

    componentDidMount() {
        this.getNodeEvents()
    }

    getNodeEvents = () => {
        const { name, namespace } = this.props
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.listEvents, { name, namespace }, {
            success: (res) => {
                this.setState({
                    tableData: res.data
                })
            },
            complete: (res) => {
                this.setState({
                    isFetching: false
                })
            }
        })
    }

    getNodeEventsTableColumns() {
        const { intl } = this.props
        const columns = [ // 表格的列数组配置
            {
                key: 'message',
                dataIndex: 'message',
                title: intl.formatMessage({ id: 'Message' })
            },
            {
                key: 'source',
                dataIndex: 'source',
                title: intl.formatMessage({ id: 'Resource' }),
                render: (source) => {
                    let str = ''
                    source && Object.keys(source).map(key => {
                        str += `${key}:${source[key]} `
                    })
                    return str
                }
            },
            {
                key: 'subobject',
                dataIndex: 'subobject',
                title: intl.formatMessage({ id: 'Subobject' })
            },
            {
                key: 'count',
                dataIndex: 'count',
                title: intl.formatMessage({ id: 'Frequency' })
            },
            {
                key: 'firstTimestamp',
                dataIndex: 'firstTimestamp',
                title: intl.formatMessage({ id: 'FirstTime' })
            },
            {
                key: 'lastTimestamp',
                dataIndex: 'lastTimestamp',
                title: intl.formatMessage({ id: 'LastTime' })
            },
        ]
        return columns
    }

    render() {
        const { intl } = this.props
        const { isFetching, tableData } = this.state

        return (
            <React.Fragment>
                {
                    isFetching ? <Loading /> : (
                        <Table
                            columns={this.getNodeEventsTableColumns()}
                            dataSource={tableData}
                            pagination={false}
                        />
                    )
                }
            </React.Fragment>
        )
    }
}


export default NodeEventInfo
