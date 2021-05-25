/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber } from 'ultraui'
import { Collapse, Button as HuayunButton } from 'huayunui'
import Regex from '~/utils/regex'
import '../index.less'
const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
class ManageConfigFile extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            labels: {}, // key:value形式
            type: '',
            subType: '',
            data: {},  // key:value形式
            currentLabel: {}, // 标签
            LabelPanelErrorMessage: '', // 标签panel的错误提示
            currentData: {}, // 数据
            DataPanelErrorMessage: '', // 数据panel的错误提示
        }
    }
    componentDidMount() {
        const { currentConfigFile } = this.props
        if (currentConfigFile && currentConfigFile.name) {
            const { name, labels, type, subType, data } = currentConfigFile
            this.setState({
                name, labels, type, subType, data
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
                    subType: ''
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
    // 对数据的操作
    handleSetCurrentData = (key, val) => {
        const value = _.get(val, 'target.value', val)
        let { currentData } = this.state
        currentData[key] = value
        this.setState({
            currentData: { ...currentData }
        })
    }
    handleAddData = () => {
        let { currentData: { key, value }, data } = this.state
        data[key] = value
        this.setState({
            currentData: {
                key: '',
                value: ''
            },
            data: { ...data }
        })
    }
    handleRemoveData = (key) => {
        let { data } = this.state
        delete data[key]
        this.setState({
            data: { ...data }
        })
    }
    render() {
        const { form, intl } = this.props
        const { currentLabel, currentData, name, labels, type, subType, data, LabelPanelErrorMessage, DataPanelErrorMessage } = this.state
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
                    name="type"
                    value={type}
                    placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'Type' }) })}
                    onChange={(val) => this.handleChange('type', val)}
                    label={intl.formatMessage({ id: 'Type' })}
                    isRequired
                    options={[
                        { value: 'secret', text: 'secret' },
                        { value: 'configMap', text: 'configMap' }
                    ]}
                    optionFilterProp='children'
                    optionLabelProp='children'
                />
                {
                    type === 'secret' ? (
                        <Select
                            form={form}
                            name="subType"
                            value={subType}
                            placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'SubType' }) })}
                            onChange={(val) => this.handleChange('subType', val)}
                            label={intl.formatMessage({ id: 'SubType' })}
                            isRequired
                            options={[
                                { value: 'Opaque', text: 'Opaque' },
                                { value: 'kubernetes.io/dockerconfigjson', text: 'kubernetes.io/dockerconfigjson' }
                            ]}
                            optionFilterProp='children'
                            optionLabelProp='children'
                        />
                    ) : null
                }
                <Panel
                    form={form}
                    value={currentData}
                    name="currentData"
                    label={intl.formatMessage({ id: 'Data' })}
                    className='labelPanel'
                    isRequired
                    errorMsg={Object.keys(data).length ? '' : DataPanelErrorMessage}
                >
                    <div className='labelLine'>
                        <Input
                            form={form}
                            name='currentDataName'
                            value={currentData.key}
                            onChange={(val) => this.handleSetCurrentData('key', val)}
                            label=''
                            placeholder='键'
                        />
                        <span className='splitLine'>&nbsp;|&nbsp;</span>
                        <Input
                            form={form}
                            name='currentDataValue'
                            value={currentData.value}
                            onChange={(val) => this.handleSetCurrentData('value', val)}
                            label=''
                            placeholder='值'
                        />
                        <HuayunButton
                            disabled={!currentData.value || !currentData.key}
                            size='small'
                            type="primary"
                            icon="icon-add"
                            onClick={this.handleAddData} />
                    </div>
                    <div className='labelList'>
                        {
                            Object.keys(data).map((key, index) => {
                                return (
                                    <TagItem
                                        size='medium'
                                        key={key}
                                        name={
                                            <div className='labelItem'>
                                                <span className='key'>{key}</span>
                                                <span className='splitLine'>|</span>
                                                <span className='value'>{data[key]}</span>
                                            </div>
                                        }
                                        icon="error"
                                        onClick={() => this.handleRemoveData(key)}
                                    />
                                )
                            })
                        }
                    </div>
                </Panel>
            </Form>

        )
    }
}

export default RcForm.create()(ManageConfigFile)
