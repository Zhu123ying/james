/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Notification, Button, TagItem, Switch, Input as UltrauiInput, Select as UltrauiSelect } from 'ultraui'
import { Collapse, Button as HuayunButton } from 'huayunui'
import Regex from '~/utils/regex'
import '../index.less'
import { ValidCommonNameProps } from '../constant'
const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const _ = window._

class ManagePorts extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            protocol: '',
            port: ''
        }
    }
    componentDidMount() {
        const { currentPorts } = this.props
        if (currentPorts && currentPorts.name) {
            const { name, protocol, port } = currentPorts
            this.setState({
                name, protocol, port
            })
        }
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    render() {
        const { form, intl } = this.props
        const { name, protocol, port } = this.state
        return (
            <Form
                ref={(node) => { this.form = node }}
                form={form}
                subMessage
                className='operateModalForm'
            >
                <Input
                    form={form}
                    name='name'
                    value={name}
                    onChange={(val) => this.handleChange('name', val)}
                    label={intl.formatMessage({ id: 'Name' })}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'Name' }) })}
                    isRequired
                    {...ValidCommonNameProps}
                />
                <Select
                    form={form}
                    name="protocol"
                    value={protocol}
                    placeholder={intl.formatMessage({ id: 'SelectPlaceHolder' }, { name: '协议' })}
                    onChange={(val) => this.handleChange('protocol', val)}
                    label='协议'
                    isRequired
                    options={['TCP', 'UDP']}
                    optionFilterProp='children'
                    optionLabelProp='children'
                />
                <Input
                    form={form}
                    name='port'
                    value={port}
                    onChange={(val) => this.handleChange('port', parseInt(_.get(val, 'target.value', val)))}
                    label={intl.formatMessage({ id: 'ContainerPort' })}
                    placeholder={intl.formatMessage({ id: 'InputPlaceHolder' }, { name: intl.formatMessage({ id: 'ContainerPort' }) })}
                    isRequired
                    type='number'
                    min={1}
                    max={65535}
                />
            </Form >

        )
    }
}

export default RcForm.create()(ManagePorts)
