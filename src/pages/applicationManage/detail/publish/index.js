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
class Publish extends React.Component {
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
        return (
            <div className='applicationDetail_publish'>
                applicationDetail_Publish
            </div>
        )
    }
}

Publish.propTypes = {
    intl: PropTypes.object,
}

export default Publish
