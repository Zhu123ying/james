/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog } from 'ultraui'
import { Collapse } from 'huayunui'
import MultiLineMessage from '~/components/MultiLineMessage'
import Regex from '~/utils/regex'
import './index.less'
import HuayunRequest from '~/http/request'
import { container as api, application } from '~/http/api'
import ContainerGroupConfig from './containerGroupConfig' // 容器组管理
import ContainerConfig from './containerConfig'  // 容器管理
import NetworkConfig from './networkConfig'  // 网络管理
import ConfigFileManage from './configFileManage' // 配置文件管理
import PersistentStorageManage from './persistentStorageManage' // 持久存储管理
import LogPersistence from './logPersistence' // 持久存储管理
import AffinityConfig from './affinityConfig'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select } = RcForm
const notification = Notification.newInstance()
const _ = window._

const navigationBarItems = ['ContainerGroupConfig', 'ContainerConfig', 'AffinityConfig', 'NetworkConfig', 'LogPersistence', 'AlarmConfig']
class ManageContainerItem extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        const { match: { params: { id } }, intl } = props
        this.id = id
        this.state = {
            currentBarType: navigationBarItems[0],
            formData: {
                name: '',
                description: '',
                labels: [],
                projectId: '',
                restartPolicy: '', // 重启策略
                resource: {    // 资源组配额
                    cpu: 1000,
                    memory: 1024,
                    ephemeralStorage: 10
                },
                containers: [], // 容器配置
                configurations: [], // 配置文件
                storages: [], // 持久存储
                networkState: true, // 这个是前端自己加的字段，为true的时候要传network对象，为false不用传或者传{}
                network: { // 容器网络
                    containerNetworks: [],
                    nodeNetworks: [], // 节点网络
                    loadBalanceNetwork: { // 负载均衡
                        name: '',
                        ports: [], // 端口
                        qos: true,
                        upstream: 0, // 上行
                        downstream: 0 // 下行
                    }
                },
                affinity: {            // 亲和性
                    nodeAffinity: {
                        prefers: [
                            {
                                weight: '',
                                matchFields: [],
                                matchExpressions: []
                            }
                        ],
                        require: {
                            matchTerms: [
                                {
                                    matchFields: [],
                                    matchExpressions: []
                                }
                            ]
                        }
                    },
                    platformContainerAffinity: {
                        prefers: [
                            {
                                weight: '',
                                namespaces: [],
                                topologyKey: '',
                                matchLabels: [
                                    {
                                        labelKey: '',
                                        labelValue: []
                                    }
                                ],
                                matchExpressions: [
                                    {
                                        key: '',
                                        operator: '',
                                        values: []
                                    }
                                ]
                            }
                        ],
                        requires: [
                            {
                                namespaces: [],
                                topologyKey: '',
                                matchLabels: [
                                    {
                                        labelKey: '',
                                        labelValue: []
                                    }
                                ],
                                matchExpressions: [
                                    {
                                        key: '',
                                        operator: '',
                                        values: []
                                    }
                                ]
                            }
                        ]
                    },
                    platformContainerAntiAffinity: {
                        prefers: [
                            {
                                weight: '',
                                namespaces: [],
                                topologyKey: '',
                                matchLabels: [
                                    {
                                        labelKey: '',
                                        labelValue: []
                                    }
                                ],
                                matchExpressions: [
                                    {
                                        key: '',
                                        operator: '',
                                        values: []
                                    }
                                ]
                            }
                        ],
                        requires: [
                            {
                                namespaces: [],
                                topologyKey: '',
                                matchLabels: [
                                    {
                                        labelKey: '',
                                        labelValue: []
                                    }
                                ],
                                matchExpressions: [
                                    {
                                        key: '',
                                        operator: '',
                                        values: []
                                    }
                                ]
                            }
                        ]
                    }
                }
            },
            containerImageList: [],
            isFetching: false,
            projectList: [], // 项目列表
        }
    }
    componentDidMount() {
        this.getProjectList()
        this.props.handleExtra({
            style: {
                display: 'none'
            },
        })
    }
    componentWillUnmount() {
        this.props.handleExtra({
            style: {
                display: 'block'
            }
        })
    }
    // 获取项目列表
    getProjectList = () => {
        let params = {
            pageNumber: 1,
            pageSize: 10000
        }
        HuayunRequest(application.listProject, params, {
            success: (res) => {
                this.setState({
                    projectList: res.data
                })
            }
        })
    }
    // 获取容器镜像下拉数据
    getImageData = (projectId) => {
        if (!projectId) {
            return
        }
        HuayunRequest(application.getContainerImageArtifactList, { projectId }, {
            success: (res) => {
                this.setState({
                    containerImageList: res.data
                })
            }
        })
    }
    getDetail = () => {
        // 获取详情数据
        HuayunRequest(api.detail, { id: this.id }, {
            success: (res) => {

            }
        })
    }
    // 用于handleChange的切换
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    // 因为form表单的几个组件之间有相互关联，所以将formData作为prop传递
    handleFormChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        let { formData } = this.state
        formData[key] = value
        this.setState({
            formData: { ...formData }
        }, () => {
            if (key === 'projectId') {
                this.getImageData(value)
            }
            console.log(this.state.formData)
        })
    }
    handleSubmit = () => {
        const { form, history, intl } = this.props
        const { formData } = this.state
    }
    handleCancel = () => {
        this.props.history.push('/applicationCenter/containerManage')
    }
    renderFormComponent = (type) => {
        const { intl, form } = this.props
        const { projectList, formData, containerImageList } = this.state
        switch (type) {
            case 'ContainerGroupConfig':
                return <ContainerGroupConfig
                    intl={intl}
                    form={form}
                    formData={formData}
                    handleFormChange={this.handleFormChange}
                    projectList={projectList}
                    ref={node => this.$ContainerGroupConfig = node} />
                break
            case 'ContainerConfig':
                return <ContainerConfig
                    intl={intl}
                    form={form}
                    formData={formData}
                    handleFormChange={this.handleFormChange}
                    ref={node => this.$ContainerConfig = node}
                    containerImageList={containerImageList} />
                break
            case 'NetworkConfig':
                return <NetworkConfig
                    intl={intl}
                    form={form}
                    formData={formData}
                    handleFormChange={this.handleFormChange}
                    ref={node => this.$NetworkConfig = node} />
                break
            case 'LogPersistence':
                return <LogPersistence
                    intl={intl}
                    form={form}
                    formData={formData}
                    handleFormChange={this.handleFormChange}
                    ref={node => this.$LogPersistence = node} />
                break
            case 'AffinityConfig':
                return <AffinityConfig
                    intl={intl}
                    form={form}
                    formData={formData}
                    handleFormChange={this.handleFormChange}
                    ref={node => this.$AffinityConfig = node} />
                break
        }
    }
    render() {
        const { form, intl } = this.props
        const { isFetching, currentBarType, formData } = this.state
        return (
            <div id="ManageContainerItem">
                {
                    isFetching ? <Loading /> : (
                        <Form
                            ref={(node) => { this.form = node }}
                            form={form}
                            style={{ paddingRight: '0' }}
                            className="m-b-lg create_step"
                            subMessage
                        >
                            <div className='left'>
                                {
                                    navigationBarItems.map(item => {
                                        return (
                                            <div className={`barItem ${currentBarType === item ? 'activeType activeBefore' : ''}`} key={item} onClick={() => this.handleChange('currentBarType', item)}>{intl.formatMessage({ id: item })}</div>
                                        )
                                    })
                                }
                            </div>
                            <div className='middle'>
                                <div className='title'>{intl.formatMessage({ id: currentBarType })}</div>
                                <div className='body'>
                                    {
                                        this.renderFormComponent(currentBarType)
                                    }
                                </div>
                            </div>
                            <div className='right'>
                                <ConfigFileManage
                                    intl={intl}
                                    form={form}
                                    formData={formData}
                                    handleFormChange={this.handleFormChange}
                                />
                                <PersistentStorageManage
                                    intl={intl}
                                    form={form}
                                    formData={formData}
                                    handleFormChange={this.handleFormChange} />
                            </div>
                        </Form>
                    )
                }
            </div>
        )
    }
}


export default RcForm.create()(ManageContainerItem)
