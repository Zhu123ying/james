import React, { Component, PropTypes } from "react";

import _ from "underscore";
import cx from "classnames";

import AuthScene from "../components/AuthScene.jsx";
import BackToLogin from "../components/BackToLogin.jsx"
import FormField from "metabase/components/form/FormField.jsx";
import FormLabel from "metabase/components/form/FormLabel.jsx";
import FormMessage from "metabase/components/form/FormMessage.jsx";
import LogoIcon from "metabase/components/LogoIcon.jsx";
import Icon from "metabase/components/Icon.jsx";

import MetabaseSettings from "metabase/lib/settings";


import { SessionApi } from "metabase/services";


export default class ForgotPasswordApp extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            email: props.location.query.email || null,
            sentNotification: false,
            error: null
        };
    }

    async sendResetNotification(e) {
        e.preventDefault();

        if (!_.isEmpty(this.state.email)) {
            try {
                await SessionApi.forgot_password({"email": this.state.email});
                this.setState({sentNotification: true, error: null});
            } catch (error) {
                this.setState({error: error});
            }
        }
    }

    render() {
        const { sentNotification, error } = this.state;
        const valid = !_.isEmpty(this.state.email);
        const emailConfigured = MetabaseSettings.isEmailConfigured();

        return (
            <div className="full-height bg-white flex flex-column flex-full md-layout-centered">
                <div className="Login-wrapper wrapper Grid Grid--full md-Grid--1of2">
                      <div className="Grid-cell flex layout-centered text-brand">
                          <LogoIcon className="Logo my4 sm-my0" width={66} height={85} />
                      </div>
                      { !emailConfigured ?
                      <div className="Grid-cell">
                          <div className="text-centered bordered rounded shadowed p4">
                              <h3 className="my4">??????????????????????????????</h3>
                              <BackToLogin />
                          </div>
                      </div>
                      :
                      <div className="Grid-cell">
                          { !sentNotification ?
                          <div>
                              <form className="ForgotForm bg-white Form-new bordered rounded shadowed" name="form" noValidate>
                                  <h3 className="Login-header Form-offset mb3">????????????</h3>

                                  <FormMessage message={error && error.data && error.data.message}></FormMessage>

                                  <FormField key="email" fieldName="email" formError={error}>
                                      <FormLabel title={"Email address"}  fieldName={"email"} formError={error} />
                                      <input className="Form-input Form-offset full" name="email" placeholder="The email you use for your Metabase account" type="text" onChange={(e) => this.setState({"email": e.target.value})} defaultValue={this.state.email} autoFocus />
                                      <span className="Form-charm"></span>
                                  </FormField>

                                  <div className="Form-actions">
                                      <button className={cx("Button", {"Button--primary": valid})} onClick={(e) => this.sendResetNotification(e)} disabled={!valid}>
                                          ????????????????????????
                                      </button>
                                  </div>
                              </form>
                          </div>
                          :
                          <div>
                              <div className="SuccessGroup bg-white bordered rounded shadowed">
                                  <div className="SuccessMark">
                                      <Icon name="check" />
                                  </div>
                                  <p className="SuccessText">??????????????????????????????????????????</p>
                              </div>
                          </div>
                          }
                      </div>
                    }
                    </div>
                <AuthScene />
            </div>
        );
    }
}
