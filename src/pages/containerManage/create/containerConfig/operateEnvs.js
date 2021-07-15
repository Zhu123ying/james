/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Notification, Button, TagItem, Switch, Input as UltrauiInput, Select as UltrauiSelect } from 'ultraui'
import { Collapse, Button as HuayunButton, Popover } from 'huayunui'
import Regex from '~/utils/regex'
import '../index.less'
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
            selectFile: '',
            selectKey: '',
        }
    }
    componentDidMount() {
        const { currentEnvs } = this.props
        if (currentEnvs && currentEnvs.type) {
            const { envKey, type, envValue, selectFile, selectKey } = currentEnvs
            this.setState({
                envKey, type, envValue, selectFile, selectKey
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
                    selectFile: '',
                    selectKey: ''
                })
            }
            if (key === 'selectFile') {
                this.setState({
                    selectKey: ''
                })
            }
        })
    }
    render() {
        const { form, intl, formData: { configurations } } = this.props
        const { envKey, type, envValue, selectFile, selectKey } = this.state
        const selectFileObj = configurations.find(item => item.name === selectFile)
        const selectKeyData = _.get(selectFileObj, 'data', {})
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

                    validRegex={/^[-._a-zA-Z][-._a-zA-Z0-9]*$/}
                    invalidMessage={
                        <div>
                            不符合规范&nbsp;
                            <Popover
                                placement="top"
                                content={<div>{`正则：/^[-._a-zA-Z][-._a-zA-Z0-9]*$/`}</div>}
                                trigger="hover"
                                type="text"
                            >
                                <i className='iconfont icon-info-o'></i>
                            </Popover>
                        </div>
                    }
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
                                name="selectFile"
                                value={selectFile}
                                placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'File' }) })}
                                onChange={(val) => this.handleChange('selectFile', val)}
                                label={intl.formatMessage({ id: 'File' })}
                                isRequired
                                options={
                                    configurations.map(({ name }) => {
                                        return { value: name, text: name }
                                    })
                                }
                                optionFilterProp='children'
                                optionLabelProp='children'
                            />
                            <Select
                                form={form}
                                name="selectKey"
                                value={selectKey}
                                placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: 'Key' })}
                                onChange={(val) => this.handleChange('selectKey', val)}
                                label='Key'
                                isRequired
                                options={
                                    Object.keys(selectKeyData).map(key => key)
                                }
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
