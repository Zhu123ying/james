/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Notification, Loading } from 'ultraui'
import { Button, Collapse, Table } from 'huayunui'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import './index.less'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
const _ = window._
const { Panel } = Collapse;
class ManageTaskNode extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired,
    }
    constructor(props) {
        super(props)
        const { taskNodeList, currentTaskNode } = props
        this.state = {
            taskNodeList,
            currentTaskNode,
            selectedRowKeys: [], // 左侧选中的selectedRowKeys
        }
    }
    // componentDidMount() {
    // }
    renderPanelTitle = (index) => {
        const { intl } = this.props
        const { taskNodeList } = this.state
        switch (index) {
            case 0:
                return intl.formatMessage({ id: 'InitialNodeResource' })
                break
            case parseInt(taskNodeList.length - 1):
                return intl.formatMessage({ id: 'TargetNodeResource' })
                break
            default:
                return intl.formatMessage({ id: 'PreviousNodeResource' })
                break
        }
    }
    renderLeftPanelHeader = (index) => {
        const { intl } = this.props
        return (
            <div className='panelHeader'>
                <div className='panelTitle'>{this.renderPanelTitle(index)}</div>
                <Button
                    onClick={() => this.handleAddResource}
                    type="link"
                    name={<div><Icon type='add' />{intl.formatMessage({ id: 'Add' })}</div>}
                    href="#" />
            </div>
        )
    }
    renderRightBoxHeader = () => {
        return (
            <div className='panelHeader'>
                <div className='panelTitle'>{intl.formatMessage({ id: 'CurrentNodeResource' })}</div>
                <div className='operaGroup'>
                    <Button
                        onClick={() => this.handleAddResourceManually}
                        type="link"
                        name={<div><Icon type='add' />{intl.formatMessage({ id: 'Add' })}</div>}
                        href="#" />
                    <Button
                        onClick={() => this.handleDeleteResource}
                        type="link"
                        name={<div><Icon type='empty' />{intl.formatMessage({ id: 'Delete' })}</div>}
                        href="#" />
                </div>
            </div>
        )
    }
    handleAddResource = () => {

    }
    handleAddResourceManually = () => {

    }
    handleDeleteResource = () => {

    }
    getTableColumns = () => {
        const { intl } = this.props
        return [
            {
                key: 'name',
                dataIndex: 'name',
                title: intl.formatMessage({ id: 'Name' }),
                render: (name) => name || DEFAULT_EMPTY_LABEL
            },
            {
                key: 'kind',
                dataIndex: 'kind',
                title: intl.formatMessage({ id: 'Type' }),
                render: (kind) => name || DEFAULT_EMPTY_LABEL
            },
            {
                key: 'num',
                dataIndex: 'num',
                title: intl.formatMessage({ id: 'NumberOfCopies' }),
                render: (num) => name || DEFAULT_EMPTY_LABEL
            }
        ]
    }
    onSelectChange = (keys, other) => {
        console.log(keys)
        console.log(other)
    }
    render() {
        const { intl } = this.props
        const { taskNodeList, currentTaskNode, selectedRowKeys } = this.state
        return (
            <React.Fragment>
                <div className='header'>
                    <span className='title'>{intl.formatMessage({ id: 'SelectResource' })}</span>
                    <Button type="link" name={<Icon type='info-o' />} href="#" />
                </div>
                <div className='body'>
                    <div className='boxItem'>
                        <Collapse defaultActiveKey={[this.renderPanelTitle(0)]}>
                            {
                                taskNodeList.map((item, index) => {
                                    const header = this.renderLeftPanelHeader(index)
                                    const title = this.renderPanelTitle(index)
                                    return (
                                        <Panel header={header} key={title}>
                                            <Table
                                                columns={this.getTableColumns()}
                                                dataSource={item.resourceInfo || []}
                                                pagination={false}
                                                rowSelection={{
                                                    selectedRowKeys,
                                                    onChange: this.onSelectChange,
                                                }}
                                                rowKey='name'
                                            />
                                        </Panel>
                                    )
                                })
                            }
                        </Collapse>
                    </div>
                    <div className='boxItem'></div>
                </div>
            </React.Fragment>
        )
    }
}

export default ManageTaskNode
