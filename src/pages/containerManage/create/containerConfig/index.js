/* eslint-disable */
import React from 'react'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber, Icon, Switch } from 'ultraui'
import { Collapse, Button as HuayunButton, Modal } from 'huayunui'
import { Cascader } from 'antd'
import Regex from '~/utils/regex'
import '../index.less'
import Card from '~/components/Card'
import DividerBox from '~/components/DividerBox'
import OperateMountConfig from './operateMountConfig'
import OperateEnvs from './operateEnvs'
import OperatePorts from './operatePorts'
import { containerConfig_containerItem, ValidCommonNameProps } from '../constant'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
const pullStrategyList = ['Always', 'IfNotPresent', 'Never']
const containerTypeList = [
    { value: 'ApplicationContainer', text: '应用容器' },
    { value: 'InitContainer', text: '初始化容器' }
]
const testTypeList = [
    { value: 'Liveness', text: '存活检测' }
]
const testMethodList = [
    { value: 'exec', text: 'exec' }
]
const paramItem = {
    visible: false, // modal的显示
    type: '', // 添加还是编辑，
    path: '', // data元素对应的路径
}
const ContainerMountTypeObj = {
    configuration: '配置文件',
    storage: '持久存储'
}
class ContainerConfig extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentArgs: [], // 启动参数
            currentCommand: [], // 启动命令
            // modal的参数，包括挂载配置，环境变量和端口的相关数据（visible，type，path）
            modalParams: {
                mounts: { ...paramItem },
                envs: { ...paramItem },
                ports: { ...paramItem }
            }
        }
    }
    componentDidMount() {

    }
    renderPanelHeader = (index) => {
        const { intl, formData: { containers } } = this.props
        return (
            <div className='panelHeader'>
                <div className='panelTitle'>{`${intl.formatMessage({ id: 'Container' })}${index + 1}`}</div>
                <Button type='text' onClick={() => this.handleRemoveFormDataItem('containers', index)} disabled={containers.length === 1}>
                    <Icon type="empty" />&nbsp;{intl.formatMessage({ id: 'Delete' })}
                </Button>
            </div>
        )
    }
    handleAddContainer = () => {
        const { handleFormChange, formData: { containers } } = this.props
        handleFormChange('containers', [...containers, { ...containerConfig_containerItem }])
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
    // 点击按钮，添加启动参数、启动命令到formData里
    handleClickInputAddBtn = (formDataKey, stateKey, index) => {
        let { handleFormChange, formData: { containers } } = this.props
        let formData = _.get(containers, `${index}.${formDataKey}`, [])
        let stateData = this.state[stateKey]
        formData.push(stateData[index])
        stateData[index] = ''
        this.setState({
            [stateKey]: stateData
        })
        handleFormChange('containers', [...containers])
    }
    // 删除是通用的，因为知道key了就能删
    handleRemoveFormDataItem = (key, index) => {
        let { handleFormChange, formData } = this.props
        let array = _.get(formData, key, [])
        array.splice(index, 1)
        handleFormChange('formData', { ...formData })
    }
    // 提交挂载配置的modal
    handleConfirmManageMountConfig = () => {
        let { handleFormChange, formData: { containers }, intl } = this.props
        const { modalParams: { mounts } } = this.state
        const { type, subType, mountItem, mountPath, readOnly, subPath } = this.$OperateMountConfig.state
        this.$OperateMountConfig.props.form.validateFields((error, values) => {
            if (!error) {
                if (mounts.type === 'add') {
                    let arr = _.get(containers, mounts.path, [])
                    arr.push({
                        type, subType, mountItem, mountPath, readOnly, subPath
                    })
                } else {
                    _.set(containers, mounts.path, { type, subType, mountItem, mountPath, readOnly, subPath })
                }
                handleFormChange('containers', [...containers])
                this.handleCancelModal('mounts')
            }
        })
    }
    // 提交环境变量的modal
    handleConfirmManageEnvs = () => {
        let { handleFormChange, formData: { containers }, intl } = this.props
        const { modalParams: { envs } } = this.state
        const { envKey, type, envValue, selectFile, selectKey } = this.$OperateEnvs.state
        this.$OperateEnvs.props.form.validateFields((error, values) => {
            if (!error) {
                if (envs.type === 'add') {
                    let arr = _.get(containers, envs.path, [])
                    arr.push({
                        envKey, type, envValue, selectFile, selectKey
                    })
                } else {
                    _.set(containers, envs.path, { envKey, type, envValue, selectFile, selectKey })
                }
                handleFormChange('containers', [...containers])
                this.handleCancelModal('envs')
            }
        })
    }
    // 提交端口的modal
    handleConfirmManagePorts = () => {
        let { handleFormChange, formData: { containers }, intl } = this.props
        const { modalParams: { ports } } = this.state
        const { name, protocol, port } = this.$OperatePorts.state
        this.$OperatePorts.props.form.validateFields((error, values) => {
            if (!error) {
                if (ports.type === 'add') {
                    let arr = _.get(containers, ports.path, [])
                    arr.push({
                        name, protocol, port
                    })
                } else {
                    _.set(containers, ports.path, { name, protocol, port })
                }
                handleFormChange('containers', [...containers])
                this.handleCancelModal('ports')
            }
        })
    }
    // 取消modal
    handleCancelModal = (key) => {
        let { modalParams } = this.state
        modalParams[key] = {
            visible: false,
            type: '',
            path: ''
        }
        this.setState({
            modalParams: { ...modalParams }
        })
    }
    // 打开modal
    handleManageModal = (key, type, path) => {
        let { modalParams } = this.state
        modalParams[key] = {
            visible: true,
            type,
            path
        }
        this.setState({
            modalParams: { ...modalParams }
        })
    }
    // 级联选择
    handleCascaderOnChange = (key, arr) => {
        const [project, repo, tag] = arr
        let { handleFormChange, formData: { containers } } = this.props
        let image = _.get(containers, key)
        Object.assign(image, { project, repo, tag })
        handleFormChange('containers', [...containers])
    }
    // 健康检测的验证，都为空的时候都可以不填，填了一个就必须都填
    validateHealthyTest = (value, callback) => {
        const { formData: { containers } } = this.props
        console.log(value)
        console.log(containers)
        callback('aaaaa')
    }
    render() {
        const { form, intl, formData, handleFormChange, containerImageList } = this.props
        const { containers } = formData
        const { currentArgs, currentCommand, modalParams } = this.state
        const { mounts: mountsParams, envs: envsParams, ports: portsParams } = modalParams
        const currentMountConfig = mountsParams.type === 'update' ? _.get(containers, mountsParams.path, {}) : {}
        const currentEnvs = envsParams.type === 'update' ? _.get(containers, envsParams.path, {}) : {}
        const currentPorts = portsParams.type === 'update' ? _.get(containers, portsParams.path, {}) : {}
        return (
            <div className='ContainerConfig'>
                {
                    Array.isArray(containers) && containers.length ? (
                        // 默认全展开吧
                        <Collapse defaultActiveKey={containers.map((item, index) => index)}>
                            {
                                containers.map((item, index) => {
                                    const { name, type, image, runVar, mounts, envs, probe, ports } = item
                                    const { project, repo, tag, pullStrategy } = image
                                    const { workDir, command, privileged, args } = runVar
                                    const cascaderValue = project && repo && tag && [project, repo, tag]
                                    return (
                                        <Collapse.Panel header={this.renderPanelHeader(index)} key={index}>
                                            <Input
                                                form={form}
                                                name={`ContainerConfig${index}Name`}
                                                value={name}
                                                onChange={(val) => this.handleFormDataOnChange(`${index}.name`, val)}
                                                label={intl.formatMessage({ id: 'ContainerName' })}
                                                placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'ContainerName' }) })}
                                                isRequired
                                                {...ValidCommonNameProps}
                                            />
                                            <Select
                                                form={form}
                                                name={`ContainerConfig${index}Type`}
                                                value={type}
                                                onChange={(val) => this.handleFormDataOnChange(`${index}.type`, val)}
                                                placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'Type' }) })}
                                                label={`${intl.formatMessage({ id: 'Container' })}${intl.formatMessage({ id: 'Type' })}`}
                                                options={containerTypeList}
                                                optionFilterProp='children'
                                                optionLabelProp='children'
                                                isRequired
                                            />
                                            <Panel
                                                form={form}
                                                value={image}
                                                name={`ContainerConfig${index}Image`}
                                                label={intl.formatMessage({ id: 'ContainerImage' })}
                                                inline
                                                isRequired
                                            >
                                                <Cascader
                                                    fieldNames={{ label: 'name', value: 'id' }}
                                                    allowClear={false}
                                                    options={containerImageList}
                                                    value={cascaderValue}
                                                    onChange={(val) => this.handleCascaderOnChange(`${index}.image`, val)}
                                                    placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'ContainerImage' }) })}
                                                />
                                            </Panel>
                                            <Select
                                                form={form}
                                                name={`ContainerConfig${index}ImagePullStrategy`}
                                                value={pullStrategy}
                                                onChange={(val) => this.handleFormDataOnChange(`${index}.image.pullStrategy`, val)}
                                                placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'PullStrategy' }) })}
                                                label={intl.formatMessage({ id: 'PullStrategy' })}
                                                options={pullStrategyList}
                                                optionFilterProp='children'
                                                optionLabelProp='children'
                                                isRequired
                                            />
                                            <Input
                                                form={form}
                                                name={`ContainerConfig${index}RunVarWorkDir`}
                                                value={workDir}
                                                onChange={(val) => this.handleFormDataOnChange(`${index}.runVar.workDir`, val)}
                                                label={intl.formatMessage({ id: 'WorkingDirectory' })}
                                                placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'WorkingDirectory' }) })}
                                            />
                                            {/* 启动参数 */}
                                            <Panel
                                                form={form}
                                                value={args}
                                                name={`ContainerConfig${index}RunVarArgs`}
                                                label={intl.formatMessage({ id: 'StartParameter' })}
                                                inline
                                                className='labelPanel'
                                            >
                                                <div className='inputWithAddBtn'>
                                                    <Input
                                                        form={form}
                                                        name={`ContainerConfig${index}RunVarCurrentArgs`}
                                                        value={currentArgs[index]}
                                                        onChange={(val) => this.handleStateOnChange('currentArgs', index, val)}
                                                        placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'StartParameter' }) })}
                                                        label={intl.formatMessage({ id: 'StartParameter' })}
                                                    />
                                                    <HuayunButton
                                                        disabled={!currentArgs[index]}
                                                        size='small'
                                                        type="primary"
                                                        icon="icon-add"
                                                        onClick={() => this.handleClickInputAddBtn(`runVar.args`, 'currentArgs', index)} />
                                                </div>
                                                <div className='labelList'>
                                                    {
                                                        args && args.map((item, index_) => {
                                                            return (
                                                                <TagItem
                                                                    size='medium'
                                                                    key={item}
                                                                    name={item}
                                                                    icon="error"
                                                                    onClick={() => this.handleRemoveFormDataItem(`containers.${index}.runVar.args`, index_)}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </Panel>
                                            {/* 启动命令 */}
                                            <Panel
                                                form={form}
                                                value={command}
                                                name={`ContainerConfig${index}RunVarCommand`}
                                                label={intl.formatMessage({ id: 'StartCommand' })}
                                                inline
                                                className='labelPanel'
                                            >
                                                <div className='inputWithAddBtn'>
                                                    <Input
                                                        form={form}
                                                        name={`ContainerConfig${index}RunVarCurrentCommand`}
                                                        value={currentCommand[index]}
                                                        onChange={(val) => this.handleStateOnChange('currentCommand', index, val)}
                                                        placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'StartCommand' }) })}
                                                        label={intl.formatMessage({ id: 'StartCommand' })}
                                                    />
                                                    <HuayunButton
                                                        disabled={!currentCommand[index]}
                                                        size='small'
                                                        type="primary"
                                                        icon="icon-add"
                                                        onClick={() => this.handleClickInputAddBtn(`runVar.command`, 'currentCommand', index)} />
                                                </div>
                                                <div className='labelList'>
                                                    {
                                                        command && command.map((item, index_) => {
                                                            return (
                                                                <TagItem
                                                                    size='medium'
                                                                    key={item}
                                                                    name={item}
                                                                    icon="error"
                                                                    onClick={() => this.handleRemoveFormDataItem(`containers.${index}.runVar.command`, index_)}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </Panel>
                                            {/* 挂载配置 */}
                                            <Panel
                                                form={form}
                                                value={mounts}
                                                name={`ContainerConfig${index}Mounts`}
                                                label={intl.formatMessage({ id: 'MountConfig' })}
                                                inline
                                                className='mountsPanel'
                                            >
                                                <HuayunButton
                                                    type="operate"
                                                    icon={<Icon type="add" />}
                                                    onClick={() => this.handleManageModal('mounts', 'add', `${index}.mounts`)}
                                                    name="添加挂载配置"
                                                    className='addBoxItemBtn'
                                                />
                                                {
                                                    mounts && mounts.map((item, index_) => {
                                                        const { type, subType, mountItem, mountPath, readOnly, subPath } = item
                                                        return (
                                                            <Card handleDelete={() => this.handleRemoveFormDataItem(`containers.${index}.mounts`, index_)} key={index_}>
                                                                <div className='commonSet'>
                                                                    <div className='keyValueBox'>
                                                                        <div className='keyValueLine'>
                                                                            <div className='lineTitle'>类型</div>
                                                                            <div className='lineValue'>{ContainerMountTypeObj[type]}</div>
                                                                        </div>
                                                                        <div className='keyValueLine'>
                                                                            <div className='lineTitle'>挂载路径</div>
                                                                            <div className='lineValue'>{mountPath}</div>
                                                                        </div>
                                                                    </div>
                                                                    <Button type='text' onClick={() => this.handleManageModal('mounts', 'update', `${index}.mounts.${index_}`)}>
                                                                        <Icon type="edit" />&nbsp;{intl.formatMessage({ id: 'Edit' })}
                                                                    </Button>
                                                                </div>
                                                                <DividerBox title={intl.formatMessage({ id: 'AdvancedSetting' })}>
                                                                    <div className='keyValueBox'>
                                                                        <div className='keyValueLine'>
                                                                            <div className='lineTitle'>是否只读</div>
                                                                            <div className='lineValue'>{readOnly ? '是' : '否'}</div>
                                                                        </div>
                                                                        <div className='keyValueLine'>
                                                                            <div className='lineTitle'>子路径</div>
                                                                            <div className='lineValue'>{subPath}</div>
                                                                        </div>
                                                                    </div>
                                                                </DividerBox>
                                                            </Card>
                                                        )
                                                    })
                                                }
                                            </Panel>
                                            {/* 环境变量 */}
                                            <Panel
                                                form={form}
                                                value={envs}
                                                name={`ContainerConfig${index}Envs`}
                                                label={intl.formatMessage({ id: 'EnvironmentVariable' })}
                                                inline
                                                className='mountsPanel'
                                            >
                                                <HuayunButton
                                                    type="operate"
                                                    icon={<Icon type="add" />}
                                                    onClick={() => this.handleManageModal('envs', 'add', `${index}.envs`)}
                                                    name="添加环境变量"
                                                    className='addBoxItemBtn'
                                                />
                                                {
                                                    envs && envs.map((item, index_) => {
                                                        const { envKey, type, envValue, selectFile, selectKey } = item
                                                        return (
                                                            <Card handleDelete={() => this.handleRemoveFormDataItem(`containers.${index}.envs`, index_)}>
                                                                <div className='commonSet'>
                                                                    <div className='keyValueBox'>
                                                                        <div className='keyValueLine'>
                                                                            <div className='lineTitle'>Key</div>
                                                                            <div className='lineValue'>{envKey}</div>
                                                                        </div>
                                                                        {
                                                                            type === 'manual' ? (
                                                                                <div className='keyValueLine'>
                                                                                    <div className='lineTitle'>Value</div>
                                                                                    <div className='value'>{envValue}</div>
                                                                                </div>
                                                                            ) : (
                                                                                <div className='keyValueLine'>
                                                                                    <div className='lineTitle'>文件/Key</div>
                                                                                    <div className='value'>{`${selectFile} | ${selectKey}`}</div>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </div>
                                                                    <Button type='text' onClick={() => this.handleManageModal('envs', 'update', `${index}.envs.${index_}`)}>
                                                                        <Icon type="edit" />&nbsp;{intl.formatMessage({ id: 'Edit' })}
                                                                    </Button>
                                                                </div>
                                                            </Card>
                                                        )
                                                    })
                                                }
                                            </Panel>
                                            {/* 健康检测 */}
                                            <Panel
                                                form={form}
                                                value={probe}
                                                name={`ContainerConfig${index}Probe`}
                                                label='健康检测'
                                                inline
                                                className='commonPanel healthyTest'
                                            >
                                                <Select
                                                    form={form}
                                                    name={`ContainerConfig${index}ProbeType`}
                                                    value={probe.type}
                                                    onChange={(val) => this.handleFormDataOnChange(`${index}.probe.type`, val)}
                                                    placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: '检测类型' })}
                                                    label='检测类型'
                                                    options={testTypeList}
                                                    optionFilterProp='children'
                                                    optionLabelProp='children'
                                                    isRequired={probe.type || probe.manner || probe.command}
                                                    validate={[{
                                                        trigger: 'onBlur',
                                                        rules: [
                                                            (rule, value, callback) => {
                                                                let isRequired = probe.manner || probe.command
                                                                if (isRequired && !value) {
                                                                    callback('请选择检测类型')
                                                                } else {
                                                                    callback()
                                                                }
                                                            }
                                                        ]
                                                    }]}
                                                    allowClear={Boolean(probe.type)}
                                                    className='w50'
                                                />
                                                <Select
                                                    form={form}
                                                    name={`ContainerConfig${index}Manner`}
                                                    value={probe.manner}
                                                    onChange={(val) => this.handleFormDataOnChange(`${index}.probe.manner`, val)}
                                                    placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: '检测方式' })}
                                                    label='检测方式'
                                                    options={testMethodList}
                                                    optionFilterProp='children'
                                                    optionLabelProp='children'
                                                    isRequired={probe.type || probe.manner || probe.command}
                                                    validate={[{
                                                        trigger: 'onBlur',
                                                        rules: [
                                                            (rule, value, callback) => {
                                                                let isRequired = probe.type || probe.command
                                                                if (isRequired && !value) {
                                                                    callback('请选择检测方式')
                                                                } else {
                                                                    callback()
                                                                }
                                                            }
                                                        ]
                                                    }]}
                                                    allowClear={Boolean(probe.manner)}
                                                    className='w50'
                                                />
                                                <Input
                                                    form={form}
                                                    name={`ContainerConfig${index}Command`}
                                                    value={probe.command}
                                                    onChange={(val) => this.handleFormDataOnChange(`${index}.probe.command`, val)}
                                                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Command' }) })}
                                                    label={intl.formatMessage({ id: 'Command' })}
                                                    validate={[{
                                                        trigger: 'onBlur',
                                                        rules: [
                                                            (rule, value, callback) => {
                                                                let isRequired = probe.type || probe.manner
                                                                if (isRequired && !value) {
                                                                    callback('请输入指令')
                                                                } else {
                                                                    callback()
                                                                }
                                                            }
                                                        ]
                                                    }]}
                                                    isRequired={probe.type || probe.manner || probe.command}
                                                />
                                                <DividerBox title={intl.formatMessage({ id: 'AdvancedSetting' })}>
                                                    <div className='advancedSetting'>
                                                        <Panel
                                                            form={form}
                                                            value={probe.initialDelaySeconds}
                                                            name={`ContainerConfig${index}ProbeInitialDelaySeconds`}
                                                            label='初始化等待'
                                                            inline
                                                            className='w50'
                                                        >
                                                            <InputNumber
                                                                form={form}
                                                                value={probe.initialDelaySeconds}
                                                                min={0}
                                                                slot={{
                                                                    position: 'right',
                                                                    format: () => '秒'
                                                                }}
                                                                type='number'
                                                                onChange={(val) => this.handleFormDataOnChange(`${index}.probe.initialDelaySeconds`, val)}
                                                            />
                                                        </Panel>
                                                        <Panel
                                                            form={form}
                                                            value={probe.periodSeconds}
                                                            name={`ContainerConfig${index}ProbePeriodSeconds`}
                                                            label='检测间隔'
                                                            inline
                                                            className='w50'
                                                        >
                                                            <InputNumber
                                                                form={form}
                                                                value={probe.periodSeconds}
                                                                min={1}
                                                                slot={{
                                                                    position: 'right',
                                                                    format: () => '秒'
                                                                }}
                                                                type='number'
                                                                onChange={(val) => this.handleFormDataOnChange(`${index}.probe.periodSeconds`, val)}
                                                            />
                                                        </Panel>
                                                        <Panel
                                                            form={form}
                                                            value={probe.timeoutSeconds}
                                                            name={`ContainerConfig${index}ProbeTimeoutSeconds`}
                                                            label='检测超时'
                                                            inline
                                                            className='w50'
                                                        >
                                                            <InputNumber
                                                                form={form}
                                                                value={probe.timeoutSeconds}
                                                                min={1}
                                                                slot={{
                                                                    position: 'right',
                                                                    format: () => '秒'
                                                                }}
                                                                type='number'
                                                                onChange={(val) => this.handleFormDataOnChange(`${index}.probe.timeoutSeconds`, val)}
                                                            />
                                                        </Panel>
                                                        <Panel
                                                            form={form}
                                                            value={probe.failureThreshold}
                                                            name={`ContainerConfig${index}ProbeFailureThreshold`}
                                                            label='失败时重复'
                                                            inline
                                                            className='w50'
                                                        >
                                                            <InputNumber
                                                                form={form}
                                                                value={probe.failureThreshold}
                                                                min={1}
                                                                slot={{
                                                                    position: 'right',
                                                                    format: () => '秒'
                                                                }}
                                                                type='number'
                                                                onChange={(val) => this.handleFormDataOnChange(`${index}.probe.failureThreshold`, val)}
                                                            />
                                                        </Panel>
                                                    </div>
                                                </DividerBox>
                                            </Panel>
                                            {/* 端口 */}
                                            <Panel
                                                form={form}
                                                value={ports}
                                                name={`ContainerConfig${index}Ports`}
                                                label={intl.formatMessage({ id: 'Port' })}
                                                inline
                                                className='mountsPanel'
                                            >
                                                <HuayunButton
                                                    type="operate"
                                                    icon={<Icon type="add" />}
                                                    onClick={() => this.handleManageModal('ports', 'add', `${index}.ports`)}
                                                    name="添加端口"
                                                    className='addBoxItemBtn'
                                                />
                                                {
                                                    ports && ports.map((item, index_) => {
                                                        const { name, protocol, port } = item
                                                        return (
                                                            <Card handleDelete={() => this.handleRemoveFormDataItem(`containers.${index}.ports`, index_)}>
                                                                <div className='commonSet'>
                                                                    <div className='keyValueBox vertical'>
                                                                        <div className='keyValueLine'>
                                                                            <div className='lineTitle'>{intl.formatMessage({ id: 'Name' })}</div>
                                                                            <div className='lineKey'>{name}</div>
                                                                        </div>
                                                                        <div className='keyValueLine'>
                                                                            <div className='lineTitle'>协议</div>
                                                                            <div className='lineKey'>{protocol}</div>
                                                                        </div>
                                                                        <div className='keyValueLine'>
                                                                            <div className='lineTitle'>{intl.formatMessage({ id: 'ContainerPort' })}</div>
                                                                            <div className='lineKey'>{port}</div>
                                                                        </div>
                                                                    </div>
                                                                    <Button type='text' onClick={() => this.handleManageModal('ports', 'update', `${index}.ports.${index_}`)}>
                                                                        <Icon type="edit" />&nbsp;{intl.formatMessage({ id: 'Edit' })}
                                                                    </Button>
                                                                </div>
                                                            </Card>
                                                        )
                                                    })
                                                }
                                            </Panel>
                                            {/* 特权模式 */}
                                            <Panel
                                                form={form}
                                                value={privileged}
                                                name={`ContainerConfig${index}Privileged`}
                                                label={intl.formatMessage({ id: 'PrivilegedMode' })}
                                                inline
                                                className='switchPanel'
                                            >
                                                <Switch checked={privileged} onChange={() => this.handleFormDataOnChange(`${index}.runVar.privileged`, !privileged)}></Switch>
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
                    onClick={this.handleAddContainer}
                    name="添加容器"
                    className='addBoxItemBtn'
                />
                {/* 挂载配置modal */}
                <Modal
                    title={mountsParams.type === 'update' ? '编辑挂载配置' : '添加挂载配置'}
                    visible={mountsParams.visible}
                    onOk={this.handleConfirmManageMountConfig}
                    onCancel={() => this.handleCancelModal('mounts')}
                    className='ManageContainerModalItem'
                    destroyOnClose={true}
                >
                    <OperateMountConfig
                        intl={intl}
                        formData={formData}
                        handleFormChange={handleFormChange}
                        currentMountConfig={currentMountConfig}
                        wrappedComponentRef={node => this.$OperateMountConfig = node} />
                </Modal>
                {/* 环境变量modal */}
                <Modal
                    title={envsParams.type === 'update' ? '编辑环境变量' : '添加环境变量'}
                    visible={envsParams.visible}
                    onOk={this.handleConfirmManageEnvs}
                    onCancel={() => this.handleCancelModal('envs')}
                    className='ManageContainerModalItem'
                    destroyOnClose={true}
                >
                    <OperateEnvs
                        intl={intl}
                        formData={formData}
                        handleFormChange={handleFormChange}
                        currentEnvs={currentEnvs}
                        wrappedComponentRef={node => this.$OperateEnvs = node} />
                </Modal>
                {/* 端口modal */}
                <Modal
                    title={portsParams.type === 'update' ? '编辑端口' : '添加端口'}
                    visible={portsParams.visible}
                    onOk={this.handleConfirmManagePorts}
                    onCancel={() => this.handleCancelModal('ports')}
                    className='ManageContainerModalItem'
                    destroyOnClose={true}
                >
                    <OperatePorts
                        intl={intl}
                        formData={formData}
                        handleFormChange={handleFormChange}
                        currentPorts={currentPorts}
                        wrappedComponentRef={node => this.$OperatePorts = node} />
                </Modal>
            </div>
        )
    }
}

export default ContainerConfig
