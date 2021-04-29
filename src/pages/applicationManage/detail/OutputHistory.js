/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Button, Icon, Loading, SortTable, Dialog } from 'ultraui'
import { Dropdown } from 'huayunui'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'

class OutputLog extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props)
        this.state = {
            currentLog: {},
            dataList: [],
        }
    }

    componentDidMount() {
        this.queryApplicationOutputLog()
    }

    queryApplicationOutputLog = () => {
        HuayunRequest(api.outputLog, { infoId: this.props.id }, {
            success: (res) => {
                this.setState({
                    dataList: res.data,
                    currentLog: res.data[0] || {}
                })
            }
        })
    }

    handleChangeLog = (item) => {
        this.setState({
            currentLog: item
        })
    }

    render() {
        const { intl } = this.props
        const { currentLog: { reversionNum, createTime, info }, dataList } = this.state
        const logList = <div className='Application_OutputHisttory_LogList'>
            {
                dataList.map(item => {
                    const { reversionNum, createTime } = item
                    return <div key={createTime} className='logItem' onClick={() => this.handleChangeLog(item)}>{`${createTime}  版本${reversionNum}`}</div>
                })
            }
        </div>
        return (
            <div className='OutputLogList'>
                <div className='logContent'>{info}</div>
                {
                    dataList.length > 1 ? (
                        <Dropdown overlay={logList} placement="bottomCenter" arrow>
                            <div className='dropSelect'>
                                <Icon type='left'></Icon>
                                <span>{`${createTime}  版本${reversionNum}`}</span>
                                <Icon type='right'></Icon>
                            </div>
                        </Dropdown>
                    ) : null
                }
            </div>
        )
    }
}

export default OutputLog
