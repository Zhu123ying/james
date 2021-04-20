/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import { injectIntl } from 'react-intl'
import styled from 'styled-components'
import logo from 'assets/logos/logo.png'
import { RcForm } from '@huayun/ultraui'

const { Input, Button } = RcForm
const LoginForm = styled.form`
  width: 37%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid;
`

const Logo = styled.img`
  width: 220px;
  height: 40px;
  margin: 60px auto 30px;
  /* padding-top: 20px; */
  display: block;
`

const StyledInput = styled(Input)`
  &&& {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  & label {
    margin-left: 210px;
    font-size: 14px;
    padding-top: 6px;
    text-align: left;
    margin-bottom: 10px;
    line-height: 16px;
    color: #e3e4e5;
    font-family: 'Microsoft YaHei', 'Source Sans Pro', 'Helvetica Neue',
      Helvetica, Arial, sans-serif;
  }

  .ult-rcform-group-input-wrapper {
    width: 292px;
    /* height: 50px; */
    margin: 0 auto;
  }

  & .ult-rcform-group .ult-label {
    font-size: 14px;
  }

  & input {
    background: transparent;
    color: #E3E4E5;
  }

  & input::placeholder {
    color: #fff;
  }

  & .iconfont {
    color: #919191;
    font-size: 16px;
    top: 14px;
  }
`

const LoginButton = styled(Button)`
  width: 293px;
  margin: 20px auto;
`

const LogoTip = styled.p`
  width: 293px;
  margin: 10px auto;
  color: #919191;
  font-size: 12px;
`

const Footer = styled.footer`
  width: 293px;
  margin: 10px auto;
  color: #919191;
  font-size: 12px;
  text-align: center;
`

class Login extends React.Component {
  render() {
      const { intl, form, history } = this.props

    return (
      <LoginForm form={form}>
        <Logo src={logo} />
        <StyledInput
          form={form}
          name="loginName"
          label={intl.formatMessage({ id: 'userName' })}
          placeholder={intl.formatMessage({
            id: 'LoginInputLoginNamePlaceholder'
          })}
          icon="user"
        />

        <StyledInput
          form={form}
          name="password"
          type="password"
          placeholder={intl.formatMessage({ id: 'InputPasswordPlaceholder' })}
          label={intl.formatMessage({ id: 'password' })}
          icon="lock"
        />

        <LoginButton
          type="primary"
          name={intl.formatMessage({ id: 'login' })}
          htmlType="submit"
          size="large"
          onClick={() => history.push('/home')}
          block
        />

        <LogoTip>
          为避免兼容性问题，请使用Chrome、Firefox、Safari或IE11及以上版本浏览器
        </LogoTip>

        <Footer>©2019-2020 安超云软件有限公司 版权所有</Footer>
      </LoginForm>
    )
  }
}

export default injectIntl(RcForm.create()(Login))
