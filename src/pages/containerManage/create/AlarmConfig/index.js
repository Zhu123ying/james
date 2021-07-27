/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber, Icon, Switch } from 'ultraui'
import { Collapse, Button as HuayunButton, Modal, Table } from 'huayunui'
import Regex from '~/utils/regex'
import '../index.less'
import AddAlarmContactorModal from './addContactorModal'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
class AlarmConfig extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {
            isModalVisible: false
        }
    }
    componentDidMount() {

    }
    handleFormDataOnChange = (key, val) => {
        let { handleFormChange, formData: { alert } } = this.props
        const value = _.get(val, 'target.value', val)
        _.set(alert, key, value)
        handleFormChange('alert', { ...alert })
    }
    // 删除是通用的，因为知道key了就能删
    handleRemoveFormDataItem = (key, index) => {
        let { handleFormChange, formData } = this.props
        let array = _.get(formData, key, [])
        array.splice(index, 1)
        handleFormChange('formData', { ...formData })
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
            },
            {
                title: intl.formatMessage({ id: 'Operate' }),
                dataIndex: 'id',
                render: (val, row, index) => {
                    return (
                        <HuayunButton
                            type="link"
                            name={intl.formatMessage({ id: 'Delete' })}
                            onClick={() => this.handleRemoveFormDataItem(`alert.users`, index)}
                        />
                    )
                },
                fixed: 'right',
            }
        ]
    }
    handleStateOnChange = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    handleModalConfirm = () => {
        const { selectedRowKeys } = this.$AddAlarmContactorModal.state
        this.handleFormDataOnChange('users', selectedRowKeys)
        this.setState({
            isModalVisible: false
        })
    }
    render() {
        const { form, intl, formData: { alert }, handleFormChange, alertUserList, alertTemplateList } = this.props
        const template = _.get(alert, 'template', '')
        const enabled = _.get(alert, 'enabled', true)
        const users = _.get(alert, 'users', []) || []
        const tableData = alertUserList.filter(item => users.indexOf(item.id) > -1)
        const { isModalVisible } = this.state
        return (
            <div className='AlarmConfig'>
                <Panel
                    form={form}
                    value={enabled}
                    name='AlarmConfigEnabled'
                    label='默认启用'
                    inline
                    isRequired
                    className='switchPanel'
                >
                    <Switch checked={enabled} onChange={(val) => this.handleFormDataOnChange(`enabled`, val)}></Switch>
                </Panel>
                {
                    enabled ? (
                        <React.Fragment>
                            <Select
                                form={form}
                                name="AlarmConfigTemplate"
                                value={template}
                                placeholder={intl.formatMessage({ id: 'SelectProjectPlaceHolder' })}
                                onChange={(val) => this.handleFormDataOnChange('template', val)}
                                label={intl.formatMessage({ id: 'AlarmTemplate' })}
                                isRequired
                                options={
                                    alertTemplateList.map(item => {
                                        return {
                                            value: item.id,
                                            text: item.name,
                                        }
                                    })
                                }
                                optionFilterProp='children'
                                optionLabelProp='children'
                            />
                            <Panel
                                form={form}
                                value={users}
                                name='AlarmConfigUsers'
                                label='告警联系人'
                                inline
                                isRequired
                                className='contactorPanel'
                            >
                                <Table
                                    columns={this.getTableColumns()}
                                    dataSource={tableData}
                                    pagination={false}
                                />
                                <HuayunButton
                                    type="operate"
                                    icon={<Icon type="add" />}
                                    onClick={() => this.handleStateOnChange('isModalVisible', true)}
                                    name="添加联系人"
                                    className='addBoxItemBtn'
                                />
                            </Panel>
                        </React.Fragment>
                    ) : null
                }
                <Modal
                    title='添加联系对象'
                    visible={isModalVisible}
                    onOk={this.handleModalConfirm}
                    onCancel={() => this.handleStateOnChange('isModalVisible', false)}
                    className='addAlarmContactorModal'
                    destroyOnClose={true}
                    width={680}
                >
                    <AddAlarmContactorModal
                        intl={intl}
                        tableData={alertUserList}
                        selectedRowKeys={users}
                        ref={node => this.$AddAlarmContactorModal = node} />
                </Modal>
            </div>
        )
    }
}

export default AlarmConfig
