/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, KeyValue, Dialog } from 'ultraui'
import { Collapse, Button } from 'huayunui'
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
import AlarmConfig from './AlarmConfig'
import { containerConfig_containerItem, affinityConfigInitData, networkInitData } from './constant'
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
        const { match: { params: { id, type } }, intl } = props
        this.id = id
        this.createType = type  // 创建的类型，复制或者是空白创建
        this.state = {
            currentBarType: navigationBarItems[0],
            formData: {
                name: '',
                description: '',
                labels: {},
                projectId: '',
                restartPolicy: '', // 重启策略
                resource: {    // 资源组配额
                    cpu: 1000,
                    memory: 1024,
                    ephemeralStorage: 10
                },
                qos: {
                    egress: 0,
                    ingress: 0
                }, 
                containers: [],
                affinity: null,
                network: null,
                alert: {
                    enabled: false,
                },
                // containers: [{ ...containerConfig_containerItem }], // 容器
                // affinity: { ...affinityConfigInitData }, // 亲和性
                // network: { ...networkInitData }, // 网络配置
                // alert: {
                //     template: '',
                //     enabled: true,
                //     users: []
                // },
                configurations: [], // 配置文件
                storages: [], // 持久存储
            },
            containerImageList: [],
            isFetching: false,
            projectList: [], // 项目列表
            alertUserList: [], // 告警联系人
            alertTemplateList: [], // 告警模板
            storageClassList: [], // 持久存储类型
        }
    }
    componentDidMount() {
        this.getProjectList()
        this.getAlertUserList()
        this.getAlertTemplateList()
        this.getStorageClasses()
        this.props.handleExtra({
            style: {
                display: 'none'
            },
        })
        this.id && this.getDetail()
    }
    componentWillUnmount() {
        this.props.handleExtra({
            style: {
                display: 'block'
            }
        })
    }
    getDetail = () => {
        const { intl } = this.props
        HuayunRequest(api.detail, { id: this.id }, {
            success: (res) => {
                const data = res.data
                if (this.createType === '1') {
                    delete data['id']
                }
                this.setState({
                    formData: data
                })
            }
        })
    }
    // 获取持久存储类型
    getStorageClasses = () => {
        HuayunRequest(api.listStorageClasses, {}, {
            success: (res) => {
                this.setState({
                    storageClassList: res.data.storageClasses
                })
            }
        })
    }
    // 获取告警联系人
    getAlertUserList = () => {
        HuayunRequest(api.listAlertUsers, {}, {
            success: (res) => {
                this.setState({
                    alertUserList: res.data.users
                })
            }
        })
    }
    // 获取告警模板
    getAlertTemplateList = () => {
        HuayunRequest(api.listAlertTemplates, {}, {
            success: (res) => {
                this.setState({
                    alertTemplateList: res.data.templates
                })
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
    handleCanelSubmit = () => {
        this.props.history.push('/applicationCenter/containerManage')
    }
    handleConfirmSubmit = () => {
        const { intl } = this.props
        this.props.form.validateFields((error, values) => {
            if (error) {
                return
            }
            const { formData } = this.state
            HuayunRequest(api[formData.id ? 'update' : 'create'], formData, {
                success: (res) => {
                    notification.notice({
                        id: new Date(),
                        type: 'success',
                        title: intl.formatMessage({ id: 'Success' }),
                        content: `${intl.formatMessage({ id: 'Operate' })}${intl.formatMessage({ id: 'Success' })}`,
                        iconNode: 'icon-success-o',
                        duration: 5,
                        closable: true
                    })
                    this.handleCanelSubmit()
                }
            })
        })
    }
    render() {
        const { form, intl } = this.props
        const { isFetching, currentBarType, projectList, formData, containerImageList, alertTemplateList, alertUserList, storageClassList } = this.state
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
                                    <div style={{ display: currentBarType === 'ContainerGroupConfig' ? 'block' : 'none' }}>
                                        <ContainerGroupConfig
                                            intl={intl}
                                            form={form}
                                            formData={formData}
                                            handleFormChange={this.handleFormChange}
                                            projectList={projectList}
                                            ref={node => this.$ContainerGroupConfig = node} />
                                    </div>
                                    <div style={{ display: currentBarType === 'ContainerConfig' ? 'block' : 'none' }}>
                                        <ContainerConfig
                                            intl={intl}
                                            form={form}
                                            formData={formData}
                                            handleFormChange={this.handleFormChange}
                                            ref={node => this.$ContainerConfig = node}
                                            containerImageList={containerImageList} />
                                    </div>
                                    <div style={{ display: currentBarType === 'NetworkConfig' ? 'block' : 'none' }}>
                                        <NetworkConfig
                                            intl={intl}
                                            form={form}
                                            formData={formData}
                                            handleFormChange={this.handleFormChange}
                                            ref={node => this.$NetworkConfig = node} />
                                    </div>
                                    {/* <div style={{ display: currentBarType === 'LogPersistence' ? 'block' : 'none' }}>
                                        <LogPersistence
                                            intl={intl}
                                            form={form}
                                            formData={formData}
                                            handleFormChange={this.handleFormChange}
                                            ref={node => this.$LogPersistence = node} />
                                    </div> */}
                                    <div style={{ display: currentBarType === 'AffinityConfig' ? 'block' : 'none' }}>
                                        <AffinityConfig
                                            intl={intl}
                                            form={form}
                                            formData={formData}
                                            handleFormChange={this.handleFormChange}
                                            ref={node => this.$AffinityConfig = node} />
                                    </div>
                                    <div style={{ display: currentBarType === 'AlarmConfig' ? 'block' : 'none' }}>
                                        <AlarmConfig
                                            intl={intl}
                                            form={form}
                                            formData={formData}
                                            handleFormChange={this.handleFormChange}
                                            alertTemplateList={alertTemplateList}
                                            alertUserList={alertUserList}
                                            ref={node => this.$AlarmConfig = node} />
                                    </div>
                                </div>
                                <div className='btnGroup'>
                                    <Button type="default" name="取消" onClick={this.handleCanelSubmit} />&nbsp;&nbsp;
                                    <Button type="primary" name="确定" onClick={this.handleConfirmSubmit} />
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
                                    storageClassList={storageClassList}
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
