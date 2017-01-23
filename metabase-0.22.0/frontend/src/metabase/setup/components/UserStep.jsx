/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import FormField from "metabase/components/form/FormField.jsx";
import FormLabel from "metabase/components/form/FormLabel.jsx";
import FormMessage from "metabase/components/form/FormMessage.jsx";
import MetabaseAnalytics from "metabase/lib/analytics";
import MetabaseSettings from "metabase/lib/settings";
import MetabaseUtils from "metabase/lib/utils";

import StepTitle from './StepTitle.jsx'
import CollapsedStep from "./CollapsedStep.jsx";

import _ from "underscore";
import cx from "classnames";

export default class UserStep extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { formError: null, passwordError: null, valid: false, validPassword: false }
    }

    static propTypes = {
        stepNumber: PropTypes.number.isRequired,
        activeStep: PropTypes.number.isRequired,
        setActiveStep: PropTypes.func.isRequired,

        userDetails: PropTypes.object,
        setUserDetails: PropTypes.func.isRequired,
        validatePassword: PropTypes.func.isRequired,
    }

    validateForm() {
        let { valid, validPassword } = this.state;
        let isValid = true;

        // required: first_name, last_name, email, password
        for (var fieldName in this.refs) {
            let node = ReactDOM.findDOMNode(this.refs[fieldName]);
            if (node.required && MetabaseUtils.isEmpty(node.value)) isValid = false;
        }

        if (!validPassword) {
            isValid = false;
        }

        if(isValid !== valid) {
            this.setState({
                'valid': isValid
            });
        }
    }

    async onPasswordBlur() {
        try {
            await this.props.validatePassword(ReactDOM.findDOMNode(this.refs.password).value);

            this.setState({
                passwordError: null,
                validPassword: true
            });
        } catch(error) {
            this.setState({
                passwordError: error.data.errors.password,
                validPassword: false
            });

            MetabaseAnalytics.trackEvent('Setup', 'Error', 'password validation');
        }
    }

    onChange() {
        this.validateForm();
    }

    formSubmitted(e) {
        e.preventDefault();

        this.setState({
            formError: null
        });

        let formErrors = {data:{errors:{}}};

        // validate email address
        if (!MetabaseUtils.validEmail(ReactDOM.findDOMNode(this.refs.email).value)) {
            formErrors.data.errors.email = "邮箱格式不正确，请重新输入";
        }

        // TODO - validate password complexity

        // validate password match
        if (ReactDOM.findDOMNode(this.refs.password).value !== ReactDOM.findDOMNode(this.refs.passwordConfirm).value) {
            formErrors.data.errors.password_confirm = "密码不匹配";
        }

        if (_.keys(formErrors.data.errors).length > 0) {
            this.setState({
                formError: formErrors
            });
            return;
        }

        this.props.setUserDetails({
            'nextStep': this.props.stepNumber + 1,
            'details': {
                'first_name': ReactDOM.findDOMNode(this.refs.firstName).value,
                'last_name': ReactDOM.findDOMNode(this.refs.lastName).value,
                'email': ReactDOM.findDOMNode(this.refs.email).value,
                'password': ReactDOM.findDOMNode(this.refs.password).value,
                'site_name': ReactDOM.findDOMNode(this.refs.siteName).value
            }
        });

        MetabaseAnalytics.trackEvent('Setup', 'User Details Step');
    }

    render() {
        let { activeStep, setActiveStep, stepNumber, userDetails } = this.props;
        let { formError, passwordError, valid } = this.state;

        const passwordComplexityDesc = MetabaseSettings.passwordComplexity();
        const stepText = (activeStep <= stepNumber) ? '请输入姓名?' : 'Hi, ' + userDetails.first_name + '. 欢迎使用DataUltra BI!';

        if (activeStep !== stepNumber) {
            return (<CollapsedStep stepNumber={stepNumber} stepText={stepText} isCompleted={activeStep > stepNumber} setActiveStep={setActiveStep}></CollapsedStep>)
        } else {
            return (
                <section className="SetupStep SetupStep--active rounded full relative">
                    <StepTitle title={stepText} number={stepNumber} />
                    <form name="userForm" onSubmit={this.formSubmitted.bind(this)} noValidate className="mt2">
                        <FormField className="Grid mb3" fieldName="first_name" formError={formError}>
                            <div>
                                <FormLabel title="姓" fieldName="first_name" formError={formError}></FormLabel>
                                <input ref="firstName" className="Form-input Form-offset full" name="firstName" defaultValue={(userDetails) ? userDetails.first_name : ""} placeholder="刘" autoFocus={true} onChange={this.onChange.bind(this)} />
                                <span className="Form-charm"></span>
                            </div>
                            <div>
                                <FormLabel title="名" fieldName="last_name" formError={formError}></FormLabel>
                                <input ref="lastName" className="Form-input Form-offset" name="lastName" defaultValue={(userDetails) ? userDetails.last_name : ""} placeholder="德华" required onChange={this.onChange.bind(this)} />
                                <span className="Form-charm"></span>
                            </div>
                        </FormField>

                        <FormField fieldName="email" formError={formError}>
                            <FormLabel title="Email 地址" fieldName="email" formError={formError}></FormLabel>
                            <input ref="email" className="Form-input Form-offset full" name="email" defaultValue={(userDetails) ? userDetails.email : ""} placeholder="请正确输入邮箱地址，这将用于您以后的登陆及通讯" required onChange={this.onChange.bind(this)} />
                            <span className="Form-charm"></span>
                        </FormField>

                        <FormField fieldName="password" formError={formError} error={(passwordError !== null)}>
                            <FormLabel title="创建一个密码" fieldName="password" formError={formError} message={passwordError}></FormLabel>
                            <span style={{fontWeight: "normal"}} className="Form-label Form-offset">{passwordComplexityDesc}</span>
                            <input ref="password" className="Form-input Form-offset full" name="password" type="password" defaultValue={(userDetails) ? userDetails.password : ""} placeholder="..." required onChange={this.onChange.bind(this)} onBlur={this.onPasswordBlur.bind(this)}/>
                            <span className="Form-charm"></span>
                        </FormField>

                        <FormField fieldName="password_confirm" formError={formError}>
                            <FormLabel title="重复密码" fieldName="password_confirm" formError={formError}></FormLabel>
                            <input ref="passwordConfirm" className="Form-input Form-offset full" name="passwordConfirm" type="password" defaultValue={(userDetails) ? userDetails.password : ""} placeholder="..." required onChange={this.onChange.bind(this)} />
                            <span className="Form-charm"></span>
                        </FormField>

                        <FormField fieldName="site_name" formError={formError}>
                            <FormLabel title="您的组织名称" fieldName="site_name" formError={formError}></FormLabel>
                            <input ref="siteName" className="Form-input Form-offset full" name="siteName" type="text" defaultValue={(userDetails) ? userDetails.site_name : ""} placeholder="如：无锡华云数据服务集团有限公司" required onChange={this.onChange.bind(this)} />
                            <span className="Form-charm"></span>
                        </FormField>

                        <div className="Form-actions">
                            <button className={cx("Button", {"Button--primary": valid})} disabled={!valid}>
                                下一步
                            </button>
                            <FormMessage></FormMessage>
                        </div>
                    </form>
                </section>
            );
        }
    }
}
