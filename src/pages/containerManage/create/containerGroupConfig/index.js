/* eslint-disable */
import React from 'react'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber } from 'ultraui'
import { Collapse, Button as HuayunButton, Popover } from 'huayunui'
import Regex from '~/utils/regex'
import '../index.less'
import { ValidLabelKeyProps, ValidLabelValueProps } from '../constant'
const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
const restartPolicyList = ['Always']
class ContainerGroupConfig extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentLabel: {   // 当前被编辑的label，实际传参用不到
                key: '',
                value: ''
            },
        }
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
        const { name, description, projectId, labels, restartPolicy, resource, qos } = formData
        const { cpu, memory, ephemeralStorage } = resource
        const { egress, ingress } = qos
        const { currentLabel } = this.state
        return (
            <div className='ContainerGroupConfig'>
                <Input
                    form={form}
                    name='ContainerGroupConfigName'
                    value={name}
                    onChange={(val) => handleFormChange('name', val)}
                    label={intl.formatMessage({ id: 'ContainerGroupName' })}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'ContainerGroupName' }) })}
                    validRegex={Regex.isName}
                    invalidMessage={intl.formatMessage({ id: 'NameErrorMsg' })}
                    isRequired
                />
                <Textarea
                    form={form}
                    value={description}
                    name='ContainerGroupConfigDescription'
                    onChange={(val) => handleFormChange('description', val)}
                    label={intl.formatMessage({ id: 'ContainerGroupDescription' })}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'ContainerGroupDescription' }) })}
                    minLength={0}
                    maxLength={200}
                />
                <Panel
                    form={form}
                    value={currentLabel}
                    name="ContainerGroupConfigCurrentLabel"
                    label={intl.formatMessage({ id: 'ContainerGroupTag' })}
                    inline
                    className='labelPanel'
                >
                    <div className='labelLine'>
                        <Input
                            form={form}
                            name='ContainerGroupConfigCurrentLabelName'
                            value={currentLabel.key}
                            onChange={(val) => this.handleSetCurrentLabel('key', val)}
                            label=''
                            placeholder='键'
                            {...ValidLabelKeyProps}
                        />
                        <span className='splitLine'>&nbsp;|&nbsp;</span>
                        <Input
                            form={form}
                            name='ContainerGroupConfigCurrentLabelValue'
                            value={currentLabel.value}
                            onChange={(val) => this.handleSetCurrentLabel('value', val)}
                            label=''
                            placeholder='值'
                            {...ValidLabelValueProps}
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
                    name="ContainerGroupConfigProjectId"
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
                    name="ContainerGroupConfigRestartPolicy"
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
                    name="ContainerGroupConfigResource"
                    label={intl.formatMessage({ id: 'ContainerGroupQuota' })}
                    isRequired
                    className='resourcePanel'
                >
                    <Panel
                        form={form}
                        value={cpu}
                        name="ContainerGroupConfigResource_cpu"
                        label='CPU'
                        isRequired
                        className='resourceItem'
                    >
                        <InputNumber
                            form={form}
                            value={cpu}
                            min={100}
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
                        name="ContainerGroupConfigResource_memory"
                        label={intl.formatMessage({ id: 'Memory' })}
                        isRequired
                        className='resourceItem'
                    >
                        <InputNumber
                            form={form}
                            value={memory}
                            min={256}
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
                        name="ContainerGroupConfigResource_ephemeralStorage"
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
                <Panel
                    form={form}
                    name='qos'
                    value={qos}
                    label='流量控制'
                    isRequired
                >
                    <div className='inputNumberGroup'>
                        <Panel
                            form={form}
                            value={egress}
                            name="egress"
                        >
                            <InputNumber
                                form={form}
                                value={egress}
                                min={0}
                                max={100000}
                                slot={{
                                    position: 'right',
                                    format: () => 'Mbps'
                                }}
                                onChange={(val) => handleFormChange('qos', {
                                    egress: val,
                                    ingress
                                })}
                            />
                        </Panel>
                        &nbsp;&nbsp;
                        <Panel
                            form={form}
                            value={ingress}
                            name="ingress"
                        >
                            <InputNumber
                                form={form}
                                value={ingress}
                                min={0}
                                max={100000}
                                slot={{
                                    position: 'right',
                                    format: () => 'Mbps'
                                }}
                                onChange={(val) => handleFormChange('qos', {
                                    egress,
                                    ingress: val
                                })}
                            />
                        </Panel>
                    </div>
                </Panel>
            </div>
        )
    }
}

export default ContainerGroupConfig
