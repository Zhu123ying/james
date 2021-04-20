import React from 'react'
import MultiLineMessage from 'components/MultiLineMessage'
import { Col, RcForm, Row } from '@huayun/ultraui'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const { Form, Input, Button, FormGroup, FormRow } = RcForm
const { Regex, Textarea, RadioGroup } = RcForm
// const {Option} = Select

const StyledFormRow = styled(FormRow)`
    &.ult-row-flex {
        height: 100%;
    }
    & .ult-rcform-row {
        height: 100%;
    }
`

const StyledCol = styled(Col)`
    display: flex;    
`

const StyledForm = styled(Form)`
    width: 75%;
`

const StyledLeftCol = styled(Col)`
    &.ult-rcform-row-oneCol {
        border-right: 2px dotted rgba(0, 0, 0, 0.09) !important;
    }
    
`

const StyledTitle = styled.b`
    margin-bottom: 8px;
    display: block;
    font-size: 16px;
    font-weight: bolder;
`

class MixForm extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props)

        this.defaultSelValue = {
            project: 'huayun',
            region: ['RegionOne'],
            source: 'image',
            sourceValue: 'centos7'
        }

        this.state = {
            project: this.defaultSelValue.project
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
    }

    handleSubmit() {
        const { form } = this.props
        let data = form.getFieldsValue()
        console.log('-----data:---', data)
    }

    handleReset() {
        this.props.form.resetFields()
    }

    handleSelectChange(key, value) {
        console.log('-----------', value, key)
        this.setState({
            [`${key}`]: value
        })
    }

    handleInputChange(e) {
        console.log('----------', e.target.value)
    }

    render() {
        const { form } = this.props
        const { project } = this.state

        return (
            <StyledForm
                form={form}
                // className="m-b-lg"
                onSubmit={this.handleSubmit.bind(this)}
                subMessage
            >
                <div>
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
                </div>
                    <div>
                        <Input
                            form={form}
                            value="test@huayun.com"
                            name="email"
                            label="邮箱"
                            validRegex={Regex.isEmail}
                            invalidMessage="您输入的邮箱格式不正确！"
                            isRequired
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
                        />
                    </div>
                    <div>
                        <Textarea
                            form={form}
                            value=""
                            name="description"
                            label="初始化脚本"
                            hideLabel
                        />
                    </div>
                <Row>
                    <Col span={3} />
                    <Col span={9} style={{paddingLeft: 16, paddingRight: '20%'}}>
                        <FormGroup offset className='m-t-lg'>
                            {/* 提交按钮 */}
                            <Button
                                type="primary"
                                name="提交"
                                htmlType="submit"
                            />

                            {/* 重置按钮 */}
                            <Button
                                type="default"
                                name="重置"
                                onClick={this.handleReset.bind(this)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </StyledForm>
        )
    }
}

const MForm = RcForm.create()(MixForm)

const renderBaseInfo = (props) => {
    const { intl } = props
    return (
        <div>
            <div>
                <div className="instance-create-heading">
                    <h4 className="instance-div-title">
                        <StyledTitle>{intl.formatMessage({ id: 'SettingBaseInfo' })}</StyledTitle>
                    </h4>
                </div>
                <div className="details">
                    <MultiLineMessage id='PrivateNetworkDetails' />
                </div>
            </div>
            {/* <div style={{marginTop: '32px'}}>
                <div className="instance-create-heading">
                    <h4 className="instance-div-title">
                        {intl.formatMessage({ id: 'AddSubnet' })}
                    </h4>
                </div>
                <div className="details">
                    <MultiLineMessage id='PrivateNetworkDetailsAddSubnet' />
                </div>
            </div> */}
        </div>
    )
}

function DeskPoolCreate(props) {
    // const { form, intl, history } = props;
    return (
        <StyledFormRow style={{background: '#fff'}}>
            <StyledLeftCol>{renderBaseInfo(props)}</StyledLeftCol>
            <StyledCol>

                <MForm />
            </StyledCol>
        </StyledFormRow>
    )
}

const CreatForm = RcForm.create()(DeskPoolCreate)

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CreatForm))
