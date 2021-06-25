/* eslint-disable */
import React from 'react'
import { RcForm, Loading, Row, Col, Icon, Notification, Dialog, TagItem } from 'ultraui'
import { Modal } from 'huayunui'
import './index.less'
import Regex from '~/utils/regex'
import { applicationStore as api, application } from '~/http/api'
import HuayunRequest from '~/http/request'
import ManagePackageVersion from './managePackageVersion'
import MultiLineMessage from '~/components/MultiLineMessage'

const notification = Notification.newInstance()
const { FormGroup, Form, Input, Button, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
class AppStoreManageApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            applicationPackageId: '', // 选中的应用包
            tagInput: '', // 标签的输入值
            packageVersionsAll: [], // 应用包所有的版本信息
            selectedAppPackageVersions: [], // 选中的应用包的版本列表
            applicationPackageVersionIds: [],
            name: '', // 名称
            description: '', // 描述
            tags: [], // 标签
            projectId: '',
            projectList: [], // 项目列表
            appPackageList: [], // 应用包列表
            isShelfManageModalVisible: false, // 管理上家版本modal
        }
    }

    componentDidMount() {
        this.getProjectList()
        this.props.match.params.id && this.getDetail()
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
                const { description, name, tags, id, applicationPackageId, applicationPackageVersionIds, packageVersionsSelected: selectedAppPackageVersions, packageVersionsAll, projectId } = res.data
                this.setState({
                    description,
                    name,
                    tags: tags || [],
                    id,
                    applicationPackageId,
                    applicationPackageVersionIds: applicationPackageVersionIds || [],
                    selectedAppPackageVersions: selectedAppPackageVersions || [],
                    packageVersionsAll,
                    projectId
                }, () => {
                    this.getAppPackageListByProjectId(projectId)
                })
            }
        })
    }

    handleSubmit = () => {
        const { match: { params: { id } }, history, intl } = this.props
        const { applicationPackageId, name, description, tags, applicationPackageVersionIds, projectId } = this.state
        const params = {
            id, applicationPackageId, name, description, tags, applicationPackageVersionIds, projectId
        }
        const url = id ? 'update' : 'create'
        const content = intl.formatMessage({ id: id ? 'Update' : 'Create' }) + intl.formatMessage({ id: 'AppStore' })
        HuayunRequest(api[url], params, {
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
    handleShelfManageModalConfirm = () => {
        const { applicationPackageVersions, applicationPackageVersionIds } = this.$ManagePackageVersion.state
        const selectedAppPackageVersions = applicationPackageVersions.filter(item => {
            return applicationPackageVersionIds.indexOf(item.id) !== -1
        })
        this.setState({
            applicationPackageVersionIds, 
            selectedAppPackageVersions, // 渲染被选中的版本需要整个版本数据
            isShelfManageModalVisible: false
        })
    }
    render() {
        const { form, intl, match: { params: { id } } } = this.props
        const { tagInput, name, description, tags, applicationPackageId, applicationPackageVersionIds, selectedAppPackageVersions, projectId, 
            projectList, appPackageList, isShelfManageModalVisible, packageVersionsAll } = this.state
        return (
            <div id="AppStoreAppManage">
                <Form
                    ref={(node) => { this.form = node }}
                    form={form}
                    style={{ paddingRight: '0' }}
                    className="m-b-lg create_step"
                    onSubmit={this.handleSubmit}
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
                                disabled={!!id}
                            />
                            <Input
                                form={form}
                                name='name'
                                value={name}
                                onChange={this.handleChange.bind(this, 'name')}
                                label={intl.formatMessage({ id: 'AppName' })}
                                placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'AppName' }) })}
                                validRegex={Regex.isName}
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
                            <Panel
                                form={form}
                                name='applicationPackageVersionIds'
                                value={applicationPackageVersionIds}
                                label={intl.formatMessage({ id: 'Shelf Version' })}
                                // errorMsg={errorRoleIdsMsg}
                                // isRequired
                                inline
                            >
                                <div className="versionTable">
                                    <div className="tableHeader">
                                        <div className="versionName">{intl.formatMessage({ id: 'Name' })}</div>
                                        <div className="versionNum">{intl.formatMessage({ id: 'Index of versions' })}</div>
                                    </div>
                                    {
                                        selectedAppPackageVersions.map(item => {
                                            return (
                                                <div className="tableRow" key={item.id}>
                                                    <div className="versionName">{item.name}</div>
                                                    <div className="versionNum">{item.packageVersion}</div>
                                                </div>
                                            )
                                        })
                                    }
                                    <Button
                                        type='default'
                                        name={intl.formatMessage({ id: '::Manage' })}
                                        onClick={() => this.handleChange('isShelfManageModalVisible', true)}
                                        className="manageVersionBtn"
                                        disabled={!applicationPackageId}
                                    />
                                </div>
                            </Panel>
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
                                />
                            </FormGroup>
                        </div>
                    </FormRow>
                </Form>
                <Modal
                    title={intl.formatMessage({ id: 'ShelfManagement' })}
                    visible={isShelfManageModalVisible}
                    onOk={this.handleShelfManageModalConfirm}
                    onCancel={() => this.handleChange('isShelfManageModalVisible', false)}
                    className='version_dialog'
                    destroyOnClose={true}
                >
                    <ManagePackageVersion
                        intl={intl}
                        id={id}
                        applicationPackageId={applicationPackageId}
                        applicationPackageVersionIds={applicationPackageVersionIds}
                        packageVersionsAll={packageVersionsAll}
                        ref={node => this.$ManagePackageVersion = node} />
                </Modal>
            </div>
        )
    }
}

export default RcForm.create()(AppStoreManageApp)
