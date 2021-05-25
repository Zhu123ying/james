/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber, Icon, Switch } from 'ultraui'
import { Collapse, Button as HuayunButton, Modal } from 'huayunui'
import Regex from '~/utils/regex'
import '../index.less'

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
                <Button type='text' onClick={() => this.handleRemoveFormDataItem('containers', index)}>
                    <Icon type="empty" />&nbsp;{intl.formatMessage({ id: 'Delete' })}
                </Button>
            </div>
        )
    }
    handleAddPanel = () => {
        const { handleFormChange, formData: { containers } } = this.props
        const item = {

        }
        handleFormChange('containers', [...containers, item])
    }
    handleFormDataOnChange = (key, val) => {
        let { handleFormChange, formData: { containers } } = this.props
        const value = _.get(val, 'target.value', val)
        _.set(containers, key, value)
        handleFormChange('containers', [...containers])
    }
    handleStateOnChange = (key, index, val) => {
        const value = _.get(val, 'target.value', val)
        this.state[key][index] = value
        this.setState({
            [key]: this.state[key]
        })
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
        const { containers } = formData
        const { currentArgs, currentCommand, modalParams } = this.state
        return (
            <div className='ContainerConfig'>
                {
                    containers.length ? (
                        <Collapse defaultActiveKey={[0]}>
                            {
                                containers.map((item, index) => {
                                    const { name, type, image, runVar, mounts, envs, probe, ports } = item
                                    const { project, repo, tag, pullStrategy } = image
                                    const { workDir, command, privileged, args } = runVar
                                    return (
                                        <Collapse.Panel header={this.renderPanelHeader(index)} key={index}>
                                            <Select
                                                form={form}
                                                name={`containers${index}Type`}
                                                value={type}
                                                onChange={(val) => this.handleFormDataOnChange(`${index}.type`, val)}
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
                                            {/* <Input
                                                form={form}
                                                name={`containers${index}Name`}
                                                value={name}
                                                onChange={(val) => this.handleFormDataOnChange(`${index}.name`, val)}
                                                label={intl.formatMessage({ id: 'ContainerName' })}
                                                placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'ContainerName' }) })}
                                                validRegex={Regex.isName}
                                                isRequired
                                            /> */}
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
                    onClick={this.handleAddContainer}
                    name="添加日志"
                    className='addBoxItemBtn'
                />
            </div>
        )
    }
}

export default LogPersistence
