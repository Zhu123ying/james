/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Notification, Button, TagItem, Switch } from 'ultraui'
import { Collapse, Button as HuayunButton, Table } from 'huayunui'
import '../index.less'
const _ = window._

class AddContactorModal extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        const { selectedRowKeys }  = props
        this.state = {
            selectedRowKeys
        }
    }
    getTableColumns = () => {
        const { intl } = this.props
        return [
            {
                title: intl.formatMessage({ id: 'Contactor' }),
                dataIndex: 'name'
            },
            {
                title: intl.formatMessage({ id: 'Email' }),
                dataIndex: 'email'
            },
            {
                title: intl.formatMessage({ id: 'Phone' }),
                dataIndex: 'phone'
            }
        ]
    }
    handleSelectedRowChange = (keys) => {
        this.setState({
            selectedRowKeys: keys
        })
    }
    render() {
        const { intl, tableData } = this.props
        const { selectedRowKeys } = this.state
        return (
            <Table
                columns={this.getTableColumns()}
                dataSource={tableData}
                pagination={false}
                rowSelection={{
                    selectedRowKeys,
                    onChange: (keys) => {
                        this.handleSelectedRowChange(keys)
                    }
                }}
                rowKey='id'
            />
        )
    }
}

export default AddContactorModal
