/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber } from 'ultraui'
import { Collapse, Button as HuayunButton } from 'huayunui'
import Regex from '~/utils/regex'
import '../index.less'
const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
class ManagePersistentStorage extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }
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
        const { form, intl } = this.props
        const { currentLabel, name, labels, type, typeClass, accessMode, capacity, LabelPanelErrorMessage } = this.state
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
                    validRegex={Regex.isName}
                    isRequired
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
                        />
                        <span className='splitLine'>&nbsp;|&nbsp;</span>
                        <Input
                            form={form}
                            name='currentLabelValue'
                            value={currentLabel.value}
                            onChange={(val) => this.handleSetCurrentLabel('value', val)}
                            label=''
                            placeholder='值'
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
                    options={[
                        { value: 'big', text: 'big' },
                    ]}
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
                    options={[
                        { value: 'ReadWriteOnce', text: 'ReadWriteOnce' },
                        { value: 'ReadWriteMany', text: 'ReadWriteMany' }
                    ]}
                    optionFilterProp='children'
                    optionLabelProp='children'
                />
            </Form>
        )
    }
}

export default RcForm.create()(ManagePersistentStorage)
