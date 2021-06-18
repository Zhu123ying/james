/* eslint-disable */
import React from 'react'
import { RcForm, Loading, Row, Col, Icon, Notification, Tooltip, Dialog, CheckBoxes } from 'ultraui'
import { Button } from 'huayunui'
import './index.less'
import Regex from '~/utils/regex'
import HuayunRequest from '~/http/request'
import { applicationPackage as api } from '~/http/api'

const { CheckBox, RadioGroup } = CheckBoxes
const { FormGroup, Form, Input, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._

class CreateAppPort extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '', // 入口名称
            description: '', // 描述
            portKey: '', // 应用入口的类型, 入口对象第一个下拉框对应的key
            resourceObjectList: [], // 入口对象第二个下拉框的数据
            config: {},
            portType: '1', // 1为选择资源，2为用户编辑
            gatewaySelectObj: {}, // 下拉选项
        }
    }

    componentDidMount() {
        this.getGatewaySelect()
    }

    initData = (data) => {
        const { currentPort } = this.props
        const { name, description, config } = currentPort
        this.setState({
            name, description, config,
            portKey: config.portKey,
            resourceObjectList: data[config.portKey] || [],
            portType: config.type === 'customGateway' ? '2' : '1',
        })
    }

    // 应用入口的类型列表数据
    getGatewaySelect = (id = this.props.currentVersion.id) => {
        const { currentPort } = this.props
        HuayunRequest(api.getApplicationPackageGatewayResourceList, { id }, {
            success: (res) => {
                this.setState({
                    gatewaySelectObj: res.data
                })
                currentPort.id && this.initData(res.data)
            }
        })
    }

    handleChange = (key, val, item) => {
        const value = _.get(val, 'target.value', val)
        const { gatewaySelectObj } = this.state
        this.setState({
            [key]: value
        }, () => {
            if (key === 'portType') {
                // 如果portType为用户编辑，则config里添加type字段，值为customGateway
                let config = {}
                if (value === '2') {
                    config = {
                        type: 'customGateway'
                    }
                }
                this.setState({
                    portKey: '',
                    resourceObjectList: [],
                    config,
                })
            }
            if (key === 'portKey') {
                this.setState({
                    resourceObjectList: gatewaySelectObj[value]
                })
            }
        })
    }

    handleUserInputChange = (val) => {
        const value = _.get(val, 'target.value', val)
        let { config } = this.state
        config.info = value
        this.setState({
            config: { ...config }
        })
    }

    render() {
        const { intl, form } = this.props
        const { name, description, portKey, resourceObjectList, portType, config: { info }, gatewaySelectObj } = this.state
        return (
            <Form form={form}>
                <Input
                    form={form}
                    name='name'
                    value={name}
                    onChange={this.handleChange.bind(this, 'name')}
                    label={intl.formatMessage({ id: 'AppPortName' })}
                    validRegex={Regex.isName}
                    invalidMessage={intl.formatMessage({ id: 'NamePlaceHolder' })}
                    isRequired
                />
                <Textarea
                    form={form}
                    value={description}
                    name='description'
                    onChange={this.handleChange.bind(this, 'description')}
                    label={intl.formatMessage({ id: 'Description' })}
                    minLength={0}
                    maxLength={200}
                />
                <Panel
                    className='appPortObject'
                    label={intl.formatMessage({ id: 'AppPortObject' })}
                    isRequired
                    name='appPortObject'
                    form={form}>
                    <RadioGroup
                        className='radioLine'
                        items={[
                            { title: '选择资源', value: '1' },
                            { title: '用户编辑', value: '2' }
                        ]}
                        name="portType"
                        inline
                        onChange={this.handleChange.bind(this, 'portType')}
                        defaultValue={portType}
                    />
                    {
                        portType === '1' ? (
                            <div className='selectLine'>
                                <Select
                                    form={form}
                                    name="portKey"
                                    value={portKey}
                                    onChange={this.handleChange.bind(this, 'portKey')}
                                    isRequired
                                    options={
                                        Object.keys(gatewaySelectObj).map(key => {
                                            return {
                                                value: key,
                                                text: key,
                                            }
                                        })
                                    }
                                    optionFilterProp='children'
                                    optionLabelProp='children'
                                />
                                <Select
                                    form={form}
                                    name="selectInfo"
                                    value={info}
                                    onSelect={(id, row) => this.handleChange('config', row.config)}
                                    isRequired
                                    options={
                                        resourceObjectList.map((item) => {
                                            return {
                                                value: item.info,
                                                text: item.info,
                                                config: item
                                            }
                                        })
                                    }
                                    optionFilterProp='children'
                                    optionLabelProp='children'
                                />
                            </div>
                        ) : (
                            <Textarea
                                className='userInput'
                                form={form}
                                value={info}
                                name='textAreaInfo'
                                onChange={this.handleUserInputChange}
                                minLength={0}
                                maxLength={200}
                            />
                        )
                    }
                </Panel>
            </Form>
        )
    }
}

export default RcForm.create()(CreateAppPort)
