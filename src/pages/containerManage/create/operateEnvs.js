/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Notification, Button, TagItem, Switch, Input as UltrauiInput, Select as UltrauiSelect } from 'ultraui'
import { Collapse, Button as HuayunButton } from 'huayunui'
import Regex from '~/utils/regex'
import './index.less'
const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
const addTypeList = [
    { value: 'manual', text: '手动输入' },
    { value: 'file', text: '选择文件' }
]

class ManageEnvs extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {
            envKey: '',
            type: 'manual',
            envValue: '',
            SelectFile: '',
            SelectKey: '',
        }
    }
    componentDidMount() {
        const { currentEnvs } = this.props
        if (currentEnvs && currentEnvs.type) {
            const { envKey, type, envValue, SelectFile, SelectKey } = currentEnvs
            this.setState({
                envKey, type, envValue, SelectFile, SelectKey
            })
        }
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        }, () => {
            if (key === 'type') {
                this.setState({
                    envValue: '',
                    SelectFile: '',
                    SelectKey: ''
                })
            }
        })
    }
    render() {
        const { form, intl, formData } = this.props
        const { envKey, type, envValue, SelectFile, SelectKey } = this.state
        return (
            <Form
                ref={(node) => { this.form = node }}
                form={form}
                subMessage
                className='operateModalForm operateEnvs'
            >
                <Input
                    form={form}
                    name='Key'
                    value={envKey}
                    onChange={(val) => this.handleChange('envKey', val)}
                    label='Key'
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: 'Key' })}
                    isRequired
                />
                <Select
                    form={form}
                    name="type"
                    value={type}
                    placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: '添加方式' })}
                    onChange={(val) => this.handleChange('type', val)}
                    label='添加方式'
                    isRequired
                    options={addTypeList}
                    optionFilterProp='children'
                    optionLabelProp='children'
                />
                {
                    type === 'manual' ? (
                        <Input
                            form={form}
                            name='envValue'
                            value={envValue}
                            onChange={(val) => this.handleChange('envValue', val)}
                            label='Value'
                            placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: 'Value' })}
                            isRequired
                        />
                    ) : (
                        <div className='inline'>
                            <Select
                                form={form}
                                name="SelectFile"
                                value={SelectFile}
                                placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'File' }) })}
                                onChange={(val) => this.handleChange('SelectFile', val)}
                                label={intl.formatMessage({ id: 'File' })}
                                isRequired
                                options={[]}
                                optionFilterProp='children'
                                optionLabelProp='children'
                            />
                            <Select
                                form={form}
                                name="SelectKey"
                                value={SelectKey}
                                placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: 'Key' })}
                                onChange={(val) => this.handleChange('SelectKey', val)}
                                label='Key'
                                isRequired
                                options={[]}
                                optionFilterProp='children'
                                optionLabelProp='children'
                            />
                        </div>
                    )
                }
            </Form >

        )
    }
}

export default RcForm.create()(ManageEnvs)
