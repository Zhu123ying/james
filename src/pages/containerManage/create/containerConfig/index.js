/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber, Icon, Switch } from 'ultraui'
import { Collapse, Button as HuayunButton, Modal } from 'huayunui'
import { Cascader } from 'antd';
import Regex from '~/utils/regex'
import '../index.less'
import Card from '~/components/Card'
import DividerBox from '~/components/DividerBox'
import OperateMountConfig from './operateMountConfig'
import OperateEnvs from './operateEnvs'
import OperatePorts from './operatePorts'

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
class ContainerConfig extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }
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
    renderPanelHeader = (index) => {
        const { intl } = this.props
        return (
            <div className='panelHeader'>
                <div className='panelTitle'>{`${intl.formatMessage({ id: 'Container' })}${index + 1}`}</div>
                <Button type='text' onClick={() => this.handleRemoveFormDataItem('containers', index)}>
                    <Icon type="empty" />&nbsp;{intl.formatMessage({ id: 'Delete' })}
                </Button>
            </div>
        )
    }
    handleAddContainer = () => {
        const { handleFormChange, formData: { containers } } = this.props
        const containerItem = {
            name: '',
            type: '',
            image: {   // 镜像
                project: '',
                repo: '',
                tag: '',
                pullStrategy: ''
            },
            runVar: {
                workDir: '', // 工作目录
                command: [], // 启动命令
                args: [], // 启动参数
                privileged: '', // 特权
            },
            envs: [], // 环境变量
            probe: {  // 健康检测
                type: '', // Liveness只有这个选项
                manner: '', // exec只有这个选项
                command: '', // 指令
                initialDelaySeconds: 0, // 初始化等待
                periodSeconds: 0, // 检测间隔
                timeoutSeconds: 0, // 检测超时
                failureThreshold: 0 // 失败重复
            }, // 监看检测
            ports: [], // 端口
            mounts: [], // 挂载
        }
        handleFormChange('containers', [...containers, containerItem])
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
        const { envKey, type, envValue, SelectFile, SelectKey } = this.$OperateEnvs.state
        this.$OperateEnvs.props.form.validateFields((error, values) => {
            if (!error) {
                if (envs.type === 'add') {
                    let arr = _.get(containers, envs.path, [])
                    arr.push({
                        envKey, type, envValue, SelectFile, SelectKey
                    })
                } else {
                    _.set(containers, envs.path, { envKey, type, envValue, SelectFile, SelectKey })
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
                    containers.length ? (
                        <Collapse defaultActiveKey={[0]}>
                            {
                                containers.map((item, index) => {
                                    const { name, type, image, runVar, mounts, envs, probe, ports } = item
                                    const { project, repo, tag, pullStrategy } = image
                                    const { workDir, command, privileged, args } = runVar
                                    return (
                                        <Collapse.Panel header={this.renderPanelHeader(index)} key={index}>
                                            <Input
                                                form={form}
                                                name={`containers${index}Name`}
                                                value={name}
                                                onChange={(val) => this.handleFormDataOnChange(`${index}.name`, val)}
                                                label={intl.formatMessage({ id: 'ContainerName' })}
                                                placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'ContainerName' }) })}
                                                validRegex={Regex.isName}
                                                isRequired
                                            />
                                            <Select
                                                form={form}
                                                name={`containers${index}Type`}
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
                                                name={`containers${index}Image`}
                                                label={intl.formatMessage({ id: 'ContainerImage' })}
                                                inline
                                                isRequired
                                            >
                                                <Cascader
                                                    fieldNames={{ label: 'name', value: 'id' }}
                                                    allowClear={false}
                                                    options={containerImageList}
                                                    onChange={(val) => this.handleCascaderOnChange(`${index}.image`, val)}
                                                    placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'ContainerImage' }) })}
                                                />
                                            </Panel>
                                            <Select
                                                form={form}
                                                name={`containers${index}ImagePullStrategy`}
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
                                                name={`containers${index}RunVarWorkDir`}
                                                value={workDir}
                                                onChange={(val) => this.handleFormDataOnChange(`${index}.runVar.workDir`, val)}
                                                label={intl.formatMessage({ id: 'WorkingDirectory' })}
                                                placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'WorkingDirectory' }) })}
                                                isRequired
                                            />
                                            {/* 启动参数 */}
                                            <Panel
                                                form={form}
                                                value={args}
                                                name={`containers${index}RunVarArgs`}
                                                label={intl.formatMessage({ id: 'StartParameter' })}
                                                inline
                                                isRequired
                                                className='labelPanel'
                                            >
                                                <div className='inputWithAddBtn'>
                                                    <Input
                                                        form={form}
                                                        name={`containers${index}RunVarCurrentArgs`}
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
                                                        args.map((item, index_) => {
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
                                                name={`containers${index}RunVarCommand`}
                                                label={intl.formatMessage({ id: 'StartCommand' })}
                                                inline
                                                isRequired
                                                className='labelPanel'
                                            >
                                                <div className='inputWithAddBtn'>
                                                    <Input
                                                        form={form}
                                                        name={`containers${index}RunVarCurrentCommand`}
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
                                                        command.map((item, index_) => {
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
                                                name={`containers${index}Mounts`}
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
                                                    mounts.map((item, index_) => {
                                                        const { type, subType, mountItem, mountPath, readOnly, subPath } = item
                                                        return (
                                                            <Card handleDelete={() => this.handleRemoveFormDataItem(`containers.${index}.mounts`, index_)}>
                                                                <div className='commonSet'>
                                                                    <div className='keyValueBox'>
                                                                        <div className='keyValueLine'>
                                                                            <div className='lineTitle'>类型</div>
                                                                            <div className='lineValue'>{type}</div>
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
                                                                            <div className='lineTitle'>环境变量定义子路径</div>
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
                                                name={`containers${index}Envs`}
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
                                                    envs.map((item, index_) => {
                                                        const { envKey, type, envValue, SelectFile, SelectKey } = item
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
                                                                                    <div className='value'>{`${SelectFile} | ${SelectKey}`}</div>
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
                                                name={`containers${index}Probe`}
                                                label='健康检测'
                                                inline
                                                isRequired
                                                className='commonPanel healthyTest'
                                            >
                                                <Select
                                                    form={form}
                                                    name={`containers${index}ProbeType`}
                                                    value={probe.type}
                                                    onChange={(val) => this.handleFormDataOnChange(`${index}.probe.type`, val)}
                                                    placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: '检测类型' })}
                                                    label='检测类型'
                                                    options={testTypeList}
                                                    optionFilterProp='children'
                                                    optionLabelProp='children'
                                                    isRequired
                                                    className='w50'
                                                />
                                                <Select
                                                    form={form}
                                                    name={`containers${index}Manner`}
                                                    value={probe.manner}
                                                    onChange={(val) => this.handleFormDataOnChange(`${index}.probe.manner`, val)}
                                                    placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: '检测方式' })}
                                                    label='检测方式'
                                                    options={testMethodList}
                                                    optionFilterProp='children'
                                                    optionLabelProp='children'
                                                    isRequired
                                                    className='w50'
                                                />
                                                <Input
                                                    form={form}
                                                    name={`containers${index}Command`}
                                                    value={probe.command}
                                                    onChange={(val) => this.handleFormDataOnChange(`${index}.probe.command`, val)}
                                                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Command' }) })}
                                                    label={intl.formatMessage({ id: 'Command' })}
                                                    isRequired
                                                />
                                                <DividerBox title={intl.formatMessage({ id: 'AdvancedSetting' })}>
                                                    <div className='advancedSetting'>
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
                                                            className='w50'
                                                            label='初始化等待'
                                                        />
                                                        <InputNumber
                                                            form={form}
                                                            value={probe.periodSeconds}
                                                            min={0}
                                                            slot={{
                                                                position: 'right',
                                                                format: () => '秒'
                                                            }}
                                                            type='number'
                                                            onChange={(val) => this.handleFormDataOnChange(`${index}.probe.periodSeconds`, val)}
                                                            className='w50'
                                                            label='检测间隔'
                                                        />
                                                        <InputNumber
                                                            form={form}
                                                            value={probe.timeoutSeconds}
                                                            min={0}
                                                            slot={{
                                                                position: 'right',
                                                                format: () => '秒'
                                                            }}
                                                            type='number'
                                                            onChange={(val) => this.handleFormDataOnChange(`${index}.probe.timeoutSeconds`, val)}
                                                            className='w50'
                                                            label='检测超时'
                                                        />
                                                        <InputNumber
                                                            form={form}
                                                            value={probe.failureThreshold}
                                                            min={0}
                                                            slot={{
                                                                position: 'right',
                                                                format: () => '次'
                                                            }}
                                                            type='number'
                                                            onChange={(val) => this.handleFormDataOnChange(`${index}.probe.failureThreshold`, val)}
                                                            className='w50'
                                                            label='失败时重复'
                                                        />
                                                    </div>
                                                </DividerBox>
                                            </Panel>
                                            {/* 端口 */}
                                            <Panel
                                                form={form}
                                                value={ports}
                                                name={`containers${index}Ports`}
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
                                                    ports.map((item, index_) => {
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
                                                name={`containers${index}Privileged`}
                                                label={intl.formatMessage({ id: 'PrivilegedMode' })}
                                                inline
                                                isRequired
                                                className='switchPanel'
                                            >
                                                <Switch onChange={() => this.handleFormDataOnChange(`${index}.runVar.privileged`, !privileged)}></Switch>
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
                    getContainer={document.getElementById('ManageContainerItem')}
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
                    getContainer={document.getElementById('ManageContainerItem')}
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
                    getContainer={document.getElementById('ManageContainerItem')}
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
