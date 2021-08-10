/* eslint-disable */
import React from 'react'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber, Icon, Switch } from 'ultraui'
import { Collapse, Button as HuayunButton, Modal, Table } from 'huayunui'
import Regex from '~/utils/regex'
import './index.less'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
class AlarmConfig extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isStart: 0, // 0禁用，1启用
            alarmTemplates: [], // 模板集:[{"id":1},{}]
            notifyUsers: [], // 告警联系人集:[{"id":1},{"id":2}]
        }
    }
    componentDidMount() {
        this.initData()
    }
    initData = () => {
        const { alarmDetail } = this.props
        const isStart = _.get(alarmDetail, 'applicationAlarmConfig.isStart', 0)
        const alarmTemplates = _.get(alarmDetail, 'applicationAlarmConfig.alarmTemplates', []).map(item => item.id)
        const notifyUsers = _.get(alarmDetail, 'applicationAlarmConfig.notifyUsers', []).map(item => item.id)
        this.setState({
            isStart, alarmTemplates, notifyUsers
        })
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    render() {
        const { form, intl, alarmDetail } = this.props
        const alertTemplateList = _.get(alarmDetail, 'allAlarmTemplates', []) // 模板列表
        const alertUserList = _.get(alarmDetail, 'allContacts', []) // 联系人列表
        const { isStart, alarmTemplates, notifyUsers } = this.state
        return (
            <Form
                ref={(node) => { this.form = node }}
                form={form}
                style={{ paddingRight: '0' }}
                className="m-b-lg create_step"
                subMessage
            >
                <Panel
                    form={form}
                    value={isStart}
                    name='isStart'
                    label='默认启用'
                    inline
                    className='switchPanel'
                >
                    <Switch checked={isStart} onChange={(val) => this.handleChange(`isStart`, val ? 1 : 0)}></Switch>
                </Panel>
                <Select
                    form={form}
                    name="alarmTemplates"
                    mode="multiple"
                    allowClear
                    value={alarmTemplates}
                    placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: '模板' })}
                    onChange={(val) => this.handleChange('alarmTemplates', val)}
                    label={intl.formatMessage({ id: 'AlarmTemplate' })}
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
                <Select
                    form={form}
                    name="notifyUsers"
                    mode="multiple"
                    allowClear
                    value={notifyUsers}
                    placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'AlarmContact' }) })}
                    onChange={(val) => this.handleChange('notifyUsers', val)}
                    label={intl.formatMessage({ id: 'AlarmContact' })}
                    options={
                        alertUserList.map(item => {
                            return {
                                value: item.id,
                                text: item.name,
                            }
                        })
                    }
                    optionFilterProp='children'
                    optionLabelProp='children'
                />
            </Form>
        )
    }
}

export default RcForm.create()(AlarmConfig)
