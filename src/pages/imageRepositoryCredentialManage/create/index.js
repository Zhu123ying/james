/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog } from 'ultraui'
import Regex from '~/utils/regex'
import './index.less'
import { isAdmin } from '~/utils/cache'
import Upload from 'rc-upload'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._

class Create extends React.Component {
    constructor(props) {
        super(props)
        this.id = _.get(props, 'match.params.id', null) // 编辑的时候传过来的应用的id
        this.state = {
            repoName: '',
            credentialType: 1,
            projectId: '',
            protocol: 1,
            host: '',
            port: '',
            userName: '',
            password: '',
            certInfo: {}
        }
    }

    componentDidMount() {
        const { currentTableItem } = this.props
        const { id, repoName, credentialType, projectId, protocol, host, port, userName, password, certName } = currentTableItem
        if (id) {
            this.setState({
                repoName, credentialType, projectId, protocol, host, port, userName, password,
                certInfo: {
                    name: certName
                }
            })
        }
    }

    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        }, () => {
            if (key === 'credentialType') {
                this.setState({
                    projectId: ''
                })
            }
        })
    }

    handleChoseFile = (file) => {
        this.setState({
            certInfo: file
        })
        return false
    }

    render() {
        const { form, intl, projectList } = this.props
        const { repoName, credentialType, projectId, protocol, host, port, userName, password, certInfo } = this.state
        return (
            <div id="CreateImageVoucher">
                <Form
                    ref={(node) => { this.form = node }}
                    form={form}
                    style={{ paddingRight: '0' }}
                    className="m-b-lg create_step"
                    subMessage
                >
                    <Input
                        form={form}
                        name='repoName'
                        value={repoName}
                        onChange={this.handleChange.bind(this, 'repoName')}
                        label='仓库名称'
                        isRequired
                    />
                    {
                        isAdmin() ? (
                            <RadioGroup
                                form={form}
                                name="credentialType"
                                label='凭证类型'
                                items={[
                                    { title: '系统凭证', value: '0' },
                                    { title: '项目凭证', value: '1' }
                                ]}
                                value={credentialType.toString()}
                                onChange={(val) => this.handleChange('credentialType', val)}
                                inline
                                isRequired
                            />
                        ) : null
                    }
                    {
                        credentialType === '0' ? null : (
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
                        )
                    }
                    <Select
                        form={form}
                        name="protocol"
                        value={protocol.toString()}
                        placeholder={intl.formatMessage({ id: 'SelectProjectPlaceHolder' })}
                        onChange={this.handleChange.bind(this, 'protocol')}
                        label={intl.formatMessage({ id: 'ProtocolType' })}
                        options={
                            [
                                { value: '0', text: 'Http' },
                                { value: '1', text: 'Https' }
                            ]
                        }
                        optionFilterProp='children'
                        optionLabelProp='children'
                    />
                    <Input
                        form={form}
                        name='host'
                        value={host}
                        onChange={this.handleChange.bind(this, 'host')}
                        label='Host'
                    />
                    <Input
                        form={form}
                        name='port'
                        value={port}
                        onChange={this.handleChange.bind(this, 'port')}
                        label='Port'
                        type='number'
                    />
                    <Input
                        form={form}
                        name='userName'
                        value={userName}
                        onChange={this.handleChange.bind(this, 'userName')}
                        label={intl.formatMessage({ id: 'UserName' })}
                    />
                    <Input
                        form={form}
                        name='password'
                        value={password}
                        onChange={this.handleChange.bind(this, 'password')}
                        label={intl.formatMessage({ id: 'Password' })}
                    />
                    <Panel
                        form={form}
                        value={certInfo}
                        name="certInfo"
                        className="uploadPanel"
                        label='证书'
                        inline
                    >
                        <Upload
                            accept=".crt"
                            beforeUpload={this.handleChoseFile}
                        >
                            <RcForm.Button type="primary" name={intl.formatMessage({ id: 'selectFile' })} />
                            <span className="fileName">&nbsp;&nbsp;{certInfo && certInfo.name}</span>
                        </Upload>
                    </Panel>
                </Form>
            </div>
        )
    }
}


export default RcForm.create()(Create)
