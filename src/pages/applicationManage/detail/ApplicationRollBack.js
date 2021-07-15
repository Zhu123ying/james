/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RcForm, Button, Icon, Loading, SortTable, Dialog } from 'ultraui'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import './index.less'

const { RadioGroup, Form } = RcForm
const _ = window._

class AppRollBack extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired,
        detail: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {
            versionId: null,
            isCoverApplicationGateway: 'true', // 是否覆盖应用包入口
            isCoverApplicationAlarmConfig: 'true', // 告警配置是否覆盖
            isCoverApplicationContainerConfig: 'true', // 日志采集配置是否覆盖
            rollBackVersionlist: [], // 回滚的版本记录
        }
    }
    componentDidMount() {
        this.getAppHistoryVersion()
    }
    getAppHistoryVersion = () => {
        const { detail: { id: applicationId }, intl } = this.props
        HuayunRequest(api.queryRollBackVersion, { applicationId }, {
            success: ({ data }) => {
                let rollBackVersionlist = []
                data.forEach((item, index) => {
                    if (!item.uninstall) {
                        rollBackVersionlist.push({
                            value: item.id,
                            text: `${data.length - index} ${index === 0 ? `(${intl.formatMessage({ id: 'CurrentVersion' })})` : ''}`,
                        })
                    }
                })
                this.setState({
                    rollBackVersionlist
                })
            }
        })
    }
    handleOnChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    render() {
        const { intl, form } = this.props
        const { versionId, isCoverApplicationGateway, isCoverApplicationAlarmConfig, isCoverApplicationContainerConfig, rollBackVersionlist } = this.state

        return (
            <Form form={form}>
                <RcForm.Select
                    form={form}
                    name='versionId'
                    onChange={this.handleOnChange.bind(this, 'versionId')}
                    optionLabelProp="children"
                    value={versionId}
                    label={intl.formatMessage({ id: 'Select Version To RollBack' })}
                    isRequired
                    options={rollBackVersionlist}
                    optionFilterProp='children'
                    optionLabelProp='children'
                />
                <RadioGroup
                    form={form}
                    name="isCoverApplicationGateway"
                    label={intl.formatMessage({ id: 'isCoverApplicationGateway' })}
                    items={[
                        { title: '是', value: 'true' },
                        { title: '否', value: 'false' }
                    ]}
                    value={isCoverApplicationGateway}
                    onChange={(val) => this.handleOnChange('isCoverApplicationGateway', val)}
                    inline
                />
                <RadioGroup
                    form={form}
                    name="isCoverApplicationAlarmConfig"
                    label={intl.formatMessage({ id: 'isCoverApplicationAlarmConfig' })}
                    items={[
                        { title: '是', value: 'true' },
                        { title: '否', value: 'false' }
                    ]}
                    value={isCoverApplicationAlarmConfig}
                    onChange={(val) => this.handleOnChange('isCoverApplicationAlarmConfig', val)}
                    inline
                />
                <RadioGroup
                    form={form}
                    name="isCoverApplicationContainerConfig"
                    label={intl.formatMessage({ id: 'isCoverApplicationContainerConfig' })}
                    items={[
                        { title: '是', value: 'true' },
                        { title: '否', value: 'false' }
                    ]}
                    value={isCoverApplicationContainerConfig}
                    onChange={(val) => this.handleOnChange('isCoverApplicationContainerConfig', val)}
                    inline
                />
            </Form>
        )
    }
}

export default RcForm.create()(AppRollBack)
