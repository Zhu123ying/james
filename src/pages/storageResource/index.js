/* eslint-disable */
import React from 'react'
import { DatePicker, Select, Input, Tabs, Modal, Dropdown } from 'huayunui';
import './index.less'
import DynamicList from './dynamic'
import PvList from './pv'

const { TabPane } = Tabs
class StorageResourceList extends React.Component {
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
        return (
            <div id='StorageResourceList'>
                <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab={intl.formatMessage({ id: 'StorageVolume' })} key="1">
                        <PvList {...this.props} />
                    </TabPane>
                    <TabPane tab={intl.formatMessage({ id: 'StorageType' })} key="2">
                        <DynamicList {...this.props} />
                    </TabPane>
                </Tabs>
            </div >
        )
    }
}

export default StorageResourceList
