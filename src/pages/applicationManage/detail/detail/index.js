/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input } from 'huayunui';
import { Icon } from 'ultraui'
import './index.less'
// import ActionAuth from '~/components/ActionAuth'
// import actions from '~/constants/authAction'
import ResourceObject from './resourceObject'
class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        const { intl, detail } = this.props
        const { resourceObjectDtos, historyResourceObjectDtos, state } = detail
        return (
            <div className='applicationDetail_detail'>
                <ResourceObject
                    {...this.props}
                    type='current'
                    state={state}
                    resourceObjectDtos={resourceObjectDtos || []}
                />
            </div>
        )
    }
}

export default Detail
