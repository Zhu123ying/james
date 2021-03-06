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
        this.state = {
            repoName: '',
            credentialType: 1,
            projectId: '',
            protocol: 1,
            host: '',
            port: '',
            userName: '',
            password: '',
            caCert: {}
        }
    }

    componentDidMount() {
        const { currentTableItem } = this.props
        const { id, repoName, credentialType, projectId, protocol, host, port, userName, password } = currentTableItem
        if (id) {
            this.setState({
                repoName, credentialType, projectId, protocol, host, port, userName, password
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
            caCert: file
        })
        return false
    }

    render() {
        const { form, intl, projectList, currentTableItem } = this.props
        const { repoName, credentialType, projectId, protocol, host, port, userName, password, caCert } = this.state
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
                        label='????????????'
                        isRequired
                    />
                    {
                        isAdmin() ? (
                            <RadioGroup
                                form={form}
                                name="credentialType"
                                label='????????????'
                                items={[
                                    { title: '????????????', value: '0', disabled: currentTableItem.id },
                                    { title: '????????????', value: '1', disabled: currentTableItem.id }
                                ]}
                                defaultValue={String(credentialType)}
                                onChange={(val) => this.handleChange('credentialType', parseInt(val))}
                                inline
                                isRequired
                            />
                        ) : null
                    }
                    {
                        credentialType === 0 ? null : (
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
                                disabled={currentTableItem.id}
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
                        isRequired
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
                        value={caCert}
                        name="caCert"
                        className="uploadPanel"
                        label='??????'
                        inline
                    >
                        <Upload
                            accept=".crt"
                            beforeUpload={this.handleChoseFile}
                        >
                            <RcForm.Button type="primary" name={intl.formatMessage({ id: 'selectFile' })} />
                            <span className="fileName">&nbsp;&nbsp;{(caCert && caCert.name) || currentTableItem.certName}</span>
                        </Upload>
                    </Panel>
                </Form>
            </div>
        )
    }
}


export default RcForm.create()(Create)
