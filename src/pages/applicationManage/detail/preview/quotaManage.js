/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Button, Icon, Loading, SortTable, Dialog, KeyValue } from 'ultraui'
import Regex from '~/utils/regex'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'

const _ = window._
const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select, Panel } = RcForm

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
            availableQuotaData: {}, // 可用配额的数据
        }
    }

    componentDidMount() {
        this.getAvailableQuota()
    }

    getAvailableQuota = () => {
        HuayunRequest(api.getAvailableQuota, { projectId: this.props.projectId }, {
            success: (res) => {
                const { availableStorageQuota } = res.data
                const storageInfoProps = _.get(this.props, 'quota.storageInfo', {})
                let { storageInfo } = this.state
                Object.keys(availableStorageQuota).map(key => {
                    const total = _.get(storageInfoProps, `${key}.total`, 0)
                    storageInfo[key] = {
                        total
                    }
                })
                this.setState({
                    availableQuotaData: res.data,
                    storageInfo
                })
            }
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
        const { cCPU, cMemory, storageInfo, availableQuotaData, isFetching } = this.state
        const { availableStorageQuota, cCPU: cpuAvailable, cMemory: memoryAvailable } = availableQuotaData
        const remainAvailableQuota = [
            { label: 'cCPU(m)', value: cpuAvailable },
            { label: 'cMemory(Mi)', value: memoryAvailable },
            {
                label: intl.formatMessage({ id: 'Static Storage' }),
                value: availableStorageQuota ? (
                    <React.Fragment>
                        {
                            Object.keys(availableStorageQuota).map(key => {
                                return (
                                    <div key={key}>
                                        {
                                            `${key}     ${availableStorageQuota[key]}`
                                        }
                                    </div>
                                )
                            })
                        }
                    </React.Fragment>
                ) : ''
            },
        ]
        return (
            <div className='content'>
                <div className='left'>
                    <div className='title'>{intl.formatMessage({ id: 'CurrentQuota' })}</div>
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
                            label='cCPU(m)'
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
                            label='cMemory(Mi)'
                            validRegex={Regex.isPositive}
                            isRequired
                            inline
                        />
                        <Panel
                            form={form}
                            value={storageInfo}
                            name="storageInfo"
                            label={intl.formatMessage({ id: 'Static Storage' })}
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
                                            label={key}
                                            validRegex={Regex.isPositive}
                                            inline
                                            key={key}
                                        />
                                    )
                                })
                            }
                        </Panel>
                    </Form>
                </div>
                <div className='right'>
                    <div className='title'>{intl.formatMessage({ id: 'RemainingAvailableQuota' })}</div>
                    <KeyValue values={remainAvailableQuota}></KeyValue>
                </div>
            </div>
        )
    }
}

export default RcForm.create()(QuotaManage)
