/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber, Icon, Input as UltrauiInput } from 'ultraui'
import { Collapse, Button as HuayunButton, Switch } from 'huayunui'
import Regex from '~/utils/regex'
import './index.less'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
const portTypeList = ['ClusterNetworkPort', 'NodePort', 'LoadBalancePort']
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
    handleOnChange = (type, typeIndex, key, val) => {
        const value = _.get(val, 'target.value', val)
        let { formData: { network }, handleFormChange } = this.props
        let dataItem = network[type]
        // 容器网络和节点网络是数组结构，负载均衡是对象结构
        if (Array.isArray(dataItem) && typeIndex > -1) {
            dataItem[typeIndex][key] = value
        } else {
            dataItem[key] = value
        }
        handleFormChange('network', { ...network })
    }
    // port表单元素值的变化处理
    handlePortLineChange = (type, typeIndex, podKey, portIndex, key, val) => {
        const value = _.get(val, 'target.value', val)
        let { formData: { network }, handleFormChange } = this.props
        network[type][typeIndex][podKey][portIndex][key] = value
        // 节点网络为手动的时候清空port
        if (key === 'manner' && value === 'random') {
            network[type][typeIndex][podKey][portIndex]['port'] = ''
        }
        handleFormChange('network', { ...network })
    }
    // 容器端口表单元素
    renderContainerPortFormItem = (type, typeIndex, podKey, portIndex) => {
        // type参数为network的第一层key，有containerNetworks(容器集群网络)、nodeNetworks(节点网络))、loadBalanceNetwork(负载均衡)
        // typeIndex参数为network[type]的索引
        // portIndex参数为network[type][typeIndex][podKey]的索引
        const { intl, form, formData: { network, containers } } = this.props
        const name = `${type}${typeIndex}PortSelect${portIndex}`
        const value = typeIndex > -1 ? network[type][typeIndex][podKey][portIndex]['containerPort'] : network[type][podKey][portIndex]['containerPort']
        return (
            <Select
                form={form}
                value={value}
                name={name}
                placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'Port' }) })}
                onChange={(val) => this.handlePortLineChange(type, typeIndex, podKey, portIndex, 'containerPort', val)}
                label={intl.formatMessage({ id: 'ContainerPort' })}
                isRequired
                options={[
                    // 先写死的
                    { value: 'secret', text: 'secret' },
                    { value: 'configMap', text: 'configMap' }
                ]}
                optionFilterProp='children'
                optionLabelProp='children'
                className='w50 pr'
            />
        )
    }
    // portType有ClusterNetworkPort 、LoadBalancePort 、NodePort三种，
    // 当值为ClusterNetworkPort或LoadBalancePort，调用renderPanelInputFormItem。否则调用renderPanelNodePortInputFormItem
    // 集群网络端口和负载均衡器端口都是普通input，所以合在一块
    renderPanelInputFormItem = (type, typeIndex, podKey, portIndex, portType) => {
        const { intl, form, formData: { network } } = this.props
        const name = `${type}${typeIndex}${portType}Input${portIndex}`
        const value = typeIndex > -1 ? network[type][typeIndex][podKey][portIndex]['port'] : network[type][podKey][portIndex]['port']
        return (
            <Input
                form={form}
                value={value}
                name={name}
                placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Port' }) })}
                onChange={(val) => this.handlePortLineChange(type, typeIndex, podKey, portIndex, 'port', val)}
                label={intl.formatMessage({ id: portType })}
                isRequired
                type='number'
                className='w50 pl'
            />
        )
    }
    // 节点端口
    renderPanelNodePortInputFormItem = (type, typeIndex, podKey, portIndex, portType) => {
        const { intl, form, formData: { network } } = this.props
        const { manner, port } = network[type][typeIndex][podKey][portIndex]
        return (
            <div className='nodePortInputLine w50 pl'>
                <Select
                    form={form}
                    name={`${type}${typeIndex}NodePortSelect${portIndex}`}
                    value={manner}
                    onChange={(val) => this.handlePortLineChange(type, typeIndex, podKey, portIndex, 'manner', val)}
                    label={intl.formatMessage({ id: portType })}
                    options={[
                        // 先写死的
                        { value: 'manual', text: '手动' },
                        { value: 'random', text: '自动' }
                    ]}
                    optionFilterProp='children'
                    optionLabelProp='children'
                    isRequired
                    className='selectPart'
                />
                <Input
                    form={form}
                    value={port}
                    name={`${type}${typeIndex}NodePortInput${portIndex}`}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Port' }) })}
                    onChange={(val) => this.handlePortLineChange(type, typeIndex, podKey, portIndex, 'port', val)}
                    // label={intl.formatMessage({ id: portType })}
                    // isRequired={manner === 'manual'}
                    disabled={manner === 'random'}
                    type='number'
                    className='inputPart'
                />
            </div>
        )
    }
    handleDeletePortLine = (type, typeIndex, podKey, portIndex) => {
        const { formData: { network }, handleFormChange } = this.props
        network[type][typeIndex][podKey].splice(portIndex, 1)
        handleFormChange('network', { ...network })
    }
    renderPortLine = (type, typeIndex, podKey, portIndex, portType) => {
        const { formData: { network } } = this.props
        const lineList = typeIndex > -1 ? network[type][typeIndex][podKey] : network[type][podKey]
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
                <Button
                    type='text'
                    disabled={lineList.length === 1}
                    onClick={() => this.handleDeletePortLine(type, typeIndex, podKey, portIndex)}>
                    <Icon type="minus-o" />
                </Button>
            </div>
        )
    }
    renderPortPanel = (type, typeIndex, podKey, portType) => {
        const { intl, form, formData: { network } } = this.props
        // 容器网络和节点网络是数组结构，负载均衡是对象结构
        const lineList = typeIndex > -1 ? network[type][typeIndex][podKey] : network[type][podKey]
        return (
            <Panel
                form={form}
                value={lineList}
                name={`${type}${typeIndex}Port`}
                label={intl.formatMessage({ id: 'Port' })}
                isRequired
                className='portPanel'
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
            manner: 'random', // 先给个默认值
            port: ''
        } : {
            containerPort: '',
            port: '',
        }
        const dataItem = network[type]
        // 容器网络和节点网络是数组结构，负载均衡是对象结构
        if (Array.isArray(dataItem) && typeIndex > -1) {
            dataItem[typeIndex][podKey].push(portItem)
        } else {
            dataItem[podKey].push(portItem)
        }
        handleFormChange('network', { ...network })
    }
    // 渲染容器集群网络Collapse的Panel
    renderClusterNetworkCollapsePanel = (item, index) => {
        const { form, intl } = this.props
        const { name } = item
        const title = intl.formatMessage({ id: 'ContainerClusterNetwork' })
        return (
            <Collapse.Panel header={this.renderCollapsePanelHeader('containerNetworks', title, index)} key={index}>
                <Input
                    form={form}
                    name={`containerNetworks${index}Name`}
                    value={name}
                    onChange={(val) => this.handleOnChange('containerNetworks', index, 'name', val)}
                    label={intl.formatMessage({ id: 'Name' })}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Name' }) })}
                    validRegex={Regex.isName}
                    isRequired
                />
                {this.renderPortPanel('containerNetworks', index, 'ports', portTypeList[0])}
            </Collapse.Panel>
        )
    }
    // 渲染节点网络Collapse的Panel
    renderNodeNetworkCollapsePanel = (item, index) => {
        const { form, intl } = this.props
        const { name } = item
        const title = intl.formatMessage({ id: 'NodeNetwork' })
        return (
            <Collapse.Panel header={this.renderCollapsePanelHeader('nodeNetworks', title, index)} key={index}>
                <Input
                    form={form}
                    name={`nodeNetworks${index}Name`}
                    value={name}
                    onChange={(val) => this.handleOnChange('nodeNetworks', index, 'name', val)}
                    label={intl.formatMessage({ id: 'Name' })}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Name' }) })}
                    validRegex={Regex.isName}
                    isRequired
                />
                {this.renderPortPanel('nodeNetworks', index, 'ports', portTypeList[1])}
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
        const { formData: { network }, handleFormChange } = this.props
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
    // 添加容器集群网络
    handleAddClusterNetwork = () => {
        let { intl, formData: { network }, handleFormChange } = this.props
        network.containerNetworks.push({
            name: '',
            ports: [
                // {
                //     containerPort: '',
                //     port: ''
                // }
            ]
        })
        handleFormChange('network', { ...network })
    }
    // 渲染节点网络
    renderNodeNetwork = () => {
        const { intl, formData: { network: { nodeNetworks } } } = this.props
        return (
            <React.Fragment>
                {
                    nodeNetworks.length ? (
                        <Collapse defaultActiveKey={[0]}>
                            {
                                nodeNetworks.map((item, index) => {
                                    return this.renderNodeNetworkCollapsePanel(item, index)
                                })
                            }
                        </Collapse>
                    ) : null
                }
                <HuayunButton
                    type="operate"
                    icon={< Icon type="add" />}
                    onClick={this.handleAddNodeNetwork}
                    name="添加节点网络"
                    className='addBoxItemBtn'
                />
            </React.Fragment>
        )
    }
    // 添加节点网络
    handleAddNodeNetwork = () => {
        let { intl, formData: { network }, handleFormChange } = this.props
        network.nodeNetworks.push({
            name: '',
            ports: [
                // {
                //     containerPort: '',
                //     manner: '',
                //     port: ''
                // }
            ]
        })
        handleFormChange('network', { ...network })
    }
    // 渲染负载均衡
    renderLoadBalanceNetwork = () => {
        const { intl, formData: { network: { loadBalanceNetwork } }, form } = this.props
        const { name, ports } = loadBalanceNetwork
        return (
            <Collapse defaultActiveKey={[0]}>
                <Collapse.Panel header={intl.formatMessage({ id: 'LoadBalance' })}>
                    <Input
                        form={form}
                        name='loadBalanceNetworkName'
                        value={name}
                        onChange={(val) => this.handleOnChange('loadBalanceNetwork', -1, 'name', val)}
                        label={intl.formatMessage({ id: 'Name' })}
                        placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Name' }) })}
                        validRegex={Regex.isName}
                        isRequired
                    />
                    {this.renderPortPanel('loadBalanceNetwork', -1, 'ports', portTypeList[2])}
                </Collapse.Panel>
            </Collapse>
        )
    }
    render() {
        const { form, intl, formData: { networkState, network }, handleFormChange } = this.props
        return (
            <div className='NetworkConfig'>
                <div className='lineItem'>
                    <div className='lineTitle'>{intl.formatMessage({ id: 'ContainerNetwork' })}</div>
                    <Switch onChange={() => handleFormChange('networkState', !networkState)} />
                </div>
                <div className='lineItem vertical'>
                    <div className='lineTitle'>{intl.formatMessage({ id: 'ContainerClusterNetwork' })}</div>
                    {this.renderContainerClusterNetwork()}
                </div>
                <div className='lineItem vertical'>
                    <div className='lineTitle'>{intl.formatMessage({ id: 'NodeNetwork' })}</div>
                    {this.renderNodeNetwork()}
                </div>
                <div className='lineItem vertical'>
                    <div className='lineTitle'>{intl.formatMessage({ id: 'LoadBalance' })}</div>
                    {this.renderLoadBalanceNetwork()}
                </div>
            </div>
        )
    }
}

export default NetworkConfig
