/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import CommonLayOut from '~/components/CommonLayOut'
import { DatePicker } from 'huayunui';
const { RangePicker } = DatePicker;
class ApplicationManage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',

        }
    }
    handleSearch = (key, value) => {
        console.log(key)
        console.log(value)
    }
    render() {
        // const searchItems = [
        //     {
        //         render: <RangePicker
        //             onChange={(val) => this.handleSearch('time', val)}
        //             themeType="huayun"
        //             selectType="dropDown"
        //             customerPlaceholder="请选择日期区间"
        //         />
        //     }
        // ]
        return (

            <RangePicker
                onChange={this.handleSearch}
                themeType="huayun"
                selectType="dropDown"
                customerPlaceholder="请选择日期区间"
                // value={selectRangeDate}
            />
        )
    }
}

ApplicationManage.propTypes = {
    intl: PropTypes.object
}

export default ApplicationManage
