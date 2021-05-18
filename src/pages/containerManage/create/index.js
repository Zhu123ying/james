/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Loading, Notification, Button, KeyValue, Dialog } from 'ultraui'
import { Collapse } from 'huayunui'
import MultiLineMessage from '~/components/MultiLineMessage'
import Regex from '~/utils/regex'
import './index.less'
import HuayunRequest from '~/http/request'
import { container as api } from '~/http/api'
import ContainerGroupConfig from './containerGroupConfig'

const { FormGroup, Form, Input, RadioGroup, Textarea, FormRow, Select } = RcForm
const notification = Notification.newInstance()
const _ = window._

const navigationBarItems = ['ContainerGroupConfig', 'ContainerConfig', 'AffinityConfig', 'NetworkConfig', 'LogPersistence', 'AlarmConfig']
class ManageContainerItem extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        const { match: { params: { id } }, intl } = props
        this.id = id
        this.state = {
            currentBarType: navigationBarItems[0],
            formData: {

            },
            isFetching: false
        }
    }
    componentDidMount() {
        this.props.handleExtra({
            style: {
                display: 'none'
            },
        })
    }
    componentWillUnmount() {
        this.props.handleExtra({
            style: {
                display: 'block'
            }
        })
    }
    getDetail = () => {
        // 获取详情数据
        HuayunRequest(api.detail, { id: this.id }, {
            success: (res) => {

            }
        })
    }
    handleChange = (key, val, item) => {
        const value = _.get(val, 'target.value', val)

    }
    handleSubmit = () => {
        const { form, history, intl } = this.props
        const { formData } = this.state
    }
    handleCancel = () => {
        this.props.history.push('/applicationCenter/containerManage')
    }
    handleTypeChange = (type) => {
        this.setState({
            currentBarType: type
        })
        // 找到锚点
        let anchorElement = document.getElementById(type);
        // 如果对应id的锚点存在，就跳转到锚点
        if (anchorElement) { anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    }
    render() {
        const { form, intl } = this.props
        const { formData: { }, isFetching, currentBarType } = this.state
        return (
            <div id="ManageContainerItem">
                {
                    isFetching ? <Loading /> : (
                        <Form
                            ref={(node) => { this.form = node }}
                            form={form}
                            style={{ paddingRight: '0' }}
                            className="m-b-lg create_step"
                            subMessage
                        >
                            <div className='left'>
                                {
                                    navigationBarItems.map(item => {
                                        return (
                                            <div className={`barItem ${currentBarType === item ? 'activeType activeBefore' : ''}`} key={item} onClick={() => this.handleTypeChange(item)}>{intl.formatMessage({ id: item })}</div>
                                        )
                                    })
                                }
                            </div>
                            <div className='middle'></div>
                            <div className='right'></div>
                        </Form>
                    )
                }
            </div>
        )
    }
}


export default RcForm.create()(ManageContainerItem)
