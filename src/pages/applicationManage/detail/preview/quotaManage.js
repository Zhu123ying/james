/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Button, Icon, Loading, SortTable, Dialog, KeyValue } from 'ultraui'
import Regex from '~/utils/regex'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'

const _ = window._
const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm
const staticStorageObj = {
    cEphemeralStorage: '容器宿主机存储(Gi)',
    cStorage: '容器持久存储(Gi)'
}
class QuotaManage extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props)
        const { quota: { cCPU, cMemory, storageInfo } } = props
        this.state = {
            cCPU,
            cMemory,
            storageInfo: storageInfo || {},
        }
    }

    componentDidMount() {
        this.initStorageInfo()
    }

    initStorageInfo = () => {
        const { availableQuotaData: { availableStorageQuota }, quota } = this.props
        const storageInfoProps = _.get(quota, 'storageInfo', {})
        let { storageInfo } = this.state
        Object.keys(availableStorageQuota || {}).map(key => {
            const total = _.get(storageInfoProps, `${key}.total`, 0)
            storageInfo[key] = {
                total
            }
        })
        this.setState({
            storageInfo
        })
    }

    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: parseInt(value)
        })
    }

    handleStorageChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        let { storageInfo } = this.state
        storageInfo[key].total = parseInt(value)
        this.setState({
            storageInfo: { ...storageInfo }
        })
    }

    render() {
        const { intl, form } = this.props
        const { cCPU, cMemory, storageInfo } = this.state
        return (
            <Form
                ref={(node) => { this.form = node }}
                form={form}
            >
                <Input
                    form={form}
                    name='cCPU'
                    value={cCPU || ''}
                    type='number'
                    onChange={val => this.handleChange('cCPU', val)}
                    label='容器内存CPU(m)'
                    validRegex={Regex.isPositive}
                    isRequired
                    inline
                />
                <Input
                    form={form}
                    name='cMemory'
                    value={cMemory || ''}
                    type='number'
                    onChange={val => this.handleChange('cMemory', val)}
                    label='容器内存(Mi)'
                    validRegex={Regex.isPositive}
                    isRequired
                    inline
                />
                <Panel
                    form={form}
                    value={storageInfo}
                    name="storageInfo"
                    // label={intl.formatMessage({ id: 'Static Storage' })}
                    inline
                    className='storageInfoPanel'
                >
                    {
                        Object.keys(storageInfo).map(key => {
                            return (
                                <Input
                                    form={form}
                                    name={key}
                                    value={storageInfo[key].total || ''}
                                    type='number'
                                    onChange={val => this.handleStorageChange(key, val)}
                                    label={staticStorageObj[key]}
                                    validRegex={Regex.isPositive}
                                    inline
                                    key={key}
                                />
                            )
                        })
                    }
                </Panel>
            </Form>
        )
    }
}

export default RcForm.create()(QuotaManage)
