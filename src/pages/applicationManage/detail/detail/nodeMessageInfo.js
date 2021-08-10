/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Button, Icon, Loading, SortTable, Dialog } from 'ultraui'
import { Table } from 'huayunui'
import './index.less'
import moment from 'moment'
import { DEFAULT_EMPTY_LABEL } from '~/constants'

const _ = window._

class NodeMessageInfo extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props)
    }

    getNodeEventsTableColumns() {
        const { intl } = this.props
        const columns = [ // 表格的列数组配置
            {
                key: 'lastUpdateTime',
                dataIndex: 'lastUpdateTime',
                title: intl.formatMessage({ id: 'LastUpdateTime' }),
                render: (lastUpdateTime) => {
                    let time = _.get(lastUpdateTime, 'millis', '')
                    return time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : '-'
                }
            },
            {
                key: 'message',
                dataIndex: 'message',
                title: intl.formatMessage({ id: 'Message' }),
                render: (val) => val || DEFAULT_EMPTY_LABEL
            },
            {
                key: 'reason',
                dataIndex: 'reason',
                title: intl.formatMessage({ id: 'Reason' }),
                render: (val) => val || DEFAULT_EMPTY_LABEL
            },
        ]
        return columns
    }

    render() {
        const { intl, tableData } = this.props
        return (
            <Table
                columns={this.getNodeEventsTableColumns()}
                dataSource={tableData}
                pagination={false}
            />
        )
    }
}

export default NodeMessageInfo
