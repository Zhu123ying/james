/* eslint-disable */
import BaseComponent from 'Page/base/BaseComponent'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { RcForm, Loading, Row, Col, Icon, Notification, Dialog } from 'ultraui'
import { MultiLineMessage } from 'BCmpt'
import './index.less'
import { clearNull } from 'Utils/tools/object'
import ManagePackageVersion from './managePackageVersion'
import Regex from 'Utils/tools/regex'
import { HANDLE_RESPONSE_STATUS } from 'Cnst/types'

const notification = Notification.newInstance()

const { FormGroup, Form, Input, Button, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm

const _ = window._

class AppStoreManageApp extends BaseComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired,
        baseFetch: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    }

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
            projectId: ''
        }
        this.baseAction = {
            app: 'appCenter',
            modelDetail: 'appStore.manageDetail',
            method: 'post',
            data: {
                id: props.match.params.id
            }
        }
    }

    componentDidMount() {
        this.getProjectList()
        this.props.match.params.id && this.getDetail()
    }

    // 获取项目列表
    getProjectList = () => {
        this.props.baseFetch('enterprise', 'listProject', 'post', { pageNumber: 1, pageSize: 10000 }, {})
    }

    getAppPackageListByProjectId = (projectId) => {
        // 获取详情数据
        this.props.baseFetch('appCenter', 'appStore.appPackageList', 'post', { projectId }, {})
    }

    getDetail = () => {
        // 获取详情数据
        this.props.baseFetch(this.baseAction.app, this.baseAction.modelDetail, this.baseAction.method, clearNull(this.baseAction.data), {}, {
            callback: (res) => {
                const { description, name, tags, id, applicationPackageId, applicationPackageVersionIds, packageVersionsSelected: selectedAppPackageVersions, packageVersionsAll, projectId } = res
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
        const { baseFetch, match: { params: { id } }, history, intl, handleResponseStatus } = this.props
        const { applicationPackageId, name, description, tags, applicationPackageVersionIds, projectId } = this.state
        const params = {
            id, applicationPackageId, name, description, tags, applicationPackageVersionIds, projectId
        }
        baseFetch('appCenter', `${id ? 'appStore.update' : 'appStore.create'}`, 'post', clearNull(params), {}, {
            callback: (res) => {
                handleResponseStatus({
                    type: HANDLE_RESPONSE_STATUS,
                    code: 200,
                    msg: {
                        success: intl.formatMessage({ id: id ? 'UpdateApplicationSuccess' : 'CreateApplicationSuccess' }, { name })
                    }
                })
                history.push('/appCenter/appStore')
            },
            onError: (res) => {
                handleResponseStatus({
                    type: HANDLE_RESPONSE_STATUS,
                    code: 200,
                    msg: {
                        error: intl.formatMessage({ id: res.code === 400 ? res.data.errorCode : 'Internal Server Error' })
                    }
                })
            }
        }) // 获取所有数据
    }

    handleReset() {
        this.props.history.goBack()
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

    handleManagePackageVersion = () => {
        const { intl, baseFetch, match: { params: { id } } } = this.props
        const { applicationPackageId, applicationPackageVersionIds, packageVersionsAll } = this.state
        this.$dialog = Dialog(
            <ManagePackageVersion
                wrappedComponentRef={versionForm => { this.$versionForm = versionForm }}
                id={id}
                applicationPackageId={applicationPackageId}
                applicationPackageVersionIds={applicationPackageVersionIds}
                packageVersionsAll={packageVersionsAll}
                intl={intl}
                baseFetch={baseFetch}
            />, {
            title: intl.formatMessage({ id: 'ShelfManagement' }),
            style: { width: '480px' },
            className: 'version_dialog',
            confirm: () => {
                let closeDialog = true
                const { applicationPackageVersions, applicationPackageVersionIds } = this.$versionForm.state
                const selectedAppPackageVersions = applicationPackageVersions.filter(item => {
                    return applicationPackageVersionIds.indexOf(item.id) !== -1
                })
                this.setState({
                    applicationPackageVersionIds, selectedAppPackageVersions
                })
                return closeDialog
            }
        })
    }

    render() {
        const { form, intl, match: { params: { id } }, listProject, listAppPackage } = this.props
        const { tagInput, name, description, tags, applicationPackageId, applicationPackageVersionIds, selectedAppPackageVersions, projectId } = this.state
        const projectList = _.get(listProject, 'data.data') || [] // 项目列表
        const appPackageList = _.get(listAppPackage, 'data.data') || [] // 项目列表

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
                                placeholder={intl.formatMessage({ id: 'NamePlaceHolder' })}
                                validRegex={Regex.isName}
                                invalidMessage={intl.formatMessage({ id: 'NamePlaceHolder' })}
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
                                addon={intl.formatMessage({ id: 'DescriptionError' })}
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
                                        onClick={this.handleManagePackageVersion.bind(this)}
                                        className="manageVersionBtn"
                                        disabled={!applicationPackageId}
                                    />
                                </div>
                            </Panel>
                            <FormGroup offset className='m-t-lg'>
                                <Button
                                    type='default'
                                    name={intl.formatMessage({ id: 'Cancel' })}
                                    onClick={this.handleReset.bind(this)}
                                />
                                <Button
                                    type='primary'
                                    name={intl.formatMessage({ id: 'OK' })}
                                    htmlType='submit'
                                />
                            </FormGroup>
                        </div>
                    </FormRow>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    listAppPackage: state.baseModel.appCenter.appStore.appPackageList.post,
    listProject: state.baseModel.enterprise.listProject.post,
})

const mapDispatchToProps = dispatch => ({
    handleResponseStatus: (responseStatus) => {
        dispatch(responseStatus)
    }
})

const CreatForm = RcForm.create()(AppStoreManageApp)
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CreatForm))
