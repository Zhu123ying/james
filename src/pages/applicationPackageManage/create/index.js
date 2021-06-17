/* eslint-disable */
import React from 'react'
import { RcForm, Loading, Row, Col, Icon, Notification, TagItem } from 'ultraui'
import { applicationPackage as api, application } from '~/http/api'
import HuayunRequest from '~/http/request'
import MultiLineMessage from '~/components/MultiLineMessage'
import Regex from '~/utils/regex'
import './index.less'

const notification = Notification.newInstance()
const { FormGroup, Form, Input, Button, RadioGroup, Textarea, FormRow, Select } = RcForm
const _ = window._
const iconList = ['setting', 'VMware1', 'esxi', 'shousuo', 'zhankai', 'duankou', 'node', 'Archer-', 'Dell-', 'CAS', 'huawei', 'menubg', 'ali', 'save', 'Kubernetes', 'pubCloud', 'preCloud', 'vMware', 'verification', 'subnet'] // 图标集合
const colorList = ['red', 'yellow', 'blue', 'green', 'black', 'purple', 'pink', 'brown', 'chocolate', 'yellowgreen', 'antiquewhite', 'aqua', 'cornflowerblue', 'violet', 'turquoise', 'tomato', 'gainsboro', 'teal', 'springgreen', 'tan'] // 图标颜色集合

class AppPackageCreate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            description: '',
            tags: [],
            tagInput: '',
            applicationIcon: iconList[0],
            applicationIconColor: colorList[0],
            projectId: '',
            projectList: []
        }
        this.operationTarget = props.intl.formatMessage({ id: 'AppPackage' })
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

    getDetail = () => {
        const { id } = this.props.match.params
        HuayunRequest(api.getApplicationPackage, { id }, {
            success: (res) => {
                const { applicationIcon, applicationIconColor, description, name, tags, id, projectId } = res.data
                this.setState({
                    tagInput: '',
                    applicationIcon,
                    applicationIconColor,
                    description,
                    name,
                    tags,
                    id,
                    projectId
                })
            }
        })
    }

    handleSubmit = () => {
        const { match: { params: { id } }, history, intl } = this.props
        const { name, description, tags, applicationIcon, applicationIconColor, projectId } = this.state
        const params = {
            id, name, description, tags, applicationIcon, applicationIconColor, projectId
        }
        const url = id ? 'updateApplicationPackage' : 'createApplicationPackage'
        const action = intl.formatMessage({ id: id ? 'Update' : 'Create' })
        HuayunRequest(api[url], params, {
            success: (res) => {
                notification.notice({
                    id: new Date(),
                    type: 'success',
                    title: intl.formatMessage({ id: 'Success' }),
                    content: `${action}${this.operationTarget}'${name}'${intl.formatMessage({ id: 'Success' })}`,
                    iconNode: 'icon-success-o',
                    duration: 5,
                    closable: true
                })
                this.handleCancel()
            }
        })
    }

    handleCancel() {
        this.props.history.push('/applicationCenter/applicationPackageManage')
    }

    handleChange = (key, val) => {
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

    deleteTag = (index) => {
        const { tags } = this.state
        tags.splice(index, 1)
        this.setState({
            tags
        })
    }

    render() {
        const { form, intl, match: { params: { id } } } = this.props
        const { name, description, tagInput, tags, applicationIconColor, applicationIcon, projectId, projectList } = this.state

        return (
            <div id="AppPackageCreate">
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
                                    {intl.formatMessage({ id: 'CreateAppPackageTitle' })}
                                </h4>
                            </div>
                            <div className="details">
                                <MultiLineMessage id='CreateAppPackageDes' />
                            </div>
                        </div>
                        <div>
                            <Row className="brandRow">
                                <Col span={12}>
                                    <div className="brand" style={{ backgroundColor: applicationIconColor }}>
                                        <Icon type={applicationIcon} />
                                    </div>
                                </Col>
                                <Col span={6} className='selectIcon'>
                                    {
                                        iconList.map(item => {
                                            return <Icon type={item} key={item} onClick={this.handleChange.bind(this, 'applicationIcon', item)} />
                                        })
                                    }
                                </Col>
                                <Col span={6} className="selectColor">
                                    {
                                        colorList.map(item => {
                                            return <div key={item} style={{ backgroundColor: item }} className="colorItem" onClick={this.handleChange.bind(this, 'applicationIconColor', item)} />
                                        })
                                    }
                                </Col>
                            </Row>
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
                                disabled={id}
                            />
                            <Input
                                form={form}
                                name='name'
                                value={name}
                                onChange={this.handleChange.bind(this, 'name')}
                                label={intl.formatMessage({ id: 'Name' })}
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
                                label={intl.formatMessage({ id: 'Description' })}
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
                            <div className='labelList'>
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
            </div>
        )
    }
}

export default RcForm.create()(AppPackageCreate)
