/* eslint-disable */
import React from 'react'
import { RcForm, Loading, Row, Col, Icon, Notification, Tooltip, Dialog, CheckBoxes, InputNumber } from 'ultraui'
import { Button, Switch } from 'huayunui'
import { Cascader } from 'antd'
import './index.less'
import Regex from '~/utils/regex'
import HuayunRequest from '~/http/request'
import { application as api } from '~/http/api'

const { FormGroup, Form, Input, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._

class CreateLog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cascaderSelectData: [], // cascader的下拉数据
            cascaderValue: [],
            kind: '',
            isStandardLogConfig: 1, // 是否配置标准日志输出
            standardLogConfig: {  // 标注日志配置
                expireTime: 0,  // 采集日志保存天数
                maxSize: 0,  // 采集日志容量单位GI
            },
            isServiceLogConfig: 1, // 是否配置服务日志配置输出
            serviceLogConfig: { // 服务日志配置
                expireTime: 0, // 采集日志保存天数
                maxSize: 0, // 采集日志容量单位GI
                path: '', // 自定义路径(/开头)
            },
            cascaderPanelErrorMessage: '', // cascaderPanel的错误提示
        }
    }

    componentDidMount() {
        this.queryApplicationContainers()
    }

    queryApplicationContainers = (id = this.props.detail.id) => {
        HuayunRequest(api.queryApplicationContainers, { id }, {
            success: (res) => {
                this.setState({
                    cascaderSelectData: res.data
                })
            }
        })
    }

    handleChange = (key, val, item) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }

    handleCascaderChange = (val, options) => {
        this.setState({
            cascaderValue: val,
            kind: options[0].kind
        })
    }

    render() {
        const { intl, form } = this.props
        const { cascaderSelectData, cascaderValue, isStandardLogConfig, standardLogConfig, isServiceLogConfig, serviceLogConfig, cascaderPanelErrorMessage } = this.state
        return (
            <Form form={form}>
                <Panel
                    form={form}
                    value={cascaderValue}
                    name='cascaderValue'
                    label={intl.formatMessage({ id: 'Container' })}
                    isRequired
                    className='cascaderPanel columnPanel panel'
                    errorMsg={cascaderPanelErrorMessage}
                >
                    <Cascader
                        allowClear={false}
                        options={cascaderSelectData}
                        onChange={this.handleCascaderChange}
                        placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'Container' }) })}
                    />
                </Panel>
                <Panel
                    form={form}
                    value={isStandardLogConfig}
                    name='isStandardLogConfig'
                    label='容器标准输出'
                    inline
                    className='switchPanel inlinePanel panel'
                >
                    <Switch checked={isStandardLogConfig} onChange={(val) => this.handleChange(`isStandardLogConfig`, val ? 1 : 0)}></Switch>
                </Panel>
                <div className='panelGroup'>
                    <Panel
                        form={form}
                        value={standardLogConfig.maxSize}
                        name="standardLogConfigMaxSize"
                        label='容量上限'
                        isRequired
                        className='columnPanel panel'
                    >
                        <InputNumber
                            form={form}
                            value={standardLogConfig.maxSize}
                            min={0}
                            slot={{
                                position: 'right',
                                format: () => 'Gi'
                            }}
                            onChange={(val) => this.handleChange('standardLogConfig', {
                                expireTime: standardLogConfig.expireTime,
                                maxSize: val
                            })}
                        />
                    </Panel>
                    <Panel
                        form={form}
                        value={standardLogConfig.expireTime}
                        name="standardLogConfigExpireTime"
                        label='保存天数'
                        isRequired
                        className='columnPanel panel'
                    >
                        <InputNumber
                            form={form}
                            value={standardLogConfig.expireTime}
                            min={0}
                            slot={{
                                position: 'right',
                                format: () => '天'
                            }}
                            onChange={(val) => this.handleChange('standardLogConfig', {
                                expireTime: val,
                                maxSize: standardLogConfig.maxSize
                            })}
                        />
                    </Panel>
                </div>
                <Panel
                    form={form}
                    value={isServiceLogConfig}
                    name='isServiceLogConfig'
                    label='服务日志'
                    inline
                    className='switchPanel inlinePanel panel'
                >
                    <Switch checked={isServiceLogConfig} onChange={(val) => this.handleChange(`isServiceLogConfig`, val ? 1 : 0)}></Switch>
                </Panel>
                <div className='panelGroup'>
                    <Panel
                        form={form}
                        value={serviceLogConfig.maxSize}
                        name="serviceLogConfigMaxSize"
                        label='容量上限'
                        isRequired
                        className='columnPanel panel'
                    >
                        <InputNumber
                            form={form}
                            value={serviceLogConfig.maxSize}
                            min={0}
                            slot={{
                                position: 'right',
                                format: () => 'Gi'
                            }}
                            onChange={(val) => this.handleChange('serviceLogConfig', {
                                expireTime: serviceLogConfig.expireTime,
                                maxSize: val,
                                path: serviceLogConfig.path
                            })}
                        />
                    </Panel>
                    <Panel
                        form={form}
                        value={serviceLogConfig.expireTime}
                        name="serviceLogConfigExpireTime"
                        label='保存天数'
                        isRequired
                        className='columnPanel panel'
                    >
                        <InputNumber
                            form={form}
                            value={serviceLogConfig.expireTime}
                            min={0}
                            slot={{
                                position: 'right',
                                format: () => '天'
                            }}
                            onChange={(val) => this.handleChange('serviceLogConfig', {
                                expireTime: val,
                                maxSize: serviceLogConfig.maxSize,
                                path: serviceLogConfig.path
                            })}
                        />
                    </Panel>
                    <Input
                        form={form}
                        value={serviceLogConfig.path}
                        name='serviceLogConfigPath'
                        label='日志路径'
                        onChange={(val) => this.handleChange('serviceLogConfig', {
                            expireTime: serviceLogConfig.expireTime,
                            maxSize: serviceLogConfig.maxSize,
                            path: _.get(val, 'target.value', val)
                        })}
                        isRequired
                        className='columnPanel panel'
                    />
                </div>
            </Form>
        )
    }
}

export default RcForm.create()(CreateLog)
