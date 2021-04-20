/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { Panel, RcForm, Row, Col, Select, Input as GInput, CheckBoxes, Button as GButton } from '@huayun/ultraui'
const { Regex, Form, FormGroup, Input, InputGroup, Button, Textarea, RadioGroup, CheckboxGroup } = RcForm

// /////////////////////////////////////////////////////////////////////////////////
/**
 * 坚形基础表单
 */
class VertBaseForm extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props)

        this.defaultValue = {
            webProtocol: 'http:',
            webDomain: '.com',
            project: 'huayun',
            region: ['RegionOne'],
            source: 'image',
            sourceValue: 'centos7',
            email: 'test@huayun.com'
        }

        this.state = {
            email: this.defaultValue.email,
            webProtocol: this.defaultValue.webProtocol,
            webDomain: this.defaultValue.webDomain,
            project: this.defaultValue.project,
            region: this.defaultValue.region,
            source: this.defaultValue.source,
            sourceValue: this.defaultValue.sourceValue,

            setting: '',
            s1: '',
            s2: ''
        }

        this.sources = {
            image: {
                data: ['centos5', 'centos6', 'centos7', 'redhat', 'ubuntu'],
                defaultValue: 'centos7'
            },
            volumn: {
                data: ['volumn-1', 'volumn-2', 'volumn-3'],
                defaultValue: 'volumn-2'
            }
        }

        this.handleChangeFieldValue = this.handleChangeFieldValue.bind(this)
    }

    handleChangeFieldValue(key, value) {
        this.setState({
            [`${key}`]: value
        })
    }

    handleSubmit() {
        const { form } = this.props
        const { webProtocol, webDomain } = this.state
        let data = form.getFieldsValue()
        data.website = `${webProtocol}\\\\${data.website}${webDomain}`
        console.log('-----data:---', data)
    }

    handleReset() {
        this.props.form.resetFields()
    }

    handleSetFields() {
        this.props.form.setFields({
            email1: { value: 'setFields修改邮箱地址' }
        })
    }

    handleIdentifyCode() {

    }

    handleSelectChange(key, value) {
        console.log('-----------', value, key)
        this.setState({
            [`${key}`]: value
        })
    }

    handleInputChange(key, e) {
        console.log('----------', e.target.value)
        this.setState({
            [`${key}`]: e.target.value
        }, () => {
            this.props.form.validateFields(['settings'], {force: true})
        })
    }

    /**
     * Rc Panel 的required，true显示，false不显示
     * @return {boolean}
     */
    handlePanelRequired(rule, value, source) {
        const { s1, s2 } = this.state
        if (s1 && s2) {
            return false
        }
        return true
    }

    render() {
        const { form } = this.props
        const { webProtocol, webDomain, project, region, source, sourceValue, email, setting, s1, s2 } = this.state

        const sources = this.sources[source].data
        const curSource = this.sources[source].defaultValue
        console.log('+++++++++++', sourceValue)
        return (
            <Form
                ref={(node) => { this.form1 = node }}
                style={{paddingRight: '20%'}}
                form={form}
                className="margin-md"
                onSubmit={this.handleSubmit.bind(this)}
                subMessage
            >
          <Textarea
                    form={form}
                    value=""
                    name="description"
                    label="描述"
                    minLength={10}
                    maxLength={2000}
                    addon="请填写10~2000个字"
                    isRequired
          />
                <InputGroup
                    form={form}
                    value=""
                    name="website"
                    label="网址"
                    isRequired
                >
                    <Select
                        ref={(node) => { this.webProtocolSel = node }}
                        defaultValue={webProtocol}
                        onChange={this.handleSelectChange.bind(this, 'webProtocol')}
                    >
                        {
                            ['http:', 'ftp:', 'https:'].map((item, index) => (
                                <Select.Option key={index} value={item} text={item} >{item}</Select.Option>
                            ))
                        }
                    </Select>
                    {/* 需要显示Input组件的地方写上 “Input” */}
                    Input
                    <Select
                        ref={(node) => { this.webDomainSel = node }}
                        defaultValue={webDomain}
                        onChange={this.handleSelectChange.bind(this, 'webDomain')}
                    >
                        {
                            ['.com', '.cn', '.tech'].map((item, index) => (
                                <Select.Option key={index} value={item} text={item} >{item}</Select.Option>
                            ))
                        }
                    </Select>
                </InputGroup>
                <Input
                    form={form}
                    value=""
                    name="identifyCode"
                    label="验证码"
                    maxLength={6}
                    validRegex={Regex.isIdentifyCode}
                    invalidMessage="请填写您收到的验证码!"
                    handleIdentifyCode={this.handleIdentifyCode.bind(this)}
                    identify
                    isRequired
                />

                <FormGroup offset className='m-t-lg'>
                    {/* 提交按钮 */}
                    <Button
                        onClick={this.props.onPrev}
                        name="上一步"

                    />

                    <Button
                        // className="m-t-md"
                        type="primary"
                        name="提交"
                        htmlType="submit"
                        // block
                    />

                    {/* 重置按钮 */}
                    <Button
                        type="default"
                        name="重置"
                        onClick={this.props.onReset}
                    />

                </FormGroup>
            </Form>
        )
    }
}

const VBaseForm = RcForm.create({
    onFieldsChange: (props, changed, all) => {
        props.onChange(changed)
    }
})(VertBaseForm)

export default VBaseForm
