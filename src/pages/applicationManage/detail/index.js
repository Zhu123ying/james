/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input } from 'huayunui';
import { Icon } from 'ultraui'
import './index.less'

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
        const { intl } = this.props
        const { } = this.state
        const operaOptions = [
            <div className='operaItem' key='on_offLine'><Icon type="rise-o" />&nbsp;下线</div>,
            <div className='operaItem' key='reboot'><Icon type="reboot" />&nbsp;更新</div>,
            <div className='operaItem' key='release'><Icon type="release" />&nbsp;更改配置</div>,
            <div className='operaItem' key='refresh'><Icon type="refresh" />&nbsp;回滚</div>,
            <div className='operaItem noborder' key='delete'><Icon type="delete" />&nbsp;删除</div>,
            <div className='operaItem' key='down'>输出历史<Icon type="down" /></div>
        ]
        return (
            <div className='applicationDetail'>
                <div className='operaBar'>{operaOptions}</div>
            </div>
        )
    }
}

ApplicationDetail.propTypes = {
    intl: PropTypes.object,
    applicationId: PropTypes.string,
}

export default ApplicationDetail
