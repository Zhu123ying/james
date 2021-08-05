/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Button, Icon, Loading, SortTable, Dialog, Select } from 'ultraui'
import { Popover } from 'huayunui'
import './index.less'
import { formatChartValues, versionDetailKeyObject, packageDetailKeyObject } from '~/pages/utils'

const _ = window._

class ApplicationVersionConfig extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            declaraInfor: '',
            type: 'VALUES',
        }
    }

    componentDidMount() {
        this.getStatementInfor()
    }

    // 声明文件数据
    getStatementInfor = () => {
        const { detail: { id } } = this.props
        let url = '/api/application/v1/queryApplicationDeclarative'
        let data = { id }
        this.setState({
            loading: true
        })
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then(res => {
            this.setState({
                declaraInfor: res.data,
                loading: false
            })
        });
    }

    handleTypeChange = (val) => {
        this.setState({
            type: val
        })
    }

    render() {
        const { intl, detail } = this.props
        const { reversionNum, configInfo, applicationType } = detail
        const { declaraInfor, loading, type } = this.state
        const content = type === 'VALUES' ? configInfo : declaraInfor
        const applicationPackage = _.get(detail, packageDetailKeyObject[applicationType], {}) || {}
        const applicationPackageVersion = _.get(detail, versionDetailKeyObject[applicationType], {}) || {}
        return (
            <React.Fragment>
                {
                    loading.isFetching ? <Loading /> : (
                        <div>
                            <div className='detailSummary'>
                                <div className='appVersion summaryItem'>
                                    <div className='detail-icon-wrapper'><Icon type='app' /></div>
                                    <div className='versionHistory'>
                                        <div className='value'>{reversionNum}</div>
                                        <div className='title'>{intl.formatMessage({ id: 'Index of versions' })}</div>
                                    </div>
                                </div>
                                <div className='updateTime summaryItem'>
                                    <div className='value'>{applicationPackageVersion.name || DEFAULT_EMPTY_LABEL}</div>
                                    <div className='title'>{intl.formatMessage({ id: 'VersionName' })}</div>
                                </div>
                                <div className='appPackageVersion summaryItem'>
                                    <div className='value'>{applicationPackage.name || DEFAULT_EMPTY_LABEL}</div>
                                    <div className='title'>{intl.formatMessage({ id: 'ApplicationPackageName' })}</div>
                                </div>
                            </div>
                            <Button.Group>
                                <Button type={type === 'VALUES' ? 'primary' : 'default'} onClick={() => this.handleTypeChange('VALUES')}>VALUES</Button>
                                <Button type={type === 'TEMPLATE' ? 'primary' : 'default'} onClick={() => this.handleTypeChange('TEMPLATE')}>TEMPLATE</Button>
                            </Button.Group>
                            <div className="chartValues" dangerouslySetInnerHTML={{ __html: formatChartValues(content) }}></div>
                        </div>
                    )
                }
            </React.Fragment>
        )
    }
}

export default ApplicationVersionConfig
