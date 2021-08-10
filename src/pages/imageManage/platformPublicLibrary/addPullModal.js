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
            type: 1, // 添加拉取有两种方案，1：从外部库拉取。2：从项目库拉取
            sourceProjectId: '', // 源项目ID(平台公共库从项目仓库拉取镜像)
            sourceImageId: '', // 源镜像ID(平台公共库从项目仓库拉取镜像)
            repositoryCredentialId: '', // 凭证ID(平台公共库从外部仓库拉取镜像)
            sourceImage: '', // 镜像来源(平台公共库从外部仓库拉取镜像)
            targetImage: '', // 目标镜像Repo:tag
            targetRepo: '', // 目标镜像仓库地址
            projectList: [], // 项目列表
            credentialList: [], // 凭证列表
            sourceImageList: [], // 源镜像列表（只有在type为项目库的时候）
        }
    }
    componentDidMount() {
        this.getProjectList()
        this.getCredentialList()
        this.getImageRepositoryPath()
    }
    getImageRepositoryPath = () => {
        HuayunRequest(image.getImageRepositoryPath, { repoType: 'pubRepo' }, {
            success: (res) => {
                this.setState({
                    targetRepo: res.data.repoPath
                })
            }
        })
    }
    // 获取凭证
    getCredentialList = () => {
        HuayunRequest(image.getRepositoryCredentialListForImagePull, { repoType: 'pubRepo' }, {
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
        const { sourceProjectId } = this.state
        let params = {
            sourceType: 'projectRepo',
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
                    repositoryCredentialId: '',
                    sourceImageId: '',
                    sourceProjectId: '',
                    sourceImageId: '',
                    sourceImageList: []
                })
            }
            if (key === 'sourceProjectId') {
                this.getSourceImageList()
            }
        })
    }
    render() {
        const { form, intl } = this.props
        const {
            type, sourceProjectId, sourceImageId, repositoryCredentialId, sourceImage,
            targetImage, targetRepo, projectList, credentialList, sourceImageList
        } = this.state
        return (
            <Form
                ref={(node) => { this.form = node }}
                form={form}
                subMessage
                className='addPullForm'
            >
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
                        { value: 2, text: '项目库' }
                    ]}
                    optionFilterProp='children'
                    optionLabelProp='children'
                />
                {
                    type === 1 ? (
                        // 选择凭证
                        <React.Fragment>
                            <Select
                                form={form}
                                name="repositoryCredentialId"
                                value={repositoryCredentialId}
                                placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: intl.formatMessage({ id: 'Credential' }) })}
                                onChange={this.handleChange.bind(this, 'repositoryCredentialId')}
                                label={intl.formatMessage({ id: 'Credential' })}
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
                            <Input
                                form={form}
                                name='sourceImage'
                                value={sourceImage}
                                onChange={(val) => this.handleChange('sourceImage', val)}
                                label='源镜像'
                                placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: '源镜像' })}
                                isRequired
                                maxLength={200}
                            />
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {/* 选择项目 */}
                            <Select
                                form={form}
                                name="sourceProjectId"
                                value={sourceProjectId}
                                placeholder={intl.formatMessage({ id: 'SelectProjectPlaceHolder' })}
                                onChange={this.handleChange.bind(this, 'sourceProjectId')}
                                label={intl.formatMessage({ id: 'Project' })}
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
                        </React.Fragment>
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
