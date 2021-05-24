/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Notification, Button, TagItem, Switch, Input as UltrauiInput, Select as UltrauiSelect } from 'ultraui'
import { Collapse, Button as HuayunButton } from 'huayunui'
import Regex from '~/utils/regex'
import './index.less'
const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
const mountTypeList = [
    { value: 'configuration', text: '配置文件' },
    { value: 'storage', text: '持久存储' }
]

class ManageMountConfig extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {
            type: '',
            subType: '',
            mountItem: '',
            mountPath: '',
            readOnly: true,
            subPath: '',
            subTypeObj: {},
            advancedSetting: false
        }
    }
    componentDidMount() {
        const { currentMountConfig } = this.props
        if (currentMountConfig && currentMountConfig.type) {
            const { type, subType, mountItem, mountPath, readOnly, subPath } = currentMountConfig
            this.setState({
                type, subType, mountItem, mountPath, readOnly, subPath,
                advancedSetting: subPath ? true : false,
                subTypeObj: {
                    text: `${subType} - ${mountItem}`,
                    value: `${subType} - ${mountItem}`,
                    name,
                    type
                }
            })
        }
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        }, () => {
            if (key === 'subTypeObj') {
                this.setState({
                    subType: value.type,
                    mountItem: value.name
                })
            }
            if (key === 'advancedSetting' && !value) {
                this.setState({
                    readOnly: true,
                    subPath: ''
                })
            }
        })
    }
    getSubTypeList = () => {
        const { formData } = this.props
        const { type } = this.state
        let data
        switch (type) {
            case 'configuration':
                data = formData['configurations']
                break
            case 'storage':
                data = formData['storages']
                break
            default:
                data = []
                break
        }
        return data.map(({ name, type }) => {
            return {
                text: `${name} - ${type}`,
                value: `${name} - ${type}`,
                name,
                type
            }
        })
    }
    render() {
        const { form, intl, formData } = this.props
        const { type, subType, mountItem, mountPath, readOnly, subPath, subTypeObj, advancedSetting } = this.state
        const subTypeList = this.getSubTypeList()
        return (
            <Form
                ref={(node) => { this.form = node }}
                form={form}
                subMessage
                className='operateModalForm operateMountConfig'
            >
                <Panel
                    form={form}
                    value={type}
                    name='panelType'
                    label={intl.formatMessage({ id: 'Type' })}
                    isRequired
                    className='inlinePanel'
                >
                    <Select
                        form={form}
                        name="type"
                        value={type}
                        placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'Type' }) })}
                        onChange={(val) => this.handleChange('type', val)}
                        label={intl.formatMessage({ id: 'Type' })}
                        isRequired
                        options={mountTypeList}
                        optionFilterProp='children'
                        optionLabelProp='children'
                    />
                    <Select
                        form={form}
                        name="subType"
                        value={subTypeObj.value}
                        placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'Type' }) })}
                        onChange={(val, option) => this.handleChange('subTypeObj', option)}
                        label={intl.formatMessage({ id: 'Type' })}
                        isRequired
                        options={subTypeList}
                        optionFilterProp='children'
                        optionLabelProp='children'
                    />
                </Panel>
                <Input
                    form={form}
                    name='mountPath'
                    value={mountPath}
                    onChange={(val) => this.handleChange('mountPath', val)}
                    label={intl.formatMessage({ id: 'MountPath' })}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'MountPath' }) })}
                    isRequired
                />
                <Panel
                    form={form}
                    value={advancedSetting}
                    name='advancedSetting'
                    label={intl.formatMessage({ id: 'AdvancedSetting' })}
                    inline
                    className='switchPanel'
                >
                    <Switch checked={advancedSetting} onChange={() => this.handleChange('advancedSetting', !advancedSetting)}></Switch>
                </Panel>
                {
                    advancedSetting ? (
                        <React.Fragment>
                            <Panel
                                form={form}
                                value={readOnly}
                                name='readOnly'
                                label={intl.formatMessage({ id: 'IsReadOnly' })}
                                inline
                                className='switchPanel'
                            >
                                <Switch checked={readOnly} onChange={() => this.handleChange('readOnly', !readOnly)}></Switch>
                            </Panel>
                            <UltrauiInput.InputGroup>
                                <UltrauiSelect defaultValue="subPath">
                                    <Option value='subPath' text='环境变量子路径' >环境变量子路径</Option>
                                </UltrauiSelect>
                                <UltrauiInput
                                    value={subPath}
                                    onChange={(val) => this.handleChange('subPath', val)}
                                    placeholder='请输入路径'
                                />
                            </UltrauiInput.InputGroup>
                        </React.Fragment>
                    ) : null
                }
            </Form >

        )
    }
}

export default RcForm.create()(ManageMountConfig)
