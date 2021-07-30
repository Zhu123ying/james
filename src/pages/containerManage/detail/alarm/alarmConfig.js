/* eslint-disable */
import React from 'react'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber, Icon, Switch } from 'ultraui'
import { Collapse, Button as HuayunButton, Modal, Table } from 'huayunui'
import Regex from '~/utils/regex'
import './index.less'
import { container as api } from '~/http/api'
import HuayunRequest from '~/http/request'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
class AlarmConfig extends React.Component {
    constructor(props) {
        super(props)
        const { enabled, templateId, userIds } = props
        this.state = {
            alertEnabled: enabled,
            template: templateId || '',
            users: userIds
        }
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    render() {
        const { form, intl, templateList, userList } = this.props
        const { alertEnabled, template, users } = this.state
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
                    value={alertEnabled}
                    name='alertEnabled'
                    label='默认启用'
                    inline
                    isRequired
                    className='switchPanel'
                >
                    <Switch checked={alertEnabled} onChange={(val) => this.handleChange(`alertEnabled`, val)}></Switch>
                </Panel>
                <Select
                    form={form}
                    name="template"
                    value={template}
                    placeholder={intl.formatMessage({ id: 'SelectProjectPlaceHolder' })}
                    onChange={(val) => this.handleChange('template', val)}
                    label={intl.formatMessage({ id: 'AlarmTemplate' })}
                    isRequired
                    options={
                        templateList.map(item => {
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
                    name="users"
                    mode="multiple"
                    allowClear
                    value={users}
                    placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'AlarmContact' }) })}
                    onChange={(val) => this.handleChange('users', val)}
                    label={intl.formatMessage({ id: 'AlarmContact' })}
                    isRequired
                    options={
                        userList.map(item => {
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
