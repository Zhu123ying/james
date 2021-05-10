/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, Popover, Modal, ButtonGroup, Button } from 'huayunui';
import { Icon } from 'ultraui'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import './index.less'
import ResourceObject from './resourceObject'
import { formatChartValues, versionDetailKeyObject, packageDetailKeyObject } from '~/pages/utils'
import AppVersionHistory from './appVersionHistory'
import ApplicationVersionConfig from './applicationVersionConfig'
class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            resourceObjectType: 'current', // current和history
        }
    }
    handleSeeAppVersionHistory = () => {
        const { intl, detail } = this.props
        Modal.info({
            title: `${detail.name} ${intl.formatMessage({ id: 'ApplicationVersion' })}`,
            content: (<AppVersionHistory wrappedComponentRef={(node) => { this.$AppVersionHistory = node }} {...this.props} />),
            className: 'appVersionHistoryDialog',
        })
    }
    // 版本配置
    handleSeeVersionConfig = () => {
        const { intl, detail } = this.props
        Modal.info(
            {
                content: (<ApplicationVersionConfig {...this.props} />),
                title: intl.formatMessage({ id: 'VersionConfig' }),
                className: 'applicationVersionConfigModal',
            }
        )
    }
    handleSetState = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    render() {
        const { intl, detail } = this.props
        const { resourceObjectDtos, historyResourceObjectDtos, state, applicationType, updateTime, reversionNum } = detail
        const applicationPackage = _.get(detail, packageDetailKeyObject[applicationType], {}) || {}
        const applicationPackageVersion = _.get(detail, versionDetailKeyObject[applicationType], {}) || {}
        const { resourceObjectType } = this.state
        return (
            <div className='applicationDetail_detail'>
                <div className='detailSummary'>
                    <div className='appVersion summaryItem'>
                        <div className='detail-icon-wrapper'><Icon type='app' /></div>
                        <div className='versionHistory'>
                            <div className='value'>
                                {reversionNum}&nbsp;&nbsp;
                                <Popover
                                    placement="top"
                                    content={<div>{intl.formatMessage({ id: 'View' })}</div>}
                                    trigger="hover"
                                    type="text"
                                ><i className='iconfont icon-view' onClick={this.handleSeeAppVersionHistory}></i></Popover>
                            </div>
                            <div className='title'>{intl.formatMessage({ id: 'ApplicationVersion' })}</div>
                        </div>
                    </div>
                    <div className='updateTime summaryItem'>
                        <div className='value'>{updateTime}</div>
                        <div className='title'>{intl.formatMessage({ id: 'UpdateTime' })}</div>
                    </div>
                    <div className='appPackageVersion summaryItem'>
                        <div className='value'>{`${applicationPackage.name || DEFAULT_EMPTY_LABEL} / ${applicationPackageVersion.name || DEFAULT_EMPTY_LABEL}`}</div>
                        <div className='title'>{`${intl.formatMessage({ id: 'AppPackage' })}/${intl.formatMessage({ id: 'Version' })}`}</div>
                    </div>
                </div>
                <div className='versionResource'>
                    <div className='header'>
                        <ButtonGroup>
                            <Button type={resourceObjectType === 'current' ? 'message' : 'operate'} name={intl.formatMessage({ id: 'CurrentVersionResource' })} onClick={() => this.handleSetState('resourceObjectType', 'current')} />
                            <Button type={resourceObjectType === 'history' ? 'message' : 'operate'} name={intl.formatMessage({ id: 'HistoryVersionResource' })} onClick={() => this.handleSetState('resourceObjectType', 'history')} />
                        </ButtonGroup>
                        <Button type='link' className='versionConfig' onClick={this.handleSeeVersionConfig}>
                            <Icon type='setting2'></Icon>&nbsp;
                            {intl.formatMessage({ id: 'VersionConfig' })}
                        </Button>
                    </div>
                    <ResourceObject
                        {...this.props}
                        getDetail={this.props.getDetail}
                        type={resourceObjectType}
                    />
                </div>
            </div>
        )
    }
}

export default Detail
