/* eslint-disable */
import React from 'react'
import { RcForm, Loading, Row, Col, Icon, Notification, Tooltip, Dialog } from 'ultraui'
import { Button } from 'huayunui'
import './index.less'
import Upload from 'rc-upload'
import Regex from '~/utils/regex'
import HuayunRequest, { HuayunUploadRequest } from '~/http/request'
import { applicationPackage as api, application } from '~/http/api'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Panel, Select } = RcForm
const _ = window._
const notification = Notification.newInstance()
const createVersionTypeList = [
    { value: '0', text: '空白Chart包并修改' },
    { value: '1', text: '上传Chart包并修改' },
    { value: '2', text: '复制Chart包并修改' },
]
class CreateVersion extends React.Component {
    constructor(props) {
        super(props)
        const { applicationPackageId } = props
        this.state = {
            applicationPackageId,
            name: '',
            description: '',
            chart: null, // 上传的chart包
            souceAppPackageVersionId: '', // 复制的应用包版本id
            souceApplicationPackageId: '', // 复制的应用包id
            createType: '0', // 创建版本的方式
            uploadChartErrorMessage: '', // 上传文件的错误提示
            appPackageList: [], // 应用包列表
            appPackageVersionList: [], // 应用包的版本列表
        }
    }

    componentDidMount() {
        this.getAppPackageList()
    }

    // 获取应用包列表
    getAppPackageList = () => {
        const { projectId } = this.props
        HuayunRequest(api.getAllApplicationPackageInfo, { projectId }, {
            success: (res) => {
                this.setState({
                    appPackageList: res.data
                })
            }
        })
    }

