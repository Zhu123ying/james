/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog, TagItem, InputNumber } from 'ultraui'
import { Collapse, Button as HuayunButton } from 'huayunui'
import Regex from '~/utils/regex'
import '../index.less'
import HuayunRequest from '~/http/request'
import { application, image } from '~/http/api'
import { isAdmin } from '~/utils/cache'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._
class PushImage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 'projectRepo', // 添加拉取有两种方案，1：从外部库拉取。2：从项目库拉取
            projectId: '', // 项目ID
            targetImage: '', // 目标镜像Repo:tag
            targetRepo: '', // 目标镜像仓库地址
            projectList: [], // 项目列表
        }
    }
    componentDidMount() {
        this.getProjectList()
        // this.getImageRepositoryPath()
    }
    getImageRepositoryPath = () => {
        const { projectId, type: repoType } = this.state
        let params = {
            projectId,
            repoType
        }
        HuayunRequest(image.getImageRepositoryPath, params, {
            success: (res) => {
                this.setState({
                    targetRepo: res.data.repoPath
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
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        }, () => {
            // 切换类型，重置相关state 
            if (key === 'type') {
                this.setState({
                    projectId: '', // 项目ID
                    targetImage: '', // 目标镜像Repo:tag
                    targetRepo: '', // 目标镜像仓库地址
                })
                if (value === 'pubRepo') {
                    this.getImageRepositoryPath()
                }
            }
            if (key === 'projectId') {
                this.getImageRepositoryPath()
            }
        })
    }
    render() {
        const { form, intl } = this.props
        const { type, projectId, targetImage, targetRepo, projectList } = this.state
        const isAdmin_ = isAdmin()
        return (
            <Form
                ref={(node) => { this.form = node }}
                form={form}
                subMessage
                className='addPullForm'
            >
                <RadioGroup
                    form={form}
                    name="type"
                    label='目标仓库'
                    items={[
                        { title: '公共库', value: 'pubRepo', disabled: !isAdmin },
                        { title: '项目库', value: 'projectRepo' }
                    ]}
                    value={type}
                    onChange={(val) => this.handleChange('type', val)}
                    inline
                    isRequired
                />
                {
                    type === 'projectRepo' ? (
                        <Select
                            form={form}
                            name="projectId"
                            value={projectId}
                            placeholder={intl.formatMessage({ id: 'SelectProjectPlaceHolder' })}
                            onChange={this.handleChange.bind(this, 'projectId')}
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
                    ) : null
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

export default RcForm.create()(PushImage)
