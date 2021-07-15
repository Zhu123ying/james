/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog } from 'ultraui'
import MultiLineMessage from '~/components/MultiLineMessage'
import Regex from '~/utils/regex'
import './index.less'
import ReactDiffViewer from 'react-diff-viewer'
import { packageDetailKeyObject, formatChartValues, renderStorageConfigTooltip } from '../../utils'
import { GetQueryString, queryParamsToObject } from '~/utils/url'
import HuayunRequest from '~/http/request'
import { application, quota, applicationPackage, applicationStore } from '~/http/api'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const notification = Notification.newInstance()
const _ = window._

// 从应用包进来的带applicationPackageId和applicationVersionId
// 从应用商店进来的带应用商店应用的id，而非应用的id
class AppCreate extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        this.id = _.get(props, 'match.params.id', null) // 编辑的时候传过来的应用的id
        this.state = {
            formData: {
                projectId: '',
                name: '',
                description: '',
                tags: [],
                tagInput: '',
                cCPU: 0,
                cMemory: 0,
                cEphemeralStorage: 0,
                cStorage: 0,
                applicationPackageId: '',
                applicationVersionId: '',
                configInfo: null, // 修改过的chartValues
                isolation: 'true', // 允许外部访问
            },
            currentVersion: {}, // 选中的版本
            chartValuesType: 1, // 显示chartValues的类型
            appPackageList: [], // 应用包列表
            appPackageVersionList: [], // 应用包版本列表
            projectList: [], // 项目列表
            availableQuota: {}, // 可用配额
            isFetching: false
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
        } else if (this.id) {
            // 如果是从应用进入的
            this.getDetail()
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
                const { quota, chartValues, id: applicationVersionId, applicationPackageId } = currentVersion
                this.setState({
                    appPackageList: [{
                        id, name
                    }],
                    appPackageVersionList,
                    currentVersion: applicationVersionId ? { quota, chartValues } : {},
                    formData: {
                        ...this.state.formData,
                        configInfo: chartValues,
                        projectId,
                        applicationPackageId,
                        applicationVersionId,
                    }
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
                const { quota, chartValues, id: applicationVersionId, applicationPackageStoreId } = currentVersion
                this.setState({
                    appPackageList: [{
                        id, name
                    }],
                    appPackageVersionList,
                    currentVersion: applicationVersionId ? { quota, chartValues } : {},
                    formData: {
                        ...this.state.formData,
                        configInfo: chartValues,
                        applicationPackageId: applicationPackageStoreId,
                        applicationVersionId,
                    }
                })
            }
        })
    }

    getDetail = () => {
        // 获取详情数据
        HuayunRequest(application.detail, { id: this.id }, {
            success: (res) => {
                const { id, name, description, tags, quota: { cCPU, cMemory, storageInfo: { cEphemeralStorage, cStorage } }, configInfo, applicationVersionId, projectId } = res.data
                const { applicationPackageId } = _.get(res, packageDetailKeyObject[res.applicationType], {})
                this.setState({
                    formData: {
                        ...this.state.formData,
                        id,
                        name,
                        description,
                        tags,
                        cCPU,
                        cMemory,
                        cEphemeralStorage: cEphemeralStorage.total,
                        cStorage: cStorage.total,
                        configInfo,
                        applicationVersionId,
                        applicationPackageId,
                        projectId
                    }
                })
            }
        })
    }

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
        this.setState(({ formData }) => ({
            formData: {
                ...formData,
                [`${key}`]: value
            }
        }), () => {
            if (key === 'projectId') {
                this.getAppPackageList(value)
                this.getAvailableQuota(value)
                this.setState({
                    formData: {
                        ...this.state.formData,
                        applicationPackageId: '',
                        applicationVersionId: ''
                    },
                    appPackageVersionList: [],
                })
            }
            if (key === 'applicationPackageId') {
                this.setState({
                    formData: { ...this.state.formData, applicationVersionId: '' },
                    currentVersion: {}
                })
                this.getAppPackageVersionList()
            }
            if (key === 'applicationVersionId' && item) {
                const { quota, chartValues } = item.props
                this.setState({
                    currentVersion: {
                        quota, chartValues
                    },
                    formData: { ...this.state.formData, configInfo: chartValues },
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
        const { formData } = this.state
        const { tagInput, tags } = formData
        this.setState({
            formData: {
                ...formData,
                tags: [...tags, tagInput],
                tagInput: ''
            }
        })
    }

    deleteTag = (index) => {
        const { formData } = this.state
        const { tags } = formData
        tags.splice(index, 1)
        this.setState({
            formData: {
                ...formData,
                tags
            }
        })
    }

    handleSubmit = () => {
        const { form, history, intl } = this.props
        const { formData: { id, cCPU, cMemory, cEphemeralStorage, cStorage, applicationVersionId, description, name, tags, configInfo, projectId, isolation } } = this.state
        if (id) {
            // 编辑应用
            form.validateFields(['name', 'description', 'tags'], (errs, values) => {
                if (!errs) {
                    let data = {
                        id, name, description, tags
                    }
                    let content = `${intl.formatMessage({ id: 'Update' })}${intl.formatMessage({ id: 'Application' })}`
                    HuayunRequest(application.update, data, {
                        success: (res) => {
                            notification.notice({
                                id: new Date(),
                                type: 'success',
                                title: intl.formatMessage({ id: 'Success' }),
                                content: `${content}'${intl.formatMessage({ id: 'Success' })}`,
                                iconNode: 'icon-success-o',
                                duration: 5,
                                closable: true
                            })
                            this.handleCancel()
                        }
                    })
                }
            })
        } else {
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
                                content: `${content}'${intl.formatMessage({ id: 'Success' })}`,
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
    }

    handleCancel = () => {
        this.props.history.push('/applicationCenter/applicationManage')
    }

    getAppPackageVersionList = () => {
        HuayunRequest(applicationPackage.getApplicationPackageVersionsForApplication, { applicationPackageId: this.state.formData.applicationPackageId }, {
            success: (res) => {
                this.setState({
                    appPackageVersionList: res.data
                })
            }
        })
    }

    render() {
        const { form, intl } = this.props
        const {
            formData: { name, description, tags, tagInput, applicationPackageId, applicationVersionId, cCPU, cMemory, cEphemeralStorage, cStorage, configInfo, projectId, isolation },
            currentVersion, chartValuesType, appPackageList, appPackageVersionList, projectList, availableQuota, storageConfig, isFetching
        } = this.state
        const cpu_min = _.get(currentVersion, 'quota.cpu', 0)
        const memory_min = _.get(currentVersion, 'quota.memory', 0)
        const versionStorageInfor = _.get(currentVersion, 'quota.storage', {}) || {}
        const searchParams = queryParamsToObject(this.props.location.search)
        const { availableStorageQuota, cCPU: cpuAvailable, cMemory: memoryAvailable } = availableQuota
        const cEphemeralStorageAvailable = _.get(availableStorageQuota, 'cEphemeralStorage', 0)
        const cStorageAvailable = _.get(availableStorageQuota, 'cStorage', 0)
        return (
            <div id="AppCreate">
                {
                    isFetching ? <Loading /> : (
                        <Form
                            ref={(node) => { this.form = node }}
                            form={form}
                            style={{ paddingRight: '0' }}
                            className="m-b-lg create_step"
                            subMessage
                        >
                            <FormRow mainStyle={{ paddingRight: '10%' }}>
                                <div>
                                    <div className="instance-create-heading">
                                        <h4 className="instance-div-title">
                                            {intl.formatMessage({ id: 'CreateAppTitle' })}
                                        </h4>
                                    </div>
                                    <div className="details">
                                        <MultiLineMessage id='CreateAppDes' />
                                    </div>
                                </div>
                                <div>
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
                                        disabled={searchParams.applicationPackageId || this.id} // 应用包和应用编辑的时候，项目不能修改
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
                                    // addon={intl.formatMessage({ id: 'DescriptionError' })}
                                    />
                                    <div className="tag">
                                        <Input
                                            form={form}
                                            name='tagInput'
                                            value={tagInput}
                                            onChange={this.handleChange.bind(this, 'tagInput')}
                                            label={intl.formatMessage({ id: 'AppTag' })}
                                            placeholder={intl.formatMessage({ id: 'TagPlaceHolder' })}
                                            invalidMessage={intl.formatMessage({ id: 'TagPlaceHolder' })}
                                        />
                                        <i className="iconfont icon-add" onClick={this.handleAddTag} />
                                    </div>
                                    <div className="tagList">
                                        {
                                            tags.map((item, index) => {
                                                return (
                                                    <span className="tagItem" key={item}>
                                                        {item}
                                                        <i className="iconfont icon-error" onClick={() => this.deleteTag(index)} />
                                                    </span>
                                                )
                                            })
                                        }
                                    </div>
                                    {
                                        this.id ? null : (
                                            <React.Fragment>
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
                                                <Select
                                                    form={form}
                                                    name="applicationPackageId"
                                                    value={applicationPackageId}
                                                    placeholder={intl.formatMessage({ id: 'SelectAppPackage' })}
                                                    onChange={this.handleChange.bind(this, 'applicationPackageId')}
                                                    label={intl.formatMessage({ id: 'AppPackage' })}
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
                                                    placeholder={intl.formatMessage({ id: 'SelectAppPackageVersion' })}
                                                    onChange={this.handleChange.bind(this, 'applicationVersionId')}
                                                    label={intl.formatMessage({ id: 'AppPackageVersion' })}
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
                                                                quota: item.quota,
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
                                                            <div className='btnGroup'>
                                                                <Button type="primary" name="Values(YAML)" onClick={this.handleChartValuesChange.bind(this, 'chartValuesType', 1)} />
                                                                <Button type="warning" name="Diff" onClick={this.handleChartValuesChange.bind(this, 'chartValuesType', 2)} />
                                                            </div>
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
                                                                        oldValue={currentVersion.chartValues}
                                                                        newValue={configInfo}
                                                                        splitView={false}
                                                                    />
                                                                )
                                                            }
                                                        </div>
                                                    ) : null
                                                }
                                                <div className="cpu_memory">
                                                    <div className="lineItem">
                                                        <div className="label" />
                                                        <div className="recommend">应用需求配额</div>
                                                        <div className="assign">应用分配资源</div>
                                                        <div className="available">剩余可用配额</div>
                                                    </div>
                                                    <div className="lineItem">
                                                        <div className="label">CPU</div>
                                                        <div className="recommend">{cpu_min}m</div>
                                                        <div className="assign">
                                                            <Input
                                                                form={form}
                                                                name='cCPU'
                                                                value={cCPU || ''}
                                                                onChange={this.handleChange.bind(this, 'cCPU')}
                                                                label='cCPU'
                                                                type="number"
                                                                unit="m"
                                                                isRequired
                                                            />
                                                        </div>
                                                        <div className="available">{`cCPU(m) ${cpuAvailable || 0}`}</div>
                                                    </div>
                                                    <div className="lineItem">
                                                        <div className="label">cMemory</div>
                                                        <div className="recommend">{memory_min}Mi</div>
                                                        <div className="assign">
                                                            <Input
                                                                form={form}
                                                                name='cMemory'
                                                                value={cMemory || ''}
                                                                onChange={this.handleChange.bind(this, 'cMemory')}
                                                                label='cMemory'
                                                                type="number"
                                                                unit="Mi"
                                                                isRequired
                                                            />
                                                        </div>
                                                        <div className="available">{`Memory(Mi) ${memoryAvailable || 0}`}</div>
                                                    </div>
                                                    <div className="lineItem">
                                                        <div className="label">cEphemeralStorage</div>
                                                        <div className="recommend">{versionStorageInfor.cEphemeralStorage || 0}Gi</div>
                                                        <div className="assign">
                                                            <Input
                                                                form={form}
                                                                name='cEphemeralStorage'
                                                                value={cEphemeralStorage || ''}
                                                                onChange={this.handleChange.bind(this, 'cEphemeralStorage')}
                                                                label='cEphemeralStorage'
                                                                type="number"
                                                                unit="Gi"
                                                                isRequired
                                                            />
                                                        </div>
                                                        <div className="available">{`cEphemeralStorage(Gi) ${cEphemeralStorageAvailable || 0}`}</div>
                                                    </div>
                                                    <div className="lineItem">
                                                        <div className="label">cStorage</div>
                                                        <div className="recommend">{versionStorageInfor.cStorage || 0}Gi</div>
                                                        <div className="assign">
                                                            <Input
                                                                form={form}
                                                                name='cStorage'
                                                                value={cStorage || ''}
                                                                onChange={this.handleChange.bind(this, 'cStorage')}
                                                                label='cStorage'
                                                                type="number"
                                                                unit="Gi"
                                                                isRequired
                                                            />
                                                        </div>
                                                        <div className="available">{`cStorage(Gi) ${cStorageAvailable || 0}`}</div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        )
                                    }
                                    <FormGroup offset className='m-t-lg'>
                                        <RcForm.Button
                                            type='primary'
                                            name={intl.formatMessage({ id: 'Submit' })}
                                            onClick={this.handleSubmit}
                                        />
                                        <RcForm.Button
                                            type='default'
                                            name={intl.formatMessage({ id: 'Cancel' })}
                                            onClick={this.handleCancel}
                                        />
                                    </FormGroup>
                                </div>
                            </FormRow>
                        </Form>
                    )
                }
            </div>
        )
    }
}


export default RcForm.create()(AppCreate)