    getAppPackageVersionList = (applicationPackageId) => {
        HuayunRequest(api.getApplicationPackageVersionsByPackageId, { applicationPackageId }, {
            success: (res) => {
                this.setState({
                    appPackageVersionList: res.data
                })
            }
        })
    }

    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        }, () => {
            // 切换类型先重置state
            if (key === 'createType') {
                this.setState({
                    chart: null, // 上传的chart包
                    souceAppPackageVersionId: '', // 复制的应用包版本id
                    souceApplicationPackageId: '', // 复制的应用包id
                    uploadChartErrorMessage: '', // 上传的错误信息
                })
            }
            if (key === 'souceApplicationPackageId') {
                this.getAppPackageVersionList(value)
                this.setState({
                    souceAppPackageVersionId: ''
                })
            }
        })
    }

    handleChoseFile = (file) => {
        this.setState({
            chart: file,
            uploadChartErrorMessage: '' // 选择了文件，则将错误提示置空
        })
        return false
    }


    handleSubmit = () => {
        const { createType } = this.state
        switch (createType) {
            case '0':
                this.handleSubmitCreateVersion()
                break
            case '1':
                this.handleSubmitCreateVersionByUpload()
                break
            case '2':
                this.handleSubmitCreateVersionByCopy()
                break
        }
    }
    handleSubmitCreateVersion = () => {
        const { form, intl } = this.props
        const { applicationPackageId, name, description } = this.state
        form.validateFields((errs, values) => {
            if (!errs) {
                let params = {
                    applicationPackageId, name, description
                }
                HuayunRequest(api.createApplicationPackageVersion, params, {
                    success: (res) => {
                        this.showSubmitResult()
                    }
                })
            }
        })
    }

    handleSubmitCreateVersionByUpload = () => {
        const { form, intl } = this.props
        const { applicationPackageId, name, description, chart } = this.state
        let uploadChartErrorMessage = chart ? '' : `ChartValues ${intl.formatMessage({ id: 'Required' })}`
        this.setState({
            uploadChartErrorMessage
        })
        form.validateFields((errs, values) => {
            if (!errs && !uploadChartErrorMessage) {
                let params = {
                    applicationPackageId, name, description, Chart: chart,
                }
                let formData = new FormData()
                Object.keys(params).forEach(key => {
                    formData.append(key, params[key])
                })
                HuayunUploadRequest(api.createApplicationPackageVersionByUpload, formData, {
                    success: (res) => {
                        this.showSubmitResult()
                    }
                })
            }
        })
    }

    handleSubmitCreateVersionByCopy = () => {
        const { form, intl } = this.props
        const { applicationPackageId, name, description, souceApplicationPackageId, souceAppPackageVersionId } = this.state
        form.validateFields((errs, values) => {
            if (!errs) {
                let params = {
                    applicationPackageId, name, description, souceApplicationPackageId, souceAppPackageVersionId
                }
                HuayunRequest(api.createApplicationPackageVersionByCopy, params, {
                    success: (res) => {
                        this.showSubmitResult()
                    }
                })
            }
        })
    }

    showSubmitResult = () => {
        const { intl, hanleResponseStatus } = this.props
        notification.notice({
            id: new Date(),
            type: 'success',
            title: intl.formatMessage({ id: 'Success' }),
            content: `${intl.formatMessage({ id: 'CreateAppPackageVersion' })}${intl.formatMessage({ id: 'Success' })}`,
            iconNode: 'icon-success-o',
            duration: 5,
            closable: true
        })
        hanleResponseStatus()
    }

    render() {
        const { form, intl } = this.props
        const { name, description, chart, souceAppPackageVersionId, souceApplicationPackageId, createType, uploadChartErrorMessage, appPackageList, appPackageVersionList } = this.state

        return (
            <div id="createVersionForm">
                <Form
                    ref={(node) => { this.form = node }}
                    form={form}
                    style={{ paddingRight: '0' }}
                    className="m-b-lg create_step"
                    subMessage
                >
                    <Input
                        form={form}
                        name='name'
                        value={name}
                        onChange={this.handleChange.bind(this, 'name')}
                        label={intl.formatMessage({ id: 'VersionName' })}
                        placeholder={intl.formatMessage({ id: 'VersionNamePlaceHolder' })}
                        validRegex={/^[\A-Za-z0-9_-]{2,20}$/}
                        invalidMessage={intl.formatMessage({ id: 'VersionNamePlaceHolder' })}
                        isRequired
                    />
                    <Textarea
                        form={form}
                        name='description'
                        value={description}
                        onChange={this.handleChange.bind(this, 'description')}
                        label={intl.formatMessage({ id: 'VersionDescription' })}
                        minLength={0}
                        maxLength={200}
                    />
                    <Select
                        form={form}
                        name="createType"
                        value={createType}
                        onChange={this.handleChange.bind(this, 'createType')}
                        label={intl.formatMessage({ id: 'CreateType' })}
                        isRequired
                        options={
                            createVersionTypeList.map(({ value, text }) => {
                                return {
                                    value, text
                                }
                            })
                        }
                        optionFilterProp='children'
                        optionLabelProp='children'
                    />
                    {
                        createType === '1' ? (
                            <Panel
                                form={form}
                                value={chart}
                                name="chart"
                                className="uploadChart"
                                label={intl.formatMessage({ id: 'Helm_UploadFile' })}
                                inline
                                isRequired
                                errorMsg={uploadChartErrorMessage}
                            >
                                <Upload
                                    accept=".gz,.tgz"
                                    beforeUpload={this.handleChoseFile}
                                >
                                    <Button
                                        type='operate'
                                        name='选择文件'
                                        icon={<Icon type="attachment" />}
                                    />

                                    <span className="chartName">
                                        {chart && chart.name ? (
                                            <>
                                                <Icon type='correct-o' />&nbsp;{chart.name}
                                            </>
                                        ) : '(空)'}
                                    </span>
                                </Upload>
                            </Panel>
                        ) : null
                    }
                    {
                        createType === '2' ? (
                            <React.Fragment>
                                <Select
                                    form={form}
                                    name="souceApplicationPackageId"
                                    value={souceApplicationPackageId}
                                    placeholder={intl.formatMessage({ id: 'SelectAppPackage' })}
                                    onChange={this.handleChange.bind(this, 'souceApplicationPackageId')}
                                    label={intl.formatMessage({ id: 'AppPackage' })}
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
                                    isRequired
                                />
                                <Select
                                    form={form}
                                    name="souceAppPackageVersionId"
                                    value={souceAppPackageVersionId}
                                    onChange={this.handleChange.bind(this, 'souceAppPackageVersionId')}
                                    label={intl.formatMessage({ id: 'AppPackageVersion' })}
                                    options={
                                        appPackageVersionList.map(item => {
                                            return {
                                                value: item.id,
                                                text: item.name
                                            }
                                        })
                                    }
                                    optionFilterProp='children'
                                    optionLabelProp='children'
                                    isRequired
                                />
                            </React.Fragment>
                        ) : null
                    }
                </Form>
            </div>
        )
    }
}

export default RcForm.create()(CreateVersion)
