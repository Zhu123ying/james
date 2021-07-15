/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber } from 'ultraui'
import { Collapse, Button as HuayunButton } from 'huayunui'
import Regex from '~/utils/regex'
import '../index.less'
import HuayunRequest from '~/http/request'
import { application, image } from '~/http/api'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
class AddPullModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 1, // 添加拉取有两种方案，1：从外部库拉取。2：从项目库拉取, 3:公共库拉取
            //项目库从项目仓库拉取镜像
            sourceProjectId: '', // 来源项目ID(项目库从项目仓库拉取镜像)
            sourceImageId: '', // 源镜像ID(项目库从项目仓库、公共库拉取镜像)
            //项目库从外部仓库拉取镜像
            repositoryCredentialId: '', // 凭证ID(项目库从外部仓库拉取镜像)
            sourceImage: '', // 镜像来源(项目库从外部仓库拉取镜像)
            // 公用参数
            projectId: '', // 归属项目ID
            targetImage: '', // 目标镜像Repo:tag
            targetRepo: '', // 目标镜像仓库地址
            projectList: [], // 项目列表
            credentialList: [], // 凭证列表
            sourceImageList: [], // 源镜像列表
        }
    }
    componentDidMount() {
        this.getProjectList()
    }
    getImageRepositoryPath = () => {
        const { projectId } = this.state
        HuayunRequest(image.getImageRepositoryPath, { repoType: 'projectRepo', projectId }, {
            success: (res) => {
                this.setState({
                    targetRepo: res.data.repoPath
                })
            }
        })
    }
    // 获取凭证
    getCredentialList = () => {
        const { projectId, type } = this.state
        if (type !== 1) return
        HuayunRequest(image.getRepositoryCredentialListForImagePull, { repoType: 'projectRepo', projectId }, {
            success: (res) => {
                this.setState({
                    credentialList: res.data
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
    // 获取源镜像列表
    getSourceImageList = () => {
        const { sourceProjectId, type } = this.state
        let params = {
            sourceType: type === 2 ? 'projectRepo' : 'pubRepo',
            projectId: sourceProjectId
        }
        HuayunRequest(image.getImageArtifactByImageRepository, params, {
            success: (res) => {
                this.setState({
                    sourceImageList: res.data
                })
            }
        })
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        }, () => {
            // 切换类型，重置相关state 
            if (key === 'type') {
                this.setState({
                    //项目库从项目仓库拉取镜像
                    sourceProjectId: '', // 来源项目ID(项目库从项目仓库拉取镜像)
                    sourceImageId: '', // 源镜像ID(项目库从项目仓库拉取镜像)
                    //项目库从外部仓库拉取镜像
                    repositoryCredentialId: '', // 凭证ID(项目库从外部仓库拉取镜像)
                    sourceImage: '', // 镜像来源(项目库从外部仓库拉取镜像)
                    //项目库从公共平台库拉取镜像
                    sourceImageId: '', // 源镜像ID(项目库从公共平台库拉取镜像)
                    // 公用参数
                    projectId: '', // 归属项目ID
                    targetImage: '', // 目标镜像Repo:tag
                    targetRepo: '', // 目标镜像仓库地址
                    credentialList: [], // 凭证列表
                    sourceImageList: [], // 源镜像列表
                })
                if (value === 3) {
                    // 如果type是平台公共库，则获取源镜像列表，因为平台公共就是不需要项目id的
                    this.getSourceImageList()
                }
            }
            // 归属项目改变需要重新请求
            if (key === 'projectId') {
                this.setState({
                    targetRepo: '',
                    repositoryCredentialId: '',
                    credentialList: []
                })
                this.getCredentialList()
                this.getImageRepositoryPath()
            }
            if (key === 'sourceProjectId') {
                this.setState({
                    sourceImageList: []
                })
                this.getSourceImageList()
            }
        })
    }
    render() {
        const { form, intl } = this.props
        const {
            type, sourceProjectId, sourceImageId, repositoryCredentialId, sourceImage,
            projectId, targetImage, targetRepo, projectList, credentialList, sourceImageList
        } = this.state
        return (
            <Form
                ref={(node) => { this.form = node }}
                form={form}
                subMessage
                className='addPullForm'
            >
                {/* 选择类型 */}
                <Select
                    form={form}
                    name="type"
                    value={type}
                    placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'ImageResource' }) })}
                    onChange={(val) => this.handleChange('type', val)}
                    label={intl.formatMessage({ id: 'ImageResource' })}
                    isRequired
                    options={[
                        { value: 1, text: '外部库' },
                        { value: 2, text: '项目库' },
                        { value: 3, text: '公共平台库' }
                    ]}
                    optionFilterProp='children'
                    optionLabelProp='children'
                />
                {
                    type === 2 ? (
                        // 来源项目
                        <Select
                            form={form}
                            name="sourceProjectId"
                            value={sourceProjectId}
                            placeholder={intl.formatMessage({ id: 'SelectProjectPlaceHolder' })}
                            onChange={this.handleChange.bind(this, 'sourceProjectId')}
                            label='来源项目'
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
                        />
                    ) : null
                }
                {/* 归属项目 */}
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
                />
                {
                    type === 1 ? (
                        // 选择凭证
                        <Select
                            form={form}
                            name="repositoryCredentialId"
                            value={repositoryCredentialId}
                            placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'Credential' }) })}
                            onChange={this.handleChange.bind(this, 'repositoryCredentialId')}
                            label='选择凭证'
                            isRequired
                            options={
                                credentialList.map(item => {
                                    return {
                                        value: item.id,
                                        text: item.repoName,
                                    }
                                })
                            }
                            optionFilterProp='children'
                            optionLabelProp='children'
                        />
                    ) : null
                }
                {
                    type === 1 ? (
                        <Input
                            form={form}
                            name="sourceImage"
                            value={sourceImage}
                            placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: '源镜像' })}
                            onChange={this.handleChange.bind(this, 'sourceImage')}
                            label='源镜像'
                            isRequired
                        />
                    ) : (
                        <Select
                            form={form}
                            name="sourceImageId"
                            value={sourceImageId}
                            placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: '源镜像' })}
                            onChange={this.handleChange.bind(this, 'sourceImageId')}
                            label='源镜像'
                            isRequired
                            options={
                                sourceImageList.map(item => {
                                    return {
                                        value: item.id,
                                        text: item.name,
                                    }
                                })
                            }
                            optionFilterProp='children'
                            optionLabelProp='children'
                        />
                    )
                }
                <Panel
                    form={form}
                    value={targetImage}
                    name="targetImagePanel"
                    label={intl.formatMessage({ id: 'TargetImage' })}
                    inline
                    isRequired
                    className='targetImage'>
                    <span>{targetRepo}&nbsp;</span>
                    <Input
                        form={form}
                        name='targetImage'
                        value={targetImage}
                        onChange={(val) => this.handleChange('targetImage', val)}
                        label=''
                        placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'TargetImage' }) })}
                        isRequired
                    />
                </Panel>
            </Form>
        )
    }
}

export default RcForm.create()(AddPullModal)
