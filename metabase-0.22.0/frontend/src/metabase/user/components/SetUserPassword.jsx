/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import FormField from "metabase/components/form/FormField.jsx";
import FormLabel from "metabase/components/form/FormLabel.jsx";
import FormMessage from "metabase/components/form/FormMessage.jsx";

import MetabaseUtils from "metabase/lib/utils";
import MetabaseSettings from "metabase/lib/settings";

import _ from "underscore";
import cx from "classnames";

export default class SetUserPassword extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = { formError: null, valid: false }
    }

    static propTypes = {
        submitFn: PropTypes.func.isRequired,
        user: PropTypes.object,
        updatePasswordResult: PropTypes.object.isRequired
    };

    componentDidMount() {
        this.validateForm();
    }

    validateForm() {
        let { valid } = this.state;
        let isValid = true;

        // required: first_name, last_name, email
        for (var fieldName in this.refs) {
            let node = ReactDOM.findDOMNode(this.refs[fieldName]);
            if (node.required && MetabaseUtils.isEmpty(node.value)) isValid = false;
        }

        if(isValid !== valid) {
            this.setState({
                'valid': isValid
            });
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

        // make sure new passwords match
        if (ReactDOM.findDOMNode(this.refs.password).value !== ReactDOM.findDOMNode(this.refs.password2).value) {
            formErrors.data.errors.password2 = "Passwords do not match";
        }

        if (_.keys(formErrors.data.errors).length > 0) {
            this.setState({
                formError: formErrors
            });
            return;
        }

        let details = {};

        details.user_id = this.props.user.id;
        details.old_password = ReactDOM.findDOMNode(this.refs.oldPassword).value;
        details.password = ReactDOM.findDOMNode(this.refs.password).value;

        this.props.submitFn(details);
    }

    render() {
        const { updatePasswordResult } = this.props;
        let { formError, valid } = this.state;
        const passwordComplexity = MetabaseSettings.passwordComplexity(true);

        formError = (updatePasswordResult && !formError) ? updatePasswordResult : formError;

        return (
            <div>
                <form className="Form-new bordered rounded shadowed" onSubmit={this.formSubmitted.bind(this)} noValidate>
                    <FormField fieldName="old_password" formError={formError}>
                        <FormLabel title="????????????" fieldName="old_password" formError={formError}></FormLabel>
                        <input ref="oldPassword" type="password" className="Form-input Form-offset full" name="old_password" placeholder="..." onChange={this.onChange.bind(this)} autoFocus={true} required />
                        <span className="Form-charm"></span>
                    </FormField>

                    <FormField fieldName="password" formError={formError}>
                        <FormLabel title="?????????" fieldName="password" formError={formError} ></FormLabel>
                        <span style={{fontWeight: "400"}} className="Form-label Form-offset">{passwordComplexity}</span>
                        <input ref="password" type="password" className="Form-input Form-offset full" name="password" placeholder="???????????????????????????????????????" onChange={this.onChange.bind(this)} required />
                        <span className="Form-charm"></span>
                    </FormField>

                    <FormField fieldName="password2" formError={formError}>
                        <FormLabel title="???????????????" fieldName="password2" formError={formError} ></FormLabel>
                        <input ref="password2" type="password" className="Form-input Form-offset full" name="password" placeholder="" required onChange={this.onChange.bind(this)} />
                        <span className="Form-charm"></span>
                    </FormField>

                    <div className="Form-actions">
                        <button className={cx("Button", {"Button--primary": valid})} disabled={!valid}>
                            ??????
                        </button>
                        <FormMessage formError={(updatePasswordResult && !updatePasswordResult.success && !formError) ? updatePasswordResult : undefined} formSuccess={(updatePasswordResult && updatePasswordResult.success) ? updatePasswordResult : undefined} />
                    </div>
                </form>
            </div>
        );
    }
}
