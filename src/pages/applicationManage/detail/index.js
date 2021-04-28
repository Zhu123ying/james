/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, Tabs } from 'huayunui';
import { Icon } from 'ultraui'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import Preview from './preview'
import Detail from './detail'
import Entrance from './entrance'
import Alarm from './alarm'
import Log from './log'
import Publish from './publish'

const { TabPane } = Tabs;
class ApplicationDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {
        this.getDetail()
    }
    getDetail = () => {

    }
    render() {
        const { intl, currentApplication: { state } } = this.props
        const { } = this.state
        const on_offLine = state === 'config' ? (<><Icon type="rise-o" />&nbsp;{intl.formatMessage({ id: 'OnLine' })}</>) : (<><Icon type="drop-o" />&nbsp;{intl.formatMessage({ id: 'OffLine' })}</>)
        const operaOptions = [
            <div className='operaItem'>{on_offLine}</div>,
            <div className='operaItem'><Icon type="reboot" />&nbsp;{intl.formatMessage({ id: 'Update' })}</div>,
            <div className='operaItem'><Icon type="release" />&nbsp;{intl.formatMessage({ id: 'ChangeSetting' })}</div>,
            <div className='operaItem'><Icon type="refresh" />&nbsp;{intl.formatMessage({ id: 'RollBack' })}</div>,
            <div className='operaItem noborder'><Icon type="delete" />&nbsp;{intl.formatMessage({ id: 'Delete' })}</div>,
            <div className='operaItem'>{intl.formatMessage({ id: 'OutputHistory' })}<Icon type="down" /></div>
        ]
        return (
            <div className='applicationDetail'>
                <div className='operaBar'>
                    {
                        operaOptions.map((item, index) => {
                            return <ActionAuth action={actions.AdminApplicationCenterApplicationMaintain} key={index}>{item}</ActionAuth>
                        })
                    }
                </div>
                <div className='detailContent'>
                    <Tabs defaultActiveKey="Preview">
                        <TabPane tab={intl.formatMessage({ id: 'OutputHistory' })} key="Preview">
                            <Preview intl={intl}></Preview>
                        </TabPane>
                        <TabPane tab={intl.formatMessage({ id: 'Detail' })} key="Detail">
                            <Detail intl={intl}></Detail>
                        </TabPane>
                        <TabPane tab={intl.formatMessage({ id: 'Entrance' })} key="Entrance">
                            <Entrance intl={intl}></Entrance>
                        </TabPane>
                        <TabPane tab={intl.formatMessage({ id: 'Alarm' })} key="Alarm">
                            <Alarm intl={intl}></Alarm>
                        </TabPane>
                        <TabPane tab={intl.formatMessage({ id: 'Log' })} key="Log">
                            <Log intl={intl}></Log>
                        </TabPane>
                        <TabPane tab={intl.formatMessage({ id: 'AppPublish' })} key="Publish">
                            <Publish intl={intl}></Publish>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

ApplicationDetail.propTypes = {
    intl: PropTypes.object,
    currentApplication: PropTypes.object,
}

export default ApplicationDetail
