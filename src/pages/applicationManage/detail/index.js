/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input } from 'huayunui';
import { Icon } from 'ultraui'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
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
        const on_offLine = state === 'config' ? (<><Icon type="rise-o" />&nbsp;上线</>) : (<><Icon type="drop-o" />&nbsp;下线</>)
        const operaOptions = [
            <div className='operaItem'>{on_offLine}</div>,
            <div className='operaItem'><Icon type="reboot" />&nbsp;更新</div>,
            <div className='operaItem'><Icon type="release" />&nbsp;更改配置</div>,
            <div className='operaItem'><Icon type="refresh" />&nbsp;回滚</div>,
            <div className='operaItem noborder'><Icon type="delete" />&nbsp;删除</div>,
            <div className='operaItem'>输出历史<Icon type="down" /></div>
        ]
        return (
            <div className='applicationDetail'>
                <div className='operaBar'>{
                    operaOptions.map((item, index) => {
                        return <ActionAuth action={actions.AdminApplicationCenterApplicationMaintain} key={index}>{item}</ActionAuth>
                    })
                }</div>
            </div>
        )
    }
}

ApplicationDetail.propTypes = {
    intl: PropTypes.object,
    currentApplication: PropTypes.object,
}

export default ApplicationDetail
