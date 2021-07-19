/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber, Icon, Switch } from 'ultraui'
import { Collapse, Button as HuayunButton, Modal } from 'huayunui'
import Regex from '~/utils/regex'
import '../index.less'
import { containerLogItem } from '../constant'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
class LogPersistence extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    renderPanelHeader = (index) => {
        const { intl } = this.props
        return (
            <div className='panelHeader'>
                <div className='panelTitle'>{`${intl.formatMessage({ id: 'Log' })}${index + 1}`}</div>
                <Button type='text' onClick={() => this.handleRemoveFormDataItem('containerLogs', index)}>
                    <Icon type="empty" />&nbsp;{intl.formatMessage({ id: 'Delete' })}
                </Button>
            </div>
        )
    }
    handleAddContainerLog = () => {
        const { handleFormChange, formData: { containerLogs } } = this.props
        handleFormChange('containerLogs', [...containerLogs, _.cloneDeep(containerLogItem)])
    }
    handleFormDataOnChange = (key, val) => {
        let { handleFormChange, formData: { containerLogs } } = this.props
        const value = _.get(val, 'target.value', val)
        _.set(containerLogs, key, value)
        handleFormChange('containerLogs', [...containerLogs])
    }
    // 删除是通用的，因为知道key了就能删
    handleRemoveFormDataItem = (key, index) => {
        let { handleFormChange, formData } = this.props
        let array = _.get(formData, key, [])
        array.splice(index, 1)
        handleFormChange('formData', { ...formData })
    }
    render() {
        const { form, intl, formData, handleFormChange } = this.props
        const { containerLogs, containers } = formData
        return (
            <div className='containerLogs'>
                {
                    containerLogs.length ? (
                        <Collapse defaultActiveKey={[0]}>
                            {
                                containerLogs.map((item, index) => {
                                    const { containerName, stdoutLogEnabled, stdoutLogConfig, fileLogEnabled, fileLogConfig } = item
                                    return (
                                        <Collapse.Panel header={this.renderPanelHeader(index)} key={index}>
                                            <Select
                                                form={form}
                                                name={`containerLogs${index}ContainerName`}
                                                value={containerName}
                                                onChange={(val) => this.handleFormDataOnChange(`${index}.containerName`, val)}
                                                placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'Container' }) })}
                                                label={intl.formatMessage({ id: 'Container' })}
                                                options={
                                                    containers.map(({ name }) => {
                                                        return {
                                                            value: name,
                                                            text: name,
                                                        }
                                                    })
                                                }
                                                optionFilterProp='children'
                                                optionLabelProp='children'
                                                isRequired
                                            />
                                            <Panel
                                                form={form}
                                                value={stdoutLogEnabled}
                                                name={`containerLogs${index}StdoutLogEnabled`}
                                                label='容器标准输出'
                                                inline
                                                className='switchPanel'
                                            >
                                                <Switch checked={stdoutLogEnabled} onChange={(val) => this.handleFormDataOnChange(`${index}.stdoutLogEnabled`, val)}></Switch>
                                                {
                                                    stdoutLogEnabled ? (
                                                        <div className='logPanel'>
                                                            <Panel
                                                                form={form}
                                                                value={stdoutLogConfig.maxSize}
                                                                name={`containerLogs${index}StandardLogConfigMaxSize`}
                                                                label='容量上限'
                                                                isRequired
                                                                className='inputNumberPanel'
                                                            >
                                                                <InputNumber
                                                                    form={form}
                                                                    value={stdoutLogConfig.maxSize}
                                                                    min={0}
                                                                    slot={{
                                                                        position: 'right',
                                                                        format: () => 'Gi'
                                                                    }}
                                                                    onChange={(val) => this.handleFormDataOnChange(`${index}.stdoutLogConfig.maxSize`, val)}
                                                                />
                                                            </Panel>
                                                            <Panel
                                                                form={form}
                                                                value={stdoutLogConfig.expireTime}
                                                                name={`containerLogs${index}StandardLogConfigExpireTime`}
                                                                label='保存天数'
                                                                isRequired
                                                                className='inputNumberPanel'
                                                            >
                                                                <InputNumber
                                                                    form={form}
                                                                    value={stdoutLogConfig.expireTime}
                                                                    min={0}
                                                                    slot={{
                                                                        position: 'right',
                                                                        format: () => '天'
                                                                    }}
                                                                    onChange={(val) => this.handleFormDataOnChange(`${index}.stdoutLogConfig.expireTime`, val)}
                                                                />
                                                            </Panel>
                                                        </div>
                                                    ) : null
                                                }
                                            </Panel>
                                        </Collapse.Panel>
                                    )
                                })
                            }
                        </Collapse>
                    ) : null
                }
                <HuayunButton
                    type="operate"
                    icon={<Icon type="add" />}
                    onClick={this.handleAddContainerLog}
                    name="添加日志"
                    className='addBoxItemBtn'
                />
            </div>
        )
    }
}

export default LogPersistence
