/* eslint-disable */
import React from 'react'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber, Icon, Input as UltrauiInput } from 'ultraui'
import { Collapse, Button as HuayunButton, Switch } from 'huayunui'
import HuayunRequest from '~/http/request'
import { container as api } from '~/http/api'
import Regex from '~/utils/regex'
import '../index.less'
import { networkInitData, ValidCommonNameProps } from '../constant'
const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
const portTypeList = ['ClusterNetworkPort', 'NodePort', 'LoadBalancePort']
class NetworkConfig extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            netWorkSwitch: false,
            networkList: [], // 外部网络列表
        }
    }
    componentDidMount() {
        this.getVirtualNetworkList() // 虚拟网络列表
    }
    getVirtualNetworkList = () => {
        HuayunRequest(api.getCSNetworks, {}, {
            success: (res) => {
                this.setState({
                    networkList: res.data.sdnNetworks
                })
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        const { formData } = this.props
        const network = _.get(formData, 'network', {}) || {}
        this.setState({
            netWorkSwitch: Object.keys(network).length
        })
    }
    handleSwitchOnChange = (value) => {
        let { formData: { network }, handleFormChange } = this.props
        if (value) {
            network = _.cloneDeep(networkInitData)
        } else {
            network = {}
        }
        this.setState({
            netWorkSwitch: value
        })
        handleFormChange('network', { ...network })
    }
    handleOnChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        let { formData: { network }, handleFormChange } = this.props
        _.set(network, key, value)
        handleFormChange('network', { ...network })
    }
    //节点网络的类型特殊处理, key指向到ports的某一行
    handleNodeNetworkTypeChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        let { formData: { network }, handleFormChange } = this.props
        let portLineData = _.get(network, key, {})
        // 节点网络为手动的时候清空port
        if (value === 'random') {
            portLineData.manner = 'random'
            portLineData.port = ''
        } else {
            portLineData.manner = value
        }
        handleFormChange('network', { ...network })
    }
    // 容器端口表单元素
    renderContainerPortFormItem = (key) => {
        const { intl, form, formData: { network, containers } } = this.props
        const name = `NetworkConfig${key}PortSelect`
        const value = _.get(network, `${key}.containerPort`, '')
        const options = []
        containers && containers.forEach(container => {
            const { ports } = container
            ports && ports.forEach(({ name, port }) => {
                options.push({
                    value: name,
                    text: `${name} - ${port}`
                })
            })
        })
        return (
            <Select
                form={form}
                value={value}
                name={name}
                placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'Port' }) })}
                onChange={(val) => this.handleOnChange(`${key}.containerPort`, val)}
                label={intl.formatMessage({ id: 'ContainerPort' })}
                isRequired
                options={options}
                optionFilterProp='children'
                optionLabelProp='children'
                className='w50 pr'
            />
        )
    }
    // portType有ClusterNetworkPort 、LoadBalancePort 、NodePort三种，
    // 当值为ClusterNetworkPort或LoadBalancePort，调用renderPanelInputFormItem。否则调用renderPanelNodePortInputFormItem
    // 集群网络端口和负载均衡器端口都是普通input，所以合在一块
    renderPanelInputFormItem = (key, portType) => {
        const { intl, form, formData: { network } } = this.props
        const name = `NetworkConfig${key}PortInput`
        const value = _.get(network, `${key}.port`, '')
        return (
            <Input
                form={form}
                value={value || ''}
                name={name}
                placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Port' }) })}
                onChange={(val) => this.handleOnChange(`${key}.port`, parseInt(_.get(val, 'target.value', val)))}
                label={intl.formatMessage({ id: portType })}
                isRequired
                validate={[{
                    trigger: 'onBlur',
                    rules: [
                        (rule, value, callback) => {
                            if (!value) {
                                callback('集群网络端口 不能为空')
                            } else if ((value < 1) || (value > 65535)) {
                                callback('端口范围1~65535')
                            } else {
                                callback()
                            }
                        }
                    ]
                }]}
                type='number'
                className='w50 pl'
            />
        )
    }
    // 节点端口
    renderPanelNodePortInputFormItem = (key) => {
        const { intl, form, formData: { network } } = this.props
        const { manner, port } = _.get(network, key, {})
        return (
            <div className='nodePortInputLine w50 pl'>
                <Select
                    form={form}
                    name={`NetworkConfig${key}NodePortSelect`}
                    value={manner}
                    onChange={(val) => this.handleNodeNetworkTypeChange(key, val)}
                    label={intl.formatMessage({ id: 'NodePort' })}
                    options={[
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
                    value={port || ''}
                    name={`NetworkConfig${key}NodePortInput`}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Port' }) })}
                    onChange={(val) => this.handleOnChange(`${key}.port`, parseInt(_.get(val, 'target.value', val)))}
                    disabled={manner === 'random'}
                    type='number'
                    className='inputPart'
                    validate={[{
                        trigger: 'onBlur',
                        rules: [
                            (rule, value, callback) => {
                                if (value && ((value < 1) || (value > 65535))) {
                                    callback('端口范围1~65535')
                                } else {
                                    callback()
                                }
                            }
                        ]
                    }]}
                />
            </div>
        )
    }
    handleDeletePortLine = (key, index) => {
        let { formData: { network }, handleFormChange } = this.props
        let lineData = _.get(network, key, [])
        lineData.splice(index, 1)
        handleFormChange('network', { ...network })
    }
    renderPortLine = (key, portType, index) => {
        const { formData: { network } } = this.props
        const lineList = _.get(network, key, []) || []
        return (
            <div className='portLine'>
                {this.renderContainerPortFormItem(`${key}.${index}`)}
                {
                    portType === 'NodePort' ? (
                        this.renderPanelNodePortInputFormItem(`${key}.${index}`)
                    ) : (
                        this.renderPanelInputFormItem(`${key}.${index}`, portType)
                    )
                }
                <Button
                    type='text'
                    disabled={lineList.length === 1}
                    onClick={() => this.handleDeletePortLine(key, index)}>
                    <Icon type="minus-o" />
                </Button>
            </div>
        )
    }
    renderPortPanel = (key, portType) => {
        const { intl, form, formData: { network } } = this.props
        const lineList = _.get(network, key, [])
        return (
            <Panel
                form={form}
                value={lineList}
                name={`NetworkConfig${key}Port`}
                label={intl.formatMessage({ id: 'Port' })}
                isRequired
                className='portPanel'
            >
                {
                    lineList && lineList.map((item, index) => {
                        return this.renderPortLine(key, portType, index)
                    })
                }
                <HuayunButton
                    type="operate"
                    icon={<Icon type="add" />}
                    onClick={() => this.handleAddPortLine(key, portType)}
                    name="添加端口"
                    className='addBoxItemBtn'
                />
            </Panel>
        )
    }
    handleAddPortLine = (key, portType) => {
        const { formData: { network }, handleFormChange } = this.props
        const portItem = portType === 'NodePort' ? {
            containerPort: '',
            manner: 'random', // 先给个默认值
            port: 0
        } : {
            containerPort: '',
            port: 0,
        }
        let ports = _.get(network, key, [])
        ports.push(portItem)
        handleFormChange('network', { ...network })
    }
    // 渲染容器集群网络Collapse的Panel
    renderClusterNetworkCollapsePanel = (item, index) => {
        const { form, intl } = this.props
        const { name } = item
        const title = `${intl.formatMessage({ id: 'ContainerClusterNetwork' })}${index + 1}`
        return (
            <Collapse.Panel header={this.renderCollapsePanelHeader('containerNetworks', title, index)} key={index}>
                <Input
                    form={form}
                    name={`NetworkConfigContainerNetworks${index}Name`}
                    value={name}
                    onChange={(val) => this.handleOnChange(`containerNetworks.${index}.name`, val)}
                    label={intl.formatMessage({ id: 'Name' })}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Name' }) })}
                    isRequired
                    {...ValidCommonNameProps}
                />
                {this.renderPortPanel(`containerNetworks.${index}.ports`, portTypeList[0])}
            </Collapse.Panel>
        )
    }
    // 渲染节点网络Collapse的Panel
    renderNodeNetworkCollapsePanel = (item, index) => {
        const { form, intl } = this.props
        const { name } = item
        const title = `${intl.formatMessage({ id: 'NodeNetwork' })}${index + 1}`
        return (
            <Collapse.Panel header={this.renderCollapsePanelHeader('nodeNetworks', title, index)} key={index}>
                <Input
                    form={form}
                    name={`NetworkConfigNodeNetworks${index}Name`}
                    value={name}
                    onChange={(val) => this.handleOnChange(`nodeNetworks.${index}.name`, val)}
                    label={intl.formatMessage({ id: 'Name' })}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Name' }) })}
                    isRequired
                    {...ValidCommonNameProps}
                />
                {this.renderPortPanel(`nodeNetworks.${index}.ports`, portTypeList[1])}
            </Collapse.Panel>
        )
    }
    renderCollapsePanelHeader = (type, title, index) => {
        const { intl } = this.props
        return (
            <div className='panelHeader'>
                <div className='panelTitle'>{title}</div>
                <Button type='text' onClick={() => this.handleDeleteCollapsePanel(type, index)}>
                    <Icon type="empty" />&nbsp;{intl.formatMessage({ id: 'Delete' })}
                </Button>
            </div>
        )
    }
    handleDeleteCollapsePanel = (type, index) => {
        const { formData: { network }, handleFormChange } = this.props
        if (index > -1) {
            network[type].splice(index, 1)
        } else {
            delete network[type]
        }
        handleFormChange('network', { ...network })
    }
    // 渲染容器集群网络
    renderContainerClusterNetwork = () => {
        const { intl, formData: { network } } = this.props
        const containerNetworks = _.get(network, 'containerNetworks', []) || []
        return (
            <React.Fragment>
                {
                    containerNetworks.length ? (
                        <Collapse defaultActiveKey={[0]}>
                            {
                                containerNetworks && containerNetworks.map((item, index) => {
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
        let containerNetworks = _.get(network, 'containerNetworks', [])
        containerNetworks.push({
            name: '',
            ports: [
                {
                    containerPort: '',
                    port: 0
                }
            ]
        })
        handleFormChange('network', { ...network })
    }
    // 渲染节点网络
    renderNodeNetwork = () => {
        const { intl, formData: { network } } = this.props
        const nodeNetworks = _.get(network, 'nodeNetworks', []) || []
        return (
            <React.Fragment>
                {
                    nodeNetworks.length ? (
                        <Collapse defaultActiveKey={[0]}>
                            {
                                nodeNetworks && nodeNetworks.map((item, index) => {
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
        let nodeNetworks = _.get(network, 'nodeNetworks', [])
        nodeNetworks.push({
            name: '',
            ports: [
                {
                    containerPort: '',
                    manner: 'random',
                    port: 0
                }
            ]
        })
        handleFormChange('network', { ...network })
    }
    // 渲染负载均衡
    renderLoadBalanceNetwork = () => {
        const { intl, formData: { network }, form } = this.props
        const { networkList } = this.state
        const { name, ports, netId } = _.get(network, 'loadBalanceNetwork', {})
        return (
            <>
                {
                    network.loadBalanceNetwork ? (
                        <Collapse defaultActiveKey={[0]}>
                            <Collapse.Panel header={this.renderCollapsePanelHeader('loadBalanceNetwork', '外部网络', -1)}>
                                <Input
                                    form={form}
                                    name='NetworkConfigLoadBalanceNetworkName'
                                    value={name}
                                    onChange={(val) => this.handleOnChange('loadBalanceNetwork.name', val)}
                                    label={intl.formatMessage({ id: 'Name' })}
                                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Name' }) })}
                                    isRequired
                                    {...ValidCommonNameProps}
                                />
                                <Select
                                    form={form}
                                    name="NetworkConfigLoadBalanceNetworkNetId"
                                    value={netId}
                                    placeholder={intl.formatMessage({ id: 'SelectProjectPlaceHolder' })}
                                    onChange={(val) => this.handleOnChange('loadBalanceNetwork.netId', val)}
                                    label={intl.formatMessage({ id: 'VirtualNetwork' })}
                                    isRequired
                                    options={
                                        networkList.map(item => {
                                            return {
                                                value: item.id,
                                                text: item.name,
                                            }
                                        })
                                    }
                                    optionFilterProp='children'
                                    optionLabelProp='children'
                                />
                                {this.renderPortPanel('loadBalanceNetwork.ports', portTypeList[2])}
                            </Collapse.Panel>
                        </Collapse>
                    ) : (
                        <HuayunButton
                            type="operate"
                            icon={< Icon type="add" />}
                            onClick={this.handleAddLoadBalanceNetwork}
                            name="添加外部网络"
                            className='addBoxItemBtn'
                        />
                    )
                }
            </>
        )
    }
    handleAddLoadBalanceNetwork = () => {
        let { intl, formData: { network }, handleFormChange } = this.props
        network.loadBalanceNetwork = {
            name: '',
            netId: '',
            ports: []
        }
        handleFormChange('network', { ...network })
    }
    render() {
        const { form, intl, formData: { network }, handleFormChange } = this.props
        const { netWorkSwitch } = this.state
        return (
            <div className='NetworkConfig'>
                <div className='lineItem'>
                    <div className='lineTitle'>{intl.formatMessage({ id: 'ContainerNetwork' })}</div>
                    <Switch checked={netWorkSwitch} onChange={this.handleSwitchOnChange} />
                </div>
                {
                    netWorkSwitch ? (
                        <React.Fragment>
                            <div className='lineItem vertical'>
                                <div className='lineTitle'>{intl.formatMessage({ id: 'ContainerClusterNetwork' })}</div>
                                {this.renderContainerClusterNetwork()}
                            </div>
                            <div className='lineItem vertical'>
                                <div className='lineTitle'>{intl.formatMessage({ id: 'NodeNetwork' })}</div>
                                {this.renderNodeNetwork()}
                            </div>
                            <div className='lineItem vertical'>
                                <div className='lineTitle'>外部网络</div>
                                {this.renderLoadBalanceNetwork()}
                            </div>
                        </React.Fragment>
                    ) : null
                }
            </div>
        )
    }
}

export default NetworkConfig
