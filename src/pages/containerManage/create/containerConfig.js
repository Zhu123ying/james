/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber, Icon } from 'ultraui'
import { Collapse, Button as HuayunButton } from 'huayunui'
import Regex from '~/utils/regex'
import './index.less'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
const pullStrategyList = ['Always', 'IfNotPresent', 'Never']
class ContainerConfig extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {

    }
    renderPanelHeader = (index) => {
        const { intl } = this.props
        return (
            <div className='panelHeader'>
                <div className='panelTitle'>{`${intl.formatMessage({ id: 'Container' })}${index + 1}`}</div>
                <Button type='text' onClick={() => this.handleDeleteContainer(index)}>
                    <Icon type="empty" />&nbsp;{intl.formatMessage({ id: 'Delete' })}
                </Button>
            </div>
        )
    }
    handleDeleteContainer = (index) => {
        let { handleFormChange, formData: { containers } } = this.props
        containers.splice(index, 1)
        handleFormChange('containers', [...containers])
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
        }
        handleFormChange('containers', [...containers, containerItem])
    }
    handleOnChange = (key, val, index) => {
        let { handleFormChange, formData: { containers } } = this.props
        const value = _.get(val, 'target.value', val)
        containers[index][key] = value
        handleFormChange('containers', [...containers])
    }
    render() {
        const { form, intl, formData: { containers }, handleFormChange } = this.props
        return (
            <div className='ContainerConfig'>
                {
                    containers.length ? (
                        <Collapse defaultActiveKey={[0]}>
                            {
                                containers.map((item, index) => {
                                    const { name } = item
                                    return (
                                        <Collapse.Panel header={this.renderPanelHeader(index)} key={index}>
                                            <Input
                                                form={form}
                                                name={`containers${index}Name`}
                                                value={name}
                                                onChange={(val) => this.handleOnChange('name', val, index)}
                                                label={intl.formatMessage({ id: 'ContainerGroupName' })}
                                                placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'ContainerGroupName' }) })}
                                                validRegex={Regex.isName}
                                                isRequired
                                            />
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
            </div>
        )
    }
}

export default ContainerConfig
