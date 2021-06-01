/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber } from 'ultraui'
import { Collapse, Button as HuayunButton } from 'huayunui'
import Regex from '~/utils/regex'
import '../index.less'
const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
const restartPolicyList = ['Always', 'OnFailure', 'Never']
class ContainerGroupConfig extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {
            currentLabel: {   // 当前被编辑的label，实际传参用不到
                key: '',
                value: ''
            },
        }
    }
    componentDidMount() {

    }
    handleSetCurrentLabel = (key, val) => {
        const value = _.get(val, 'target.value', val)
        let { currentLabel } = this.state
        currentLabel[key] = value
        this.setState({
            currentLabel: { ...currentLabel }
        })
    }
    handleAddLabel = () => {
        let { currentLabel: { key, value } } = this.state
        let { formData: { labels } } = this.props
        labels[key] = value
        this.props.handleFormChange('labels', { ...labels })
        this.setState({
            currentLabel: {
                key: '',
                value: ''
            }
        })
    }
    handleRemoveLabel = (key) => {
        let { formData: { labels } } = this.props
        delete labels[key]
        this.props.handleFormChange('labels', { ...labels })
    }
    render() {
        const { form, intl, projectList, formData, handleFormChange } = this.props
        const { name, description, projectId, labels, restartPolicy, resource } = formData
        const { cpu, memory, ephemeralStorage } = resource
        const { currentLabel } = this.state
        return (
            <div className='ContainerGroupConfig'>
                <Input
                    form={form}
                    name='ContainerGroupName'
                    value={name}
                    onChange={(val) => handleFormChange('name', val)}
                    label={intl.formatMessage({ id: 'ContainerGroupName' })}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'ContainerGroupName' }) })}
                    validRegex={Regex.isName}
                    isRequired
                />
                <Textarea
                    form={form}
                    value={description}
                    name='ContainerGroupDescription'
                    onChange={(val) => handleFormChange('description', val)}
                    label={intl.formatMessage({ id: 'ContainerGroupDescription' })}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'ContainerGroupDescription' }) })}
                    minLength={0}
                    maxLength={200}
                />
                <Panel
                    form={form}
                    value={currentLabel}
                    name="ContainerGroupCurrentLabel"
                    label={intl.formatMessage({ id: 'ContainerGroupTag' })}
                    inline
                    className='labelPanel'
                >
                    <div className='labelLine'>
                        <Input
                            form={form}
                            name='ContainerGroupCurrentLabelName'
                            value={currentLabel.key}
                            onChange={(val) => this.handleSetCurrentLabel('key', val)}
                            label=''
                            placeholder='键'
                        />
                        <span className='splitLine'>&nbsp;|&nbsp;</span>
                        <Input
                            form={form}
                            name='ContainerGroupCurrentLabelValue'
                            value={currentLabel.value}
                            onChange={(val) => this.handleSetCurrentLabel('value', val)}
                            label=''
                            placeholder='值'
                        />
                        <HuayunButton
                            disabled={currentLabel.value === '' || currentLabel.key === ''}
                            size='small'
                            type="primary"
                            icon="icon-add"
                            onClick={this.handleAddLabel} />
                    </div>
                    <div className='labelList'>
                        {
                            labels && Object.keys(labels).map((key, index) => {
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
                    name="ContainerGroupProjectId"
                    value={projectId}
                    placeholder={intl.formatMessage({ id: 'SelectProjectPlaceHolder' })}
                    onChange={(val) => handleFormChange('projectId', val)}
                    label={intl.formatMessage({ id: 'ProjectBelongTo' })}
                    isRequired
                    options={
                        projectList.map(item => {
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
                    name="ContainerGroupRestartPolicy"
                    value={restartPolicy}
                    placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'RestartPolicy' }) })}
                    onChange={(val) => handleFormChange('restartPolicy', val)}
                    label={intl.formatMessage({ id: 'RestartPolicy' })}
                    isRequired
                    options={
                        restartPolicyList.map(item => {
                            return {
                                value: item,
                                text: item,
                            }
                        })
                    }
                    optionFilterProp='children'
                    optionLabelProp='children'
                />
                <Panel
                    form={form}
                    value={resource}
                    name="ContainerGroupResource"
                    label={intl.formatMessage({ id: 'ContainerGroupQuota' })}
                    isRequired
                    className='resourcePanel'
                >
                    <Panel
                        form={form}
                        value={cpu}
                        name="ContainerGroupResource_cpu"
                        label='CPU'
                        isRequired
                        className='resourceItem'
                    >
                        <InputNumber
                            form={form}
                            value={cpu}
                            min={0}
                            slot={{
                                position: 'right',
                                format: () => 'm'
                            }}
                            onChange={(val) => handleFormChange('resource', {
                                cpu: val,
                                memory,
                                ephemeralStorage
                            })}
                        />
                    </Panel>
                    <Panel
                        form={form}
                        value={memory}
                        name="ContainerGroupResource_memory"
                        label={intl.formatMessage({ id: 'Memory' })}
                        isRequired
                        className='resourceItem'
                    >
                        <InputNumber
                            form={form}
                            value={memory}
                            min={0}
                            slot={{
                                position: 'right',
                                format: () => 'Mi'
                            }}
                            onChange={(val) => handleFormChange('resource', {
                                cpu,
                                memory: val,
                                ephemeralStorage
                            })}
                        />
                    </Panel>
                    <Panel
                        form={form}
                        value={ephemeralStorage}
                        name="ContainerGroupResource_ephemeralStorage"
                        label={intl.formatMessage({ id: 'LocalDisk' })}
                        isRequired
                        className='resourceItem'
                    >
                        <InputNumber
                            form={form}
                            value={ephemeralStorage}
                            min={0}
                            slot={{
                                position: 'right',
                                format: () => 'Gi'
                            }}
                            onChange={(val) => handleFormChange('resource', {
                                cpu,
                                memory,
                                ephemeralStorage: val
                            })}
                        />
                    </Panel>
                </Panel>
            </div>
        )
    }
}


export default ContainerGroupConfig
