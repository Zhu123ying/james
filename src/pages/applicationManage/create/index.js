/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, KeyValue, Dialog, TagItem, InputNumber } from 'ultraui'
import { Collapse, Button, ButtonGroup } from 'huayunui'
import ReactDiffViewer from 'react-diff-viewer'
import Regex from '~/utils/regex'
import './index.less'
import HuayunRequest from '~/http/request'
import { application, quota, applicationPackage, applicationStore } from '~/http/api'
import { GetQueryString, queryParamsToObject } from '~/utils/url'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const notification = Notification.newInstance()
const _ = window._
const navigationBarItems = ['BasicInfo', 'ApplicationQuota']
class CreateApplication extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {
            // 表单提交的元素
            projectId: '',
            name: '',
            description: '',
            tags: [],
            cCPU: 0,
            cMemory: 0,
            cEphemeralStorage: 0,
            cStorage: 0,
            applicationPackageId: '',
            applicationVersionId: '',
            configInfo: null, // 修改过的chartValues
            isolation: 'true', // 允许外部访问
            // 表单提交的元素
            tagInput: '',
            currentConfigInfo: '', // 当前选中的版本的configInfo
            chartValuesType: 1, // 显示chartValues的类型
            appPackageList: [], // 应用包列表
            appPackageVersionList: [], // 应用包版本列表
            projectList: [], // 项目列表
            availableQuota: {}, // 可用配额
            recommandQuota: {}, // 建议配额
            isFetching: false,
            currentBarType: navigationBarItems[0],
        }
    }
    componentDidMount() {
        this.handleComeFromByDiffPage()
        this.getProjectList()
    }
    // 处理从不同路径进入到创建应用
    handleComeFromByDiffPage = () => {
        // 如果是从应用商店进来的，则需要获取默认值
        const { id, applicationPackageId, applicationPackageVersionId } = queryParamsToObject(this.props.location.search)
        if (id) {
            // 从应用商店进入的
            this.handleToCreateAppFromAppStore(id, applicationPackageVersionId)
        } else if (applicationPackageId) {
            // 从应用包进入的
            this.getAppPackageDetail(applicationPackageId, applicationPackageVersionId)
        }
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
    getAppPackageDetail = (id, applicationPackageVersionId) => {
        HuayunRequest(applicationPackage.getApplicationPackageForApplication, { id, applicationPackageVersionId }, {
            success: (res) => {
                const { name, applicationPackageVersionList: appPackageVersionList, packageVersionPojo: currentVersion, projectId } = res.data
                // 应用包可能没有版本列表数据
                const { chartValues, id: applicationVersionId, applicationPackageId } = currentVersion
                this.setState({
                    appPackageList: [{
                        id, name
                    }],
                    appPackageVersionList,
                    currentConfigInfo: applicationVersionId ? chartValues : '',
                    configInfo: chartValues,
                    projectId,
                    applicationPackageId,
                    applicationVersionId,
                })
            }
        })
    }
    getAppPackageList = (projectId) => {
        HuayunRequest(applicationStore.appPackageList, { projectId }, {
            success: (res) => {
                this.setState({
                    appPackageList: res.data
                })
            }
        })
    }
    handleToCreateAppFromAppStore = (id, applicationPackageVersionId) => {
        HuayunRequest(application.getDetailByAppStoreId, { id, applicationPackageVersionId }, {
            success: (res) => {
                const { name, applicationPackageVersionStoreList: appPackageVersionList, packageVersionPojo: currentVersion } = res.data
                // 应用包可能没有版本列表数据
                const { chartValues, id: applicationVersionId, applicationPackageStoreId } = currentVersion
                this.setState({
                    appPackageList: [{
                        id, name
                    }],
                    appPackageVersionList,
                    currentConfigInfo: applicationVersionId ? chartValues : '',
                    configInfo: chartValues,
                    applicationPackageId: applicationPackageStoreId,
                    applicationVersionId,
                })
            }
        })
    }
    // 获取建议配额
    getRecommandQuotaData = () => {
        const { applicationVersionId, configInfo } = this.state
        const params = {
            applicationType: GetQueryString('id') ? 'APPSTORE' : 'COMMON',
            applicationVersionId,
            configInfo
        }
        HuayunRequest(application.queryApplicationNeedQuato, params, {
            success: (res) => {
                this.setState({
                    recommandQuota: res.data
                })
            }
        })
    }
    // 获取可用配额
    getAvailableQuota = (projectId) => {
        HuayunRequest(application.getAvailableQuota, { projectId }, {
            success: (res) => {
                this.setState({
                    availableQuota: res.data
                })
            }
        })
    }
    handleChange = (key, val, item) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        }, () => {
            if (key === 'projectId') {
                this.getAppPackageList(value)
                this.getAvailableQuota(value)
                this.setState({
                    applicationPackageId: '',
                    applicationVersionId: '',
                    appPackageVersionList: [],
                    currentConfigInfo: '',
                    recommandQuota: {}
                })
            }
            if (key === 'applicationPackageId') {
                this.setState({
                    applicationVersionId: '',
                    currentConfigInfo: '',
                    recommandQuota: {}
                })
                this.getAppPackageVersionList()
            }
            if (key === 'applicationVersionId' && item) {
                const { chartValues } = item.props
                this.setState({
                    currentConfigInfo: chartValues,
                    configInfo: chartValues,
                    chartValuesType: 1
                })
            }
        })
    }
    handleChartValuesChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    handleAddTag = () => {
        const { tagInput, tags } = this.state
        this.setState({
            tags: [...tags, tagInput],
            tagInput: ''
        })
    }
    handleDeleteTag = (index) => {
        const { tags } = this.state
        tags.splice(index, 1)
        this.setState({
            tags
        })
    }
    handleSubmit = () => {
        const { form, history, intl } = this.props
        const { cCPU, cMemory, cEphemeralStorage, cStorage, applicationVersionId, description, name, tags, configInfo, projectId, isolation } = this.state
        // 创建应用, storageInfo需要如下的格式
        // storageInfo = {
        //     big: { total: 0 }
        // }
        form.validateFields((errs, values) => {
            if (!errs) {
                let data = {
                    applicationVersionId,
                    description,
                    name,
                    tags,
                    quota: {
                        cCPU,
                        cMemory,
                        storageInfo: {
                            cEphemeralStorage: { total: parseInt(cEphemeralStorage) },
                            cStorage: { total: parseInt(cStorage) }
                        }
                    },
                    configInfo,
                    projectId,
                    isolation: isolation === 'true' ? true : false
                }
                let content = `${intl.formatMessage({ id: 'Create' })}${intl.formatMessage({ id: 'Application' })}`
                let urlType = GetQueryString('id') ? 'createStoreApplication' : 'create'
                HuayunRequest(application[urlType], data, {
                    success: (res) => {
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${content}${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                        this.handleCancel()
                    }
                })
            }
        })
    }
    handleCancel = () => {
        this.props.history.push('/applicationCenter/applicationManage')
    }
    handleChangeStep = (index) => {
        if (index) {
            this.props.form.validateFields(['name', 'projectId', 'applicationPackageId', 'applicationVersionId'], (error, values) => {
                if (!error) {
                    this.setState({
                        currentBarType: navigationBarItems[index]
                    })
                    // 进入到第二部要获取建议配额
                    this.getRecommandQuotaData()
                }
            })
        } else {
            this.setState({
                currentBarType: navigationBarItems[index]
            })
        }
    }
    getAppPackageVersionList = () => {
        HuayunRequest(applicationPackage.getApplicationPackageVersionsForApplication, { applicationPackageId: this.state.applicationPackageId }, {
            success: (res) => {
                this.setState({
                    appPackageVersionList: res.data
                })
            }
        })
    }
    renderQuotaPanel = ({ title, recommand, available, key, value, uni }) => {
        const { intl, form } = this.props
        const keyValueData = [
            {
                label: intl.formatMessage({ id: 'RecommandQuota' }),
                value: <div className='mt8'>{recommand || 0}</div>
            },
            {
                label: intl.formatMessage({ id: 'QuotaParams' }),
                value: (
                    <InputNumber
                        form={form}
                        value={value}
                        min={0}
                        slot={{
                            position: 'right',
                            format: () => uni
                        }}
                        type='number'
                        onChange={(val) => this.handleChange(key, val)}
                    />
                )
            },
            {
                label: intl.formatMessage({ id: 'Available Quota' }),
                value: <div className='mt8'>{available || 0}</div>
            },
        ]
        return (
            <Panel
                form={form}
                value={value}
                name={`${title}Panel`}
                label={title}
                inline
                isRequired
                className='quotaPanel'
                key={title}
            >
                <div className='panelContent'>
                    <KeyValue values={keyValueData} />
                </div>
            </Panel>
        )
    }
    render() {
        const { form, intl } = this.props
        const {
            name, description, tags, tagInput, applicationPackageId, applicationVersionId, cCPU, cMemory, cEphemeralStorage, cStorage, configInfo, projectId, isolation,
            chartValuesType, appPackageList, appPackageVersionList, projectList, availableQuota, recommandQuota, storageConfig, isFetching, currentBarType, currentConfigInfo
        } = this.state
        const cpu_min = _.get(recommandQuota, 'cpu', 0)
        const memory_min = _.get(recommandQuota, 'memory', 0)
        const cEphemeralStorage_min = _.get(recommandQuota, 'eStorage', 0)
        const cStorage_min = _.get(recommandQuota, 'storage', 0)
        const searchParams = queryParamsToObject(this.props.location.search)
        const { availableStorageQuota, cCPU: cpuAvailable, cMemory: memoryAvailable } = availableQuota
        const cEphemeralStorageAvailable = _.get(availableStorageQuota, 'cEphemeralStorage', 0)
        const cStorageAvailable = _.get(availableStorageQuota, 'cStorage', 0)
        const quotaPanelData = [
            { title: 'CPU', recommand: cpu_min, available: cpuAvailable, key: 'cCPU', value: cCPU, uni: 'm' },
            { title: '内存', recommand: memory_min, available: memoryAvailable, key: 'cMemory', value: cMemory, uni: 'Mi' },
            { title: '临时存储', recommand: cEphemeralStorage_min, available: cEphemeralStorageAvailable, key: 'cEphemeralStorage', value: cEphemeralStorage, uni: 'Gi' },
            { title: '持久存储', recommand: cStorage_min, available: cStorageAvailable, key: 'cStorage', value: cStorage, uni: 'Gi' }
        ]
        return (
            <div id="ManageApplication">
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
                                            <div className={`barItem ${currentBarType === item ? 'activeType activeBefore' : ''}`} key={item} >{intl.formatMessage({ id: item })}</div>
                                        )
                                    })
                                }
                            </div>
                            <div className='middle'>
                                <Collapse activeKey={currentBarType} >
                                    <Collapse.Panel key='BasicInfo' header={intl.formatMessage({ id: 'BasicInfo' })}>
                                        <Select
                                            form={form}
                                            name="projectId"
                                            value={projectId}
                                            placeholder={intl.formatMessage({ id: 'SelectProjectPlaceHolder' })}
                                            onChange={this.handleChange.bind(this, 'projectId')}
                                            label={intl.formatMessage({ id: 'ProjectBelongTo' })}
                                            isRequired
                                            options={
                                                projectList.map(item => {
                                                    return {
                                                        value: item.id,
                                                        text: item.name,
                                                    }
                                                })
                                            }
                                            optionFilterProp='children'
                                            optionLabelProp='children'
                                            disabled={searchParams.applicationPackageId} // 应用包和应用编辑的时候，项目不能修改
                                        />
                                        <Input
                                            form={form}
                                            name='name'
                                            value={name}
                                            onChange={this.handleChange.bind(this, 'name')}
                                            label={intl.formatMessage({ id: 'AppName' })}
                                            validRegex={Regex.isName}
                                            invalidMessage={intl.formatMessage({ id: 'NameErrorMsg' })}
                                            isRequired
                                        />
                                        <Textarea
                                            form={form}
                                            value={description}
                                            name='description'
                                            onChange={this.handleChange.bind(this, 'description')}
                                            label={intl.formatMessage({ id: 'AppDescription' })}
                                            minLength={0}
                                            maxLength={200}
                                        />
                                        <Panel
                                            form={form}
                                            value={tags}
                                            name="tags"
                                            label={intl.formatMessage({ id: 'Tag' })}
                                            inline
                                            className='labelPanel'
                                        >
                                            <div className='labelLine'>
                                                <Input
                                                    form={form}
                                                    name='tagInput'
                                                    value={tagInput}
                                                    onChange={(val) => this.handleChange('tagInput', val)}
                                                    label=''
                                                />
                                                <Button
                                                    disabled={!tagInput}
                                                    size='small'
                                                    type="primary"
                                                    icon="icon-add"
                                                    onClick={this.handleAddTag} />
                                            </div>
                                            <div className='labelList'>
                                                {
                                                    tags.map((item, index) => {
                                                        return (
                                                            <TagItem
                                                                size='medium'
                                                                key={item}
                                                                name={item}
                                                                icon="error"
                                                                onClick={() => this.handleDeleteTag(index)}
                                                            />
                                                        )
                                                    })
                                                }
                                            </div>
                                        </Panel>
                                        <Panel
                                            form={form}
                                            value={applicationPackageId}
                                            name='applicationPackagePanel'
                                            label={intl.formatMessage({ id: 'AppPackage' })}
                                            inline
                                            isRequired
                                            className='appPackagePanel'
                                        >
                                            <Select
                                                form={form}
                                                name="applicationPackageId"
                                                value={applicationPackageId}
                                                onChange={this.handleChange.bind(this, 'applicationPackageId')}
                                                label='选择应用包'
                                                isRequired
                                                options={
                                                    appPackageList.map(item => {
                                                        return {
                                                            value: item.id,
                                                            text: item.name,
                                                        }
                                                    })
                                                }
                                                optionFilterProp='children'
                                                optionLabelProp='children'
                                                showSearch
                                                disabled={!appPackageList.length}
                                            />
                                            <Select
                                                form={form}
                                                name="applicationVersionId"
                                                value={applicationVersionId}
                                                label='选择版本'
                                                onChange={this.handleChange.bind(this, 'applicationVersionId')}
                                                isRequired
                                                options={
                                                    appPackageVersionList.map(item => {
                                                        return {
                                                            value: item.id,
                                                            text: (
                                                                <div className="appPackageVersionItem">
                                                                    <div className="circle" />
                                                                    <span className="versionName">{item.name}</span>
                                                                </div>
                                                            ),
                                                            chartValues: item.chartValues
                                                        }
                                                    })
                                                }
                                                optionFilterProp='children'
                                                optionLabelProp='children'
                                                showSearch
                                                disabled={!appPackageVersionList.length}
                                            />
                                            {
                                                applicationVersionId ? (
                                                    <div className='codeDiff'>
                                                        <ButtonGroup>
                                                            <Button type="default" name="Values(YAML)" onClick={this.handleChartValuesChange.bind(this, 'chartValuesType', 1)} />
                                                            <Button type="warning" name="Diff" onClick={this.handleChartValuesChange.bind(this, 'chartValuesType', 2)} />
                                                        </ButtonGroup>
                                                        {
                                                            chartValuesType == 1 ? (
                                                                <Textarea
                                                                    className='newChartValuesInput'
                                                                    form={form}
                                                                    value={configInfo}
                                                                    name='configInfo'
                                                                    onChange={this.handleChange.bind(this, 'configInfo')}
                                                                    label=''
                                                                    maxLength={NaN}
                                                                />
                                                            ) : (
                                                                <ReactDiffViewer
                                                                    className='diffView'
                                                                    hideLineNumbers={true}
                                                                    oldValue={currentConfigInfo}
                                                                    newValue={configInfo}
                                                                    splitView={false}
                                                                />
                                                            )
                                                        }
                                                    </div>
                                                ) : null
                                            }
                                        </Panel>
                                    </Collapse.Panel>
                                    <Collapse.Panel key='ApplicationQuota' header={intl.formatMessage({ id: 'ApplicationQuota' })}>
                                        {
                                            quotaPanelData.map(item => {
                                                return this.renderQuotaPanel(item)
                                            })
                                        }
                                        <RadioGroup
                                            form={form}
                                            name="isolation"
                                            label={intl.formatMessage({ id: 'IsAllowOutSideVisit' })}
                                            items={[
                                                { title: '是', value: 'true' },
                                                { title: '否', value: 'false' }
                                            ]}
                                            value={isolation}
                                            onChange={(val) => this.handleChange('isolation', val)}
                                            inline
                                        />
                                    </Collapse.Panel>
                                </Collapse>
                                <div className='btnGroup'>
                                    {
                                        currentBarType === navigationBarItems[0] ? (
                                            <>
                                                <Button type="warning" name="取消" onClick={this.handleCancel} />&nbsp;&nbsp;
                                                <Button type="primary" name="下一步" onClick={() => this.handleChangeStep(1)} />
                                            </>
                                        ) : (
                                            <>
                                                <Button type="warning" name="取消" onClick={this.handleCancel} />&nbsp;&nbsp;
                                                <Button type="default" name="上一步" onClick={() => this.handleChangeStep(0)} />&nbsp;&nbsp;
                                                <Button type="primary" name="创建" onClick={this.handleSubmit} />
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </Form>
                    )
                }
            </div>
        )
    }
}

export default RcForm.create()(CreateApplication)
