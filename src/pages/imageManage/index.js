/* eslint-disable */
import React from 'react'
import { DatePicker, Select, Input, Tabs, Modal, Dropdown } from 'huayunui';
import './index.less'
import { isAdmin } from '~/utils/cache'
import PlatformPublicLibrary from './platformPublicLibrary'
import ApplicationStoreLibrary from './applicationStoreLibrary'
import ProjectLibrary from './projectLibrary'

const { TabPane } = Tabs
class ImageManage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
        this.props.handleExtra({
            border: false
        })
    }
    componentWillUnmount() {
        this.props.handleExtra({
            border: true
        })
    }
    render() {
        const { intl } = this.props
        const { } = this.state
        return (
            <div id='ImageManage'>
                <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab={intl.formatMessage({ id: 'PlatformPublicLibrary' })} key="1">
                        <PlatformPublicLibrary {...this.props} />
                    </TabPane>
                    {
                        isAdmin() ? (
                            <TabPane tab={intl.formatMessage({ id: 'AppStoreLibrary' })} key="2">
                                <ApplicationStoreLibrary {...this.props} />
                            </TabPane>
                        ) : null
                    }
                    <TabPane tab={intl.formatMessage({ id: 'ProjectLibrary' })} key="3">
                        <ProjectLibrary {...this.props} />
                    </TabPane>
                </Tabs>
            </div >
        )
    }
}

export default ImageManage
