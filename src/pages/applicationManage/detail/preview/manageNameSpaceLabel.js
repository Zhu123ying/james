/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Button, Icon, Loading, SortTable, Dialog } from 'ultraui'
import './index.less'
import Regex from '~/utils/regex'
import { ValidLabelKeyProps, ValidLabelValueProps } from '~/pages/containerManage/create/constant'

const _ = window._
const { Form, FormRow, Select, Input } = RcForm

class ManageNameSpaceLabel extends React.Component {
    static propTypes = {
        intl: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props)
        this.state = {
            labelList: this.initData()
        }
    }

    initData = () => {
        const { labelObj } = this.props
        let keys = Object.keys(labelObj)
        if (!keys.length) {
            return [{ key: '', value: '' }]
        } else {
            let index = keys.indexOf('nsname') // 这个是系统生成的，不能修改
            if (index > -1) {
                keys.splice(index, 1)
                keys = ['nsname', ...keys]
            }
            return keys.map(key => {
                return {
                    key, value: labelObj[key]
                }
            })
        }
    }

    handleChange = (key, val, index) => {
        const value = _.get(val, 'target.value', val)
        let { labelList } = this.state
        labelList[index][key] = value
        this.setState({
            labelList: [...labelList]
        })
    }

    handleAddLine = () => {
        const { labelList } = this.state
        this.setState({
            labelList: [...labelList, { key: '', value: '' }]
        })
    }

    handleDeleteLine = (index) => {
        let { labelList } = this.state
        labelList.splice(index, 1)
        this.setState({
            labelList: [...labelList]
        })
    }

    render() {
        const { intl, form } = this.props
        const { labelList } = this.state
        return (
            <div className='labelLineList'>
                <Form
                    ref={(node) => { this.form = node }}
                    form={form}
                    style={{ paddingRight: '0' }}
                    className="m-b-lg create_step"
                    subMessage
                >
                    {
                        labelList.map((item, index) => {
                            return (
                                <div className='labelLine' key={index}>
                                    <Input
                                        form={form}
                                        name={`key${index}`}
                                        onChange={(val) => this.handleChange('key', val, index)}
                                        value={item.key}
                                        {...ValidLabelKeyProps}
                                    />&nbsp;&nbsp;:&nbsp;&nbsp;
                                    <Input
                                        form={form}
                                        name={`value${index}`}
                                        onChange={(val) => this.handleChange('value', val, index)}
                                        value={item.value}
                                        {...ValidLabelValueProps}
                                    />&nbsp;&nbsp;
                                    {
                                        index === 0 ? (
                                            <i className='iconfont icon-add' onClick={this.handleAddLine} />
                                        ) : (
                                            <i className='iconfont icon-minus' onClick={() => this.handleDeleteLine(index)} />
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </Form>
            </div>
        )
    }
}

export default RcForm.create()(ManageNameSpaceLabel)
