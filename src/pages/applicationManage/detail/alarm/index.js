/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input } from 'huayunui';
import { Icon } from '~/pages/applicationManage/detail/log/node_modules/~/pages/applicationManage/detail/entrance/node_modules/~/pages/applicationManage/detail/detail/node_modules/ultraui'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
class Alarm extends React.Component {
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
        return (
            <div className='applicationDetail_alarm'>
                applicationDetail_preview
            </div>
        )
    }
}

Alarm.propTypes = {
    intl: PropTypes.object,
    currentApplication: PropTypes.object,
}

export default Alarm
