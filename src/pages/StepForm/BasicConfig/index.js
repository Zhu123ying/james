/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { RcForm, Row, Col, Select, Input as GInput, CheckBoxes, Button as GButton } from '@huayun/ultraui'
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
                // className="m-b-lg margin-md"
                onSubmit={this.handleSubmit.bind(this)}
                subMessage
            >
                <Input
                    form={form}
                    value={email}
                    name="email1"
                    label="邮箱"
                    validRegex={Regex.isEmail}
                    invalidMessage="您输入的邮箱格式不正确！"
                    isRequired
                    tips='请输入正确的邮箱地址'
                />
                <Input
                    form={form}
                    value=""
                    type="password"
                    name="password"
                    label="密码"
                    validRegex={Regex.isPassword}
                    invalidMessage="请填写6-16位字符，不能包含空格"
                    isRequired
                    unit="文字"
                    tips='请输入正确的密码'
                />
                <RcForm.Select
                    form={form}
                    value={project}
                    defaultValue={project}
                    name="project"
                    label="项目"
                    onChange={this.handleSelectChange.bind(this, 'project')}
                    options={['demo', 'neocu', 'huayun']}
                    allowClear
                    isRequired
                    tips='请选择一个项目'
                />
                <RcForm.Select
                    form={form}
                    value=''
                    defaultValue=''
                    name="project1"
                    label="项目"
                    onChange={this.handleSelectChange.bind(this, 'project')}
                    options={[]}
                    isRequired
                    tips='请选择一个项目'
                />
                <RadioGroup
                    form={form}
                    name="type"
                    label="类型"
                    items={[
                        {title: 'General', value: 'General'},
                        {title: 'GPU', value: 'GPU'},
                        {title: 'High', value: 'High'}
                    ]}
                    defaultValue="GPU"
                    onChange={this.handleSelectChange.bind(this, 'type')}
                    inline
                    isRequired
                />
                <CheckboxGroup
                    form={form}
                    name="firewall"
                    label="防火墙"
                    items={[
                        {title: 'default', value: 'default'},
                        {title: 'firewall-1', value: 'firewall-1'},
                        {title: 'firewall-2', value: 'firewall-2'},
                        {title: 'firewall-2', value: 'firewall-3'}
                    ]}
                    defaultValue={['default', 'firewall-2']}
                    onChange={this.handleSelectChange.bind(this, 'firewall')}
                    isRequired
                    inline
                />
                {/* <RcForm.Panel
                    form={form}
                    name="source"
                    value={curSource}
                    label="启动源"
                    errorMsg="这里是Panel的自定义错误信息！"
                    inline
                >
                    <CheckBoxes.RadioGroup
                        style={{width: '300px'}}
                        items={[
                            {title: '镜像', value: 'image'},
                            {title: '云硬盘', value: 'volumn'}
                        ]}
                        defaultValue="image"
                        onChange={this.handleSelectChange.bind(this, 'source')}
                        inline
                    />
                    <Select
                        defaultValue={curSource}
                        value={curSource}
                        onChange={this.handleSelectChange.bind(this, 'sourceValue')}
                    >
                        {
                            sources.map((item, index) => (
                                <Select.Option key={index} value={item} text={item} >{item}</Select.Option>
                            ))
                        }
                    </Select>
                </RcForm.Panel> */}
                <RcForm.Select
                    form={form}
                    defaultValue={region}
                    name="region"
                    label="区域"
                    onChange={this.handleSelectChange.bind(this, 'region')}
                    options={['RegionOne', 'Wuxi', 'ShangHai', 'GuanZhou', 'HongKong']}
                    maxTagTextLength={10}
                    multiple
                    isRequired
                />

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
                        onClick={this.props.onNext}
                        name="下一步"

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
