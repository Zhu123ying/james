/* eslint-disable */
import React from 'react'
import { RcForm, Notification, Button, TagItem, Switch, Input as UltrauiInput, Select as UltrauiSelect } from 'ultraui'
import { Collapse, Button as HuayunButton } from 'huayunui'
import Regex from '~/utils/regex'
import './index.less'
const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._

class AddLabel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            key: '',
            value: '',
            effect: ''
        }
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    render() {
        const { form, intl, type } = this.props
        const { key, value, effect } = this.state
        return (
            <Form
                ref={(node) => { this.form = node }}
                form={form}
                subMessage
                className='addLabelModal'
            >
                <Input
                    form={form}
                    name='key'
                    value={key}
                    onChange={(val) => this.handleChange('key', val)}
                    label='Key'
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: 'Key' })}
                    isRequired
                />
                {
                    type === 'annotations' ? (
                        <Textarea
                            form={form}
                            name='value'
                            value={value}
                            label='Value'
                            placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: 'Value' })}
                            isRequired
                            onChange={(val) => this.handleChange('value', val)}
                        />
                    ) : (
                        <Input
                            form={form}
                            name='value'
                            value={value}
                            onChange={(val) => this.handleChange('value', val)}
                            label='Value'
                            placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: 'Value' })}
                            isRequired
                        />
                    )
                }
                {
                    type === 'taints' ? (
                        <Select
                            form={form}
                            name="effect"
                            value={effect}
                            onChange={val => this.handleChange('effect', val)}
                            label='effect'
                            isRequired
                            options={[
                                { value: 'NoSchedule', text: 'NoSchedule' },
                                { value: 'NoExecute', text: 'NoExecute' },
                                { value: 'PreferNoSchedule', text: 'PreferNoSchedule' }
                            ]}
                            optionFilterProp='children'
                            optionLabelProp='children'
                        />
                    ) : null
                }
            </Form >

        )
    }
}

export default RcForm.create()(AddLabel)
