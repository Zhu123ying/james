/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";

import Icon from "metabase/components/Icon.jsx";
import MetabaseSettings from "metabase/lib/settings";
import PopoverWithTrigger from "metabase/components/PopoverWithTrigger.jsx";

import { MODAL_EDIT_DETAILS,
         MODAL_INVITE_RESENT,
         MODAL_REMOVE_USER,
         MODAL_RESET_PASSWORD } from "../containers/PeopleListingApp.jsx";

export default class UserActionsSelect extends Component {

    static propTypes = {
        user: PropTypes.object.isRequired,
        isActiveUser: PropTypes.bool.isRequired,
        showModal: PropTypes.func.isRequired,
        resendInvite: PropTypes.func.isRequired,
    };

    onEditDetails() {
        this.props.showModal({type: MODAL_EDIT_DETAILS, details: {user: this.props.user}});
        this.refs.popover.toggle();
    }

    onResendInvite() {
        this.props.resendInvite(this.props.user);
        this.props.showModal({type: MODAL_INVITE_RESENT, details: {user: this.props.user}});
        this.refs.popover.toggle();
    }

    onResetPassword() {
        if (window.OSX) {
            window.OSX.resetPassword();
            return;
        }

        this.props.showModal({type: MODAL_RESET_PASSWORD, details: {user: this.props.user}});
        this.refs.popover.toggle();
    }

    onRemoveUser() {
        this.props.showModal({type: MODAL_REMOVE_USER, details: {user: this.props.user}});
        this.refs.popover.toggle();
    }

    render() {
        let { isActiveUser, user } = this.props;

        return (
            <PopoverWithTrigger ref="popover"
                                className="block"
                                triggerElement={<span className="text-grey-1"><Icon name={'ellipsis'}></Icon></span>}>
                <ul className="UserActionsSelect">
                    <li className="py1 px2 bg-brand-hover text-white-hover cursor-pointer" onClick={this.onEditDetails.bind(this)}>编辑详情</li>

                    { (user.last_login === null && MetabaseSettings.isEmailConfigured()) ?
                        <li className="pt1 pb2 px2 bg-brand-hover text-white-hover cursor-pointer" onClick={this.onResendInvite.bind(this)}>重新发送邀请</li>
                    :
                        <li className="pt1 pb2 px2 bg-brand-hover text-white-hover cursor-pointer" onClick={this.onResetPassword.bind(this)}>重置密码</li>
                    }

                    { !isActiveUser &&
                        <li className="p2 border-top bg-error-hover text-error text-white-hover cursor-pointer"  onClick={this.onRemoveUser.bind(this)}>移除</li>
                    }
                </ul>
            </PopoverWithTrigger>
        );
    }
}
