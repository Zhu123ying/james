/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Notification, Loading, RcForm, Button, ButtonGroup } from 'ultraui'
import ReactDiffViewer from 'react-diff-viewer'
import { versionDetailKeyObject } from '~/pages/utils'
import { applicationPackage as api } from '~/http/api'
import HuayunRequest from '~/http/request'
// 不同类型的应用的applicationPackageId
const applicationPackageVersionKey = {
    COMMON: 'applicationPackageId', // 普通的，正常流程创建的
    APPSTORE: 'applicationPackageStoreId' // 应用商城创建的
}
// 不同类型的应用的applicationPackageId获取版本列表的接口
const packageVersionListUrl = {
    COMMON: 'getApplicationPackageVersionsForApplication', // 普通的，正常流程创建的
    APPSTORE: 'versionStoreList' // 应用商城创建的
}
const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._

class UpdateApplication extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props)
        const { detail: { configInfo, applicationVersionId } } = props
        this.state = {
            chartValuesType: 1,
            oldConfigInfo: configInfo, // 未修改过的chartValues
            configInfo: configInfo, // 修改过的chartValues
            versionId: applicationVersionId, // 选择的版本id
            applicationVersionList: [], // 应用版本列表
            isCoverApplicationGateway: 'true', // 是否覆盖应用包入口
        }
    }

    componentDidMount() {
        this.getAppVersionList()
    }

    getAppVersionList = () => {
        const { detail } = this.props
        const { applicationType } = detail
        const applicationPackageVersion = _.get(detail, versionDetailKeyObject[applicationType], {}) || {}
        const applicationPackageId = _.get(applicationPackageVersion, applicationPackageVersionKey[applicationType], '')
        HuayunRequest(api[packageVersionListUrl[applicationType]], { applicationPackageId }, {
            success: (res) => {
                this.setState({
                    applicationVersionList: res.data
                })
            }
        })
    }

    handleOnChange = (key, val, item) => {
        const { detail: { configInfo, applicationVersionId } } = this.props
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        }, () => {
            if (key === 'versionId') {
                // 如果选择的是当前版本，那么configInfo要去应用详情里的configInfo
                this.setState({
                    oldConfigInfo: value === applicationVersionId ? configInfo : item.props.configInfo,
                    configInfo: value === applicationVersionId ? configInfo : item.props.configInfo,
                    chartValuesType: 1 // buton类型要切换到values
                })
            }
        })
    }

    render() {
        const { intl, detail: { applicationVersionId }, form } = this.props
        const { versionId, oldConfigInfo, configInfo, chartValuesType, applicationVersionList, isCoverApplicationGateway } = this.state
        return (
            <Form form={form}>
                <Select
                    form={form}
                    name='versionId'
                    onChange={this.handleOnChange.bind(this, 'versionId')}
                    optionLabelProp="children"
                    value={versionId}
                    label={intl.formatMessage({ id: 'ApplicationVersion' })}
                    isRequired
                    options={
                        applicationVersionList.map((item, index) => {
                            return {
                                value: item.id,
                                text: `${item.name} - ${item.packageVersion}${item.id === applicationVersionId ? ` (${intl.formatMessage({ id: 'CurrentVersion' })})` : ''}`,
                                configInfo: item.chartValues
                            }
                        })
                    }
                    optionFilterProp='children'
                    optionLabelProp='children'
                />
                {
                    <div className='codeDiff'>
                        <ButtonGroup className='btnGroup'>
                            <Button type="primary" name="Values(YAML)" onClick={this.handleOnChange.bind(this, 'chartValuesType', 1)} />
                            <Button type="warning" name="Diff" onClick={this.handleOnChange.bind(this, 'chartValuesType', 2)} />
                        </ButtonGroup>
                        {
                            chartValuesType == 1 ? (
                                <RcForm.Textarea
                                    className='newChartValuesInput'
                                    form={form}
                                    value={configInfo}
                                    name='configInfo'
                                    onChange={this.handleOnChange.bind(this, 'configInfo')}
                                    label=''
                                    maxLength={NaN}
                                />
                            ) : (
                                    <ReactDiffViewer
                                        className='diffView'
                                        hideLineNumbers={true}
                                        oldValue={oldConfigInfo}
                                        newValue={configInfo}
                                        splitView={false}
                                    />
                                )
                        }
                    </div>
                }
                <RadioGroup
                    form={form}
                    name="isCoverApplicationGateway"
                    label={intl.formatMessage({ id: 'isCoverApplicationGateway' })}
                    items={[
                        { title: '是', value: 'true' },
                        { title: '否', value: 'false' }
                    ]}
                    value={isCoverApplicationGateway}
                    onChange={(val) => this.handleOnChange('isCoverApplicationGateway', val)}
                    inline
                />
            </Form>
        )
    }
}

export default RcForm.create()(UpdateApplication)
