/* eslint-disable */
import React from 'react'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber } from 'ultraui'
import { Collapse, Button as HuayunButton } from 'huayunui'
import Regex from '~/utils/regex'
import '../index.less'
import { ValidLabelKeyProps, ValidLabelValueProps, ValidCommonNameProps } from '../constant'
const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
class ManagePersistentStorage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            labels: {}, // key:value形式
            type: 'Dynamic',
            typeClass: '',
            accessMode: '', // 容量
            capacity: 0, // 访问类型
            currentLabel: {}, // 标签
            LabelPanelErrorMessage: '', // 标签panel的错误提示
        }
    }
    componentDidMount() {
        const { currentItem } = this.props
        if (currentItem && currentItem.name) {
            const { name, labels, type, typeClass, accessMode, capacity } = currentItem
            this.setState({
                name, labels, type, typeClass, accessMode, capacity
            })
        }
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        }, () => {
            if (key === 'typeClass') {
                this.setState({
                    accessMode: ''
                })
            }
        })
    }
    // 对标签的操作
    handleSetCurrentLabel = (key, val) => {
        const value = _.get(val, 'target.value', val)
        let { currentLabel } = this.state
        currentLabel[key] = value
        this.setState({
            currentLabel: { ...currentLabel }
        })
    }
    handleAddLabel = () => {
        let { currentLabel: { key, value }, labels } = this.state
        labels[key] = value
        this.setState({
            currentLabel: {
                key: '',
                value: ''
            },
            labels: { ...labels }
        })
    }
    handleRemoveLabel = (key) => {
        let { labels } = this.state
        delete labels[key]
        this.setState({
            labels: { ...labels }
        })
    }
    render() {
        const { form, intl, storageClassList } = this.props
        const { currentLabel, name, labels, type, typeClass, accessMode, capacity, LabelPanelErrorMessage } = this.state
        const currentStorageClass = storageClassList.find(item => item.name === typeClass)
        const accessModeOptions = _.get(currentStorageClass, 'accessModes', [])
        return (
            <Form
                ref={(node) => { this.form = node }}
                form={form}
                subMessage
                className='operateModalForm'
            >
                <Input
                    form={form}
                    name='name'
                    value={name}
                    onChange={(val) => this.handleChange('name', val)}
                    label={intl.formatMessage({ id: 'Name' })}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Name' }) })}
                    isRequired
                    {...ValidCommonNameProps}
                />
                <Panel
                    form={form}
                    value={currentLabel}
                    name="currentLabel"
                    label={intl.formatMessage({ id: 'Tag' })}
                    className='labelPanel'
                    isRequired
                    errorMsg={Object.keys(labels).length ? '' : LabelPanelErrorMessage}
                >
                    <div className='labelLine'>
                        <Input
                            form={form}
                            name='currentLabelName'
                            value={currentLabel.key}
                            onChange={(val) => this.handleSetCurrentLabel('key', val)}
                            label=''
                            placeholder='键'
                            {...ValidLabelKeyProps}
                        />
                        <span className='splitLine'>&nbsp;|&nbsp;</span>
                        <Input
                            form={form}
                            name='currentLabelValue'
                            value={currentLabel.value}
                            onChange={(val) => this.handleSetCurrentLabel('value', val)}
                            label=''
                            placeholder='值'
                            {...ValidLabelValueProps}
                        />
                        <HuayunButton
                            disabled={!currentLabel.value || !currentLabel.key}
                            size='small'
                            type="primary"
                            icon="icon-add"
                            onClick={this.handleAddLabel} />
                    </div>
                    <div className='labelList'>
                        {
                            Object.keys(labels).map((key, index) => {
                                return (
                                    <TagItem
                                        size='medium'
                                        key={key}
                                        name={
                                            <div className='labelItem'>
                                                <span className='key'>{key}</span>
                                                <span className='splitLine'>|</span>
                                                <span className='value'>{labels[key]}</span>
                                            </div>
                                        }
                                        icon="error"
                                        onClick={() => this.handleRemoveLabel(key)}
                                    />
                                )
                            })
                        }
                    </div>
                </Panel>
                <Select
                    form={form}
                    name="typeClass"
                    value={typeClass}
                    placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'StorageType' }) })}
                    onChange={(val) => this.handleChange('typeClass', val)}
                    label={intl.formatMessage({ id: 'StorageType' })}
                    isRequired
                    options={
                        storageClassList.map(({ name }) => {
                            return { value: name, text: name }
                        })
                    }
                    optionFilterProp='children'
                    optionLabelProp='children'
                />
                <Panel
                    form={form}
                    value={capacity}
                    name="capacity"
                    label={intl.formatMessage({ id: 'Capacity' })}
                    isRequired
                    className='InputNumberPanel'
                >
                    <InputNumber
                        form={form}
                        value={capacity}
                        min={0}
                        slot={{
                            position: 'right',
                            format: () => 'Gi'
                        }}
                        onChange={(val) => this.handleChange('capacity', val)}
                    />
                </Panel>
                <Select
                    form={form}
                    name="accessMode"
                    value={accessMode}
                    placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'AccessMode' }) })}
                    onChange={(val) => this.handleChange('accessMode', val)}
                    label={intl.formatMessage({ id: 'AccessMode' })}
                    isRequired
                    options={
                        accessModeOptions.map(item => {
                            return { value: item, text: item }
                        })
                    }
                    optionFilterProp='children'
                    optionLabelProp='children'
                />
            </Form>
        )
    }
}

export default RcForm.create()(ManagePersistentStorage)
