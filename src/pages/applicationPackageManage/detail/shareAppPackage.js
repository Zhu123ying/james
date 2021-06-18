/* eslint-disable */
import React from 'react'
import { RcForm, Loading, Row, Col, Icon, Notification, Switch } from 'ultraui'
import { Table } from 'huayunui'
import './index.less'
import HuayunRequest from '~/http/request'
import { applicationPackage as api, application } from '~/http/api'

const { FormGroup, Form, Input, Button, RadioGroup, Textarea, FormRow, Panel, Select } = RcForm
const _ = window._
class ShareAppPackage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            applicationPackageVersionIds: [], // 选中的id集合
            projectId: '',
            projectList: [], // 项目列表
            versionList: [], // 版本列表
        }
    }
    componentDidMount() {
        this.getProjectList()
        this.getApplicationPackageInfoForShare()
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
    getApplicationPackageInfoForShare = () => {
        // 获取应用包的版本列表信息
        const { applicationPackageId: id } = this.props
        HuayunRequest(api.getApplicationPackageInfoForShare, { id }, {
            success: (res) => {
                this.setState({
                    versionList: res.data.applicationPackageVersionList
                })
            }
        })
    }

    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
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
            }
        ]
    }

    render() {
        const { form, intl, currentPorjectId } = this.props
        const { applicationPackageVersionIds, projectId, projectList, versionList } = this.state

        return (
            <Form
                id='shareVersionForm'
                ref={(node) => { this.form = node }}
                form={form}
                style={{ paddingRight: '0' }}
                className="m-b-lg create_step"
                subMessage
            >
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
                                disabled: item.id === currentPorjectId
                            }
                        })
                    }
                    optionFilterProp='children'
                    optionLabelProp='children'
                />
                <Panel
                    form={form}
                    name="applicationPackageVersionIds"
                    label={intl.formatMessage({ id: 'SelectVersion' })}
                    value={applicationPackageVersionIds}
                    isRequired
                    className='tablePanel'
                >
                    <Table
                        columns={this.getTableColumns()}
                        dataSource={versionList}
                        pagination={false}
                        rowSelection={{
                            selectedRowKeys: applicationPackageVersionIds,
                            onChange: (keys, items) => this.handleChange('applicationPackageVersionIds', keys),
                        }}
                        rowKey='id'
                    />
                </Panel>
            </Form>
        )
    }
}

export default RcForm.create()(ShareAppPackage)
