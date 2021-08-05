/* eslint-disable */
import React from 'react'
import { RcForm, Loading, Row, Col, Icon, Notification, Dialog, TagItem } from 'ultraui'
import { Modal, Table } from 'huayunui'
import './index.less'
import Regex from '~/utils/regex'
import { applicationStore as api, application } from '~/http/api'
import HuayunRequest from '~/http/request'
import MultiLineMessage from '~/components/MultiLineMessage'

const notification = Notification.newInstance()
const { FormGroup, Form, Input, Button, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
class AppStoreManageApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            projectId: '',
            projectList: [], // 项目列表
            applicationPackageId: '', // 选中的应用包
            appPackageList: [], // 应用包列表
            name: '', // 名称
            description: '', // 描述
            tags: [], // 标签
            tagInput: '', // 标签的输入值
            packageVersionsAll: [], // 应用包所有的版本信息
            onShelfVersionIds: [], // 以上架的版本id(多选)
            unShelfVersionIds: [], // 未上架的版本id(单选，也先定义为数组吧)
            isSubmitting: false, // 是否正在提交
        }
    }
    componentDidMount() {
        const { match: { params: { id } } } = this.props
        this.getProjectList()
        id && this.getDetail()
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
    getAppPackageListByProjectId = (projectId) => {
        // 获取详情数据
        HuayunRequest(api.appPackageList, { projectId }, {
            success: (res) => {
                this.setState({
                    appPackageList: res.data
                })
            }
        })
    }
    getDetail = () => {
        const { match: { params: { id } } } = this.props
        // 获取详情数据
        HuayunRequest(api.manageDetail, { id }, {
            success: (res) => {
                const { description, name, tags, id, applicationPackageId, applicationPackageVersionIds, packageVersionsAll, projectId } = res.data
                this.setState({
                    description,
                    name,
                    tags: tags || [],
                    id,
                    applicationPackageId,
                    onShelfVersionIds: applicationPackageVersionIds || [], // 已上架的版本默认都选中
                    packageVersionsAll,
                    projectId
                }, () => {
                    this.getAppPackageListByProjectId(projectId)
                })
            }
        })
    }
    getAppPackageVersionDetail = () => {
        // 获取应用包的版本列表信息
        const { applicationPackageId } = this.state
        HuayunRequest(api.appPackageVersionDetail, { applicationPackageId }, {
            success: (res) => {
                this.setState({
                    packageVersionsAll: res.data
                })
            }
        })
    }
    handleSubmit = () => {
        const { match: { params: { id } }, history, intl } = this.props
        const { applicationPackageId, name, description, tags, onShelfVersionIds, unShelfVersionIds, projectId } = this.state
        const params = {
            id, applicationPackageId, name, description, tags, projectId,
            applicationPackageVersionIds: [...onShelfVersionIds, ...unShelfVersionIds]
        }
        const url = id ? 'update' : 'create'
        const content = intl.formatMessage({ id: id ? 'Update' : 'Create' }) + intl.formatMessage({ id: 'AppStore' })
        this.setState({
            isSubmitting: true
        })
        HuayunRequest(api[url], params, {
            success: (res) => {
                const { retCode, retInfo } = res.data
                if (retCode) {
                    notification.notice({
                        id: new Date(),
                        type: 'danger',
                        title: intl.formatMessage({ id: 'Error' }),
                        content: retInfo,
                        iconNode: 'icon-error-o',
                        duration: 5,
                        closable: true
                    })
                } else {
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
            },
            complete: () => {
                this.setState({
                    isSubmitting: false
                })
            }
        })
    }
    handleCancel() {
        this.props.history.push('/applicationCenter/applicationStoreManage')
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        }, () => {
            if (key === 'projectId') {
                this.getAppPackageListByProjectId(value)
                this.setState({
                    applicationPackageId: '',
                    packageVersionsAll: [],
                    onShelfVersionIds: [],
                    unShelfVersionIds: []
                })
            }
            if (key === 'applicationPackageId') {
                this.getAppPackageVersionDetail()
                this.setState({
                    packageVersionsAll: [],
                    onShelfVersionIds: [],
                    unShelfVersionIds: []
                })
            }
        })
    }
    handleAddTag = () => {
        const { tags, tagInput } = this.state
        this.setState({
            tagInput: '',
            tags: [...tags, tagInput],
        })
    }

    deleteTag = (index) => {
        const { tags } = this.state
        tags.splice(index, 1)
        this.setState({
            tags
        })
    }
    getTableColumns = () => {
        const { intl } = this.props
        return [
            {
                title: intl.formatMessage({ id: 'Name' }),
                dataIndex: 'name',
            },
            {
                title: intl.formatMessage({ id: 'Index of versions' }),
                dataIndex: 'packageVersion'
            },
            {
                title: intl.formatMessage({ id: 'Type' }),
                dataIndex: 'isSelected',
                render(isSelected) {
                    return isSelected ? '已上架' : '未上架'
                }
            }
        ]
    }
    render() {
        const { form, intl, match: { params: { id } } } = this.props
        const { tagInput, name, description, tags, applicationPackageId, onShelfVersionIds, unShelfVersionIds, projectId,
            projectList, appPackageList, packageVersionsAll, isSubmitting } = this.state
        const onShelfSelectedVersions = packageVersionsAll.filter(item => item.isSelected)
        const unShelfSelectedVersions = packageVersionsAll.filter(item => !item.isSelected)

        return (
            <div id="AppStoreAppManage">
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
                                    {intl.formatMessage({ id: id ? 'AppStoreUpdateAppTitle' : 'AppStoreCreateAppTitle' })}
                                </h4>
                            </div>
                            <div className="details">
                                <MultiLineMessage id={id ? 'AppStoreUpdateAppDes' : 'AppStoreCreateAppDes'} />
                            </div>
                        </div>
                        <div>
                            <Select
                                form={form}
                                name="projectId"
                                value={projectId}
                                placeholder={intl.formatMessage({ id: 'SelectProjectPlaceHolder' })}
                                dropdownMenuStyle={{ maxHeight: '180px' }}
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
                                disabled={id} // 项目不能修改
                            />
                            <Select
                                form={form}
                                name="applicationPackageId"
                                label={intl.formatMessage({ id: 'AppPackage' })}
                                value={applicationPackageId}
                                onChange={this.handleChange.bind(this, 'applicationPackageId')}
                                options={appPackageList.map(({ id, name }) => {
                                    return {
                                        key: id,
                                        value: id,
                                        name
                                    }
                                })}
                                dropdownMenuStyle={{ maxHeight: '128px', overflow: 'auto' }}
                                optionFilterProp='children'
                                optionLabelProp='children'
                                isRequired
                                showSearch={true}
                                disabled={id}
                            />
                            <Input
                                form={form}
                                name='name'
                                value={name}
                                onChange={this.handleChange.bind(this, 'name')}
                                label={intl.formatMessage({ id: 'AppName' })}
                                placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'AppName' }) })}
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
                            <div className="labelList">
                                {
                                    tags.map((item, index) => {
                                        return (
                                            <TagItem
                                                size='small'
                                                key={item}
                                                name={item}
                                                icon="error"
                                                onClick={() => this.deleteTag(index)}
                                            />
                                        )
                                    })
                                }
                            </div>
                            {
                                id && onShelfSelectedVersions.length ? (
                                    <Table
                                        columns={this.getTableColumns()}
                                        dataSource={onShelfSelectedVersions}
                                        pagination={false}
                                        rowSelection={{
                                            selectedRowKeys: onShelfVersionIds,
                                            onChange: (keys, items) => this.handleChange('onShelfVersionIds', keys),
                                        }}
                                        rowKey='id'
                                    />
                                ) : null
                            }
                            <Table
                                columns={this.getTableColumns()}
                                dataSource={unShelfSelectedVersions}
                                pagination={false}
                                rowSelection={{
                                    selectedRowKeys: unShelfVersionIds,
                                    type: 'radio',
                                    onChange: (keys, items) => this.handleChange('unShelfVersionIds', keys),
                                }}
                                rowKey='id'
                            />
                            <FormGroup offset className='m-t-lg'>
                                <Button
                                    type='default'
                                    name={intl.formatMessage({ id: 'Cancel' })}
                                    onClick={this.handleCancel.bind(this)}
                                />
                                <Button
                                    type='primary'
                                    name={intl.formatMessage({ id: 'Submit' })}
                                    htmlType='submit'
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    onClick={this.handleSubmit}
                                />
                            </FormGroup>
                        </div>
                    </FormRow>
                </Form>
            </div>
        )
    }
}

export default RcForm.create()(AppStoreManageApp)
