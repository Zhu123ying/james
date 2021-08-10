/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Button, Icon, Loading, SortTable, Dialog, CheckBoxes } from 'ultraui'
import './index.less'
import Regex from '~/utils/regex'
import HuayunRequest from '~/http/request'
import { application as api } from '~/http/api'

const { CheckBox, RadioGroup } = CheckBoxes
const { FormGroup, Form, Input, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._

class CreateAppPort extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props)
        this.id = props.detail.id
        this.state = {
            name: '', // 入口名称
            description: '', // 描述
            portKey: '', // 应用入口的类型, 入口对象第一个下拉框对应的key
            resourceObjectId: '', // 选中的资源id
            resourceObjectList: [],
            config: {},
            portType: '1', // 1为选择资源，2为用户编辑
            gatewaySelectObj: {}, // 下拉选项
        }
    }

    componentDidMount() {
        this.getGatewaySelect()
    }

    initData = (data) => {
        const { id, dataList } = this.props
        let detail = dataList.find(item => item.id === id)
        const { name, description, resourceObjectId, config } = detail
        if (resourceObjectId) {
            config.resourceObjectId = resourceObjectId
        }
        this.setState({
            name, description, resourceObjectId, config,
            portKey: config.portKey,
            resourceObjectList: data[config.portKey] || [],
            portType: config.type === 'customGateway' ? '2' : '1'
        })
    }

    getGatewaySelect = () => {
        HuayunRequest(api.queryApplicationGatewaySeletc, { applicationId: this.id }, {
            success: (res) => {
                this.setState({
                    gatewaySelectObj: res.data
                })
                this.props.id && this.initData(res.data)
            }
        })
    }

    handleChange = (key, val, item) => {
        const value = _.get(val, 'target.value', val)
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
                    resourceObjectId: '',
                    resourceObjectList: [],
                    config,
                })
            }
            if (key === 'portKey') {
                const { gatewaySelectObj } = this.state
                this.setState({
                    resourceObjectId: '',
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
        const { gatewaySelectObj } = this.state
        const { name, description, portKey, resourceObjectId, resourceObjectList, portType, config: { info } } = this.state
        return (
            <Form form={form}>
                <Input
                    form={form}
                    name='name'
                    value={name}
                    onChange={this.handleChange.bind(this, 'name')}
                    label={intl.formatMessage({ id: 'AppPortName' })}
                    validRegex={Regex.isName}
                    invalidMessage={intl.formatMessage({ id: 'NameErrorMsg' })}
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
                                    name="resourceObjectId"
                                    value={resourceObjectId}
                                    onChange={this.handleChange.bind(this, 'resourceObjectId')}
                                    onSelect={(id, row) => this.handleChange('config', row.config)}
                                    isRequired
                                    options={
                                        resourceObjectList.map((item) => {
                                            return {
                                                value: item.resourceObjectId,
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
                                    name='info'
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
