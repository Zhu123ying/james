/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber, Icon } from 'ultraui'
import { Collapse, Button as HuayunButton, Switch } from 'huayunui'
import Regex from '~/utils/regex'
import './index.less'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
class NetworkConfig extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    handleOnChange = (type, typeIndex, key) => {
        const value = _.get(val, 'target.value', val)
        let { formData: { network }, handleFormChange } = this.props
        network[type][typeIndex][key] = value
        handleFormChange('network', { ...network })
    }
    // port表单元素值的变化处理
    handlePortLineChange = (type, typeIndex, podKey, portIndex, key, val) => {
        const value = _.get(val, 'target.value', val)
        let { formData: { network }, handleFormChange } = this.props
        network[type][typeIndex][podKey][portIndex][key] = value
        handleFormChange('network', { ...network })
    }
    // 容器端口表单元素
    renderContainerPortFormItem = (type, typeIndex, podKey, portIndex) => {
        // type参数为network的第一层key，有containerNetworks(容器集群网络)、nodeNetworks(节点网络))、loadBalanceNetwork(负载均衡)
        // typeIndex参数为network[type]的索引
        // portIndex参数为network[type][typeIndex][podKey]的索引
        const { intl, form, formData: { network, containers } } = this.props
        const name = `${type}${typeIndex}PortSelect${portIndex}`
        const value = network[type][typeIndex][podKey][portIndex]['containerPort']
        return (
            <Select
                form={form}
                value={value}
                name={name}
                placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'Port' }) })}
                onChange={(val) => this.handlePortLineChange(type, typeIndex, podKey, portIndex, 'containerPort')}
                label={intl.formatMessage({ id: 'ContainerPort' })}
                isRequired
                options={[
                    // 先写死的
                    { value: 'secret', text: 'secret' },
                    { value: 'configMap', text: 'configMap' }
                ]}
                optionFilterProp='children'
                optionLabelProp='children'
            />
        )
    }
    // portType有ClusterNetworkPort 、LoadBalancePort 、NodePort三种，
    // 当值为ClusterNetworkPort或LoadBalancePort，调用renderPanelInputFormItem。否则调用renderPanelNodePortInputFormItem
    // 集群网络端口和负载均衡器端口都是普通input，所以合在一块
    renderPanelInputFormItem = (type, typeIndex, podKey, portIndex, portType) => {
        const { intl, form, formData: { network } } = this.props
        const name = `${type}${typeIndex}${portType}Input${portIndex}`
        const value = network[type][typeIndex][podKey][portIndex]['port']
        return (
            <Input
                form={form}
                value={value}
                name={name}
                placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Port' }) })}
                onChange={(val) => this.handlePortLineChange(type, typeIndex, podKey, portIndex, 'port')}
                label={intl.formatMessage({ id: portType })}
                isRequired
            />
        )
    }
    // 节点端口
    renderPanelNodePortInputFormItem = (type, typeIndex, podKey, portIndex, portType) => {
        const { form, formData: { network } } = this.props
        const name = `${type}${typeIndex}NodePortInput${portIndex}`
        const { manner, port } = network[type][typeIndex][podKey][portIndex]
        return (
            <Input.Group compact>
                <Select
                    value={manner}
                    onChange={(val) => this.handlePortLineChange(type, typeIndex, podKey, portIndex, 'manner')}
                    style={{ width: '30%' }}
                >
                    <Option value="manual">手动</Option>
                    <Option value="random">自动</Option>
                </Select>
                <Input
                    form={form}
                    value={port}
                    name={name}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Port' }) })}
                    onChange={(val) => this.handlePortLineChange(type, typeIndex, podKey, portIndex, 'port')}
                    label={intl.formatMessage({ id: portType })}
                    isRequired={manner === 'random'}
                    disabled={manner === 'random'}
                    type='number'
                />
            </Input.Group>
        )
    }
    handleDeletePortLine = (type, typeIndex, podKey, portIndex) => {
        const { formData: { network }, handleFormChange } = this.props
        network[type][typeIndex][podKey].splice(portIndex, 1)
        handleFormChange('network', { ...network })
    }
    renderPortLine = (type, typeIndex, podKey, portIndex, portType) => {
        const { formData: { network } } = this.props
        const lineList = network[type][typeIndex][podKey]
        return (
            <div className='portLine'>
                {this.renderContainerPortFormItem(type, typeIndex, podKey, portIndex)}
                {
                    portType === 'NodePort' ? (
                        this.renderPanelNodePortInputFormItem(type, typeIndex, podKey, portIndex, portType)
                    ) : (
                        this.renderPanelInputFormItem(type, typeIndex, podKey, portIndex, portType)
                    )
                }
                {/* <Button
                    type='text'
                    disabled={lineList.length === 0}
                    onClick={() => this.handleDeletePortLine(type, typeIndex, podKey, portIndex)}>
                    <Icon type="minus-o" />&nbsp;{intl.formatMessage({ id: 'Delete' })}
                </Button> */}
                <HuayunButton
                    type="operate"
                    icon={<Icon type="minus-o" />}
                    onClick={() => this.handleDeletePortLine(type, typeIndex, podKey, portIndex)}
                    disabled={lineList.length === 1}
                />
            </div>
        )
    }
    renderPortPanel = (type, typeIndex, podKey, portType) => {
        const { intl, form, formData: { network } } = this.props
        const lineList = network[type][typeIndex][podKey]
        return (
            <Panel
                form={form}
                value={lineList}
                name={`${type}${typeIndex}Port`}
                label={intl.formatMessage({ id: 'Port' })}
                isRequired
            >
                {
                    lineList.map((item, index) => {
                        return this.renderPortLine(type, typeIndex, podKey, index, portType)
                    })
                }
                <HuayunButton
                    type="operate"
                    icon={<Icon type="add" />}
                    onClick={() => this.handleAddPortLine(type, typeIndex, podKey, portType)}
                    name="添加端口"
                    className='addBoxItemBtn'
                />
            </Panel>
        )
    }
    handleAddPortLine = (type, typeIndex, podKey, portType) => {
        const { formData: { network }, handleFormChange } = this.props
        const portItem = portType === 'NodePort' ? {
            containerPort: '',
            manner: '',
            port: ''
        } : {
            containerPort: '',
            manner: '',
        }
        network[type][typeIndex][podKey].push(portItem)
        handleFormChange('network', { ...network })
    }
    // 渲染容器集群网络Collapse的Panel
    renderClusterNetworkCollapsePanel = (item, index) => {
        const { form, intl } = this.props
        const { name } = item
        return (
            <Collapse.Panel header={this.renderCollapsePanelHeader(index)} key={index}>
                <Input
                    form={form}
                    name={`containerNetworks${index}Name`}
                    value={name}
                    onChange={(val) => this.handleOnChange('containerNetworks', index, 'name')}
                    label={intl.formatMessage({ id: 'Name' })}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Name' }) })}
                    validRegex={Regex.isName}
                    isRequired
                />
                {this.renderPortPanel('containerNetworks', index, 'ports', 'ClusterNetworkPort')}
            </Collapse.Panel>
        )
    }
    renderCollapsePanelHeader = (type, title, index) => {
        const { intl } = this.props
        return (
            <div className='panelHeader'>
                <div className='panelTitle'>{`${title}${index + 1}`}</div>
                <Button type='text' onClick={() => this.handleDeleteCollapsePanel(type, index)}>
                    <Icon type="empty" />&nbsp;{intl.formatMessage({ id: 'Delete' })}
                </Button>
            </div>
        )
    }
    handleDeleteCollapsePanel = (type, index) => {
        const { formData: { network } } = this.props
        network[type].splice(index, 1)
        handleFormChange('network', { ...network })
    }
    // 渲染容器集群网络
    renderContainerClusterNetwork = () => {
        const { intl, formData: { network: { containerNetworks } } } = this.props
        return (
            <React.Fragment>
                {
                    containerNetworks.length ? (
                        <Collapse defaultActiveKey={[0]}>
                            {
                                containerNetworks.map((item, index) => {
                                    return this.renderClusterNetworkCollapsePanel(item, index)
                                })
                            }
                        </Collapse>
                    ) : null
                }
                <HuayunButton
                    type="operate"
                    icon={< Icon type="add" />}
                    onClick={this.handleAddClusterNetwork}
                    name="添加集群网络"
                    className='addBoxItemBtn'
                />
            </React.Fragment>
        )
    }
    handleAddClusterNetwork = () => {
        let { intl, formData: { network }, handleFormChange } = this.props
        network.containerNetworks.push({
            name: '',
            ports: [
                {
                    containerPort: '',
                    port: ''
                }
            ]
        })
        handleFormChange('network', { ...network })
    }
    render() {
        const { form, intl, formData: { networkState, network }, handleFormChange } = this.props
        return (
            <div className='NetworkConfig'>
                <div className='lineItem'>
                    <div className='lineTitle'>{intl.formatMessage({ id: 'ContainerNetwork' })}</div>
                    <Switch onChange={() => handleFormChange('networkState', !networkState)} />
                </div>
                <div className='lineItem'>
                    <div className='lineTitle'>{intl.formatMessage({ id: 'ContainerClusterNetwork' })}</div>
                    {this.renderContainerClusterNetwork()}
                </div>
            </div>
        )
    }
}

export default NetworkConfig
