/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { Row, Col, Loading, NoData, Button, Tab, Static, Icon } from 'ultraui'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import Detail from 'components/Detail'

const TabPanel = Tab.TabPanel
const DEFAULT_EMPTY_LABEL = '-'

const BaseDetail = ({ prefixCls = 'ult', match }) => {
    const intl = useIntl()
    const { formatMessage } = intl
    const currentCreateForm = window.location.hash.replace('#', '')

    // const { modelDetail, modelUpdate } = useSelector(state => ({
    //     modelDetail: state.baseModel.baremetal.getNode.post,
    //     modelUpdate: state.baseModel.baremetal.updateNode.post
    // }))

    const handleRefresh = () => {
        handleGetDetailData()
    }
    const handleGetDetailData = () => {
        // 发请求
    }

    const handleEditName = (val) => {
        // 发请求
        // callback: handleRefresh
    }

    // 基本信息
    const handleGetBaseInfo = (data) => {
        // 权限判断
        const hasEditNameRight = true

        return [{
            id: 'project',
            name: intl.formatMessage({ id: 'Project' }),
            value: '测试'
        }, {
            id: 'name',
            name: intl.formatMessage({ id: 'Name' }),
            value: 'zfname',
            extraOptions: hasEditNameRight && {
                editable: 'NAME',
                onUpdate: handleEditName,
                submitting: false
            }
        }, {
            id: 'id',
            name: 'ID',
            value: '13812222222',
            extraOptions: {
                copy: true
            }
        }, {
            id: 'status',
            name: intl.formatMessage({ id: 'Status' }),
            value: <Static type={'success'} value={intl.formatMessage({ id: 'Enable' })} />
        }, {
            id: 'time',
            name: intl.formatMessage({ id: 'Time' }),
            value: '2020-11-22 10:55:45'
        }]
    }

    // 配置信息
    const handleGetConfigInfo = (data) => {
        return [{
            id: 'cpu',
            name: 'CPU',
            value: '1'
        }, {
            id: 'memory',
            name: intl.formatMessage({ id: 'Memory' }),
            value: '2'
        }, {
            id: 'image',
            name: intl.formatMessage({ id: 'Image' }),
            value: '3'
        }]
    }

    const prepareDetailData = (data) => {
        // if (_.isEmpty(data)) {
        //     return []
        // }

        const options = [{
            name: intl.formatMessage({ id: 'StartVM' }),
            callback: () => console.log('StartVM'),
            disabled: false,
            action: '',
            icon: 'boot'
        }, {
            name: intl.formatMessage({ id: 'StopVM' }),
            callback: () => console.log('StopVM'),
            disabled: false,
            action: '',
            icon: 'shutdown'
        }, {
            name: intl.formatMessage({ id: 'Reboot' }),
            callback: () => console.log('Reboot'),
            disabled: false,
            action: '',
            icon: 'restart'
        }, {
            name: intl.formatMessage({ id: 'Delete' }),
            callback: () => console.log('Delete'),
            disabled: false,
            action: '',
            icon: 'empty'
        }]

        return [{
            id: 'BaseInfo',
            name: intl.formatMessage({ id: 'BaseInfo' }),
            buttons: [<Button key='refresh' name={intl.formatMessage({ id: 'Refresh' })} icon="refresh" size="small" type="text" onClick={handleRefresh} />],
            operate: {
                title: intl.formatMessage({ id: 'Operation' }),
                options,
                actions: true
            },
            options: handleGetBaseInfo(data)
        }, {
            id: 'Flavor',
            name: intl.formatMessage({ id: 'Configuration' }),
            operate: {
                title: intl.formatMessage({ id: 'Operation' }),
                actions: true
            },
            options: handleGetConfigInfo(data)
        }]
    }

    const handleRenderRightDetail = () => {
        // if (_.get(modelDetail, 'isFetching', false)) {
        //     return <div className="ult-detail-panel"><Loading /></div>
        // }
        // if (_.isEmpty(_.get(modelDetail, 'data.data'))) {
        //     return <NoData />
        // }
        return (
            <Detail
                className='left-part-panels'
                data={prepareDetailData({})}
                prefixCls={prefixCls}
            />
        )
    }

    const handleLoadingAndEmpty = (component) => {
        // if (modelDetail.isFetching) {
        //     return <Loading className="monitor-panel" />
        // }
        // if (_.isEmpty(_.get(modelDetail, 'data.data'))) {
        //     return <NoData className="monitor-panel" />
        // }
        return component
    }

    const handleGetFinalTabs = () => {
        return [
            {
                key: 'monitor',
                name: 'tab1',
                component: handleLoadingAndEmpty(<div>我是测试tab1</div>)
            },
            {
                key: 'bindResource',
                name: 'tab2',
                component: handleLoadingAndEmpty(<div>我是测试tab2</div>)
            }
        ]
    }

    const handleRenderLeftTabs = () => {
        const tabs = handleGetFinalTabs()
        return (
            <div className="right-tabs">
                <Tab
                    prefixCls={prefixCls}
                    defaultKey={currentCreateForm || tabs[0].key}
                    handleSwitchTab={v => { window.location.hash = v }}
                    padNone
                >
                    {
                        tabs.map(({ key, name, component }) => (
                            <TabPanel
                                key={key}
                                title={name}
                                prefixCls={prefixCls}
                            >
                                {component || <Loading />}
                            </TabPanel>))
                    }
                </Tab>
            </div>
        )
    }
    return (
        <Row className="base-detail-page">
            <Col span={3} lg={3} md={3} className="left-part-new">
                {
                    handleRenderRightDetail()
                }
            </Col>
            <Col span={9} lg={9} md={9} className="right-part-new">
                {
                    handleRenderLeftTabs()
                }
            </Col>
        </Row>
    )
}

export default BaseDetail
