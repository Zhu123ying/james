/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import _ from "underscore";
import { connect } from "react-redux";

import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper.jsx";
import AdminPaneLayout from "metabase/components/AdminPaneLayout.jsx";
import MetabaseSettings from "metabase/lib/settings";
import MetabaseUtils from "metabase/lib/utils";
import Modal from "metabase/components/Modal.jsx";
import PasswordReveal from "metabase/components/PasswordReveal.jsx";
import UserAvatar from "metabase/components/UserAvatar.jsx";
import Icon from "metabase/components/Icon.jsx";
import Tooltip from "metabase/components/Tooltip.jsx";
import Button from "metabase/components/Button.jsx";

import EditUserForm from "../components/EditUserForm.jsx";
import UserActionsSelect from "../components/UserActionsSelect.jsx";
import UserGroupSelect from "../components/UserGroupSelect.jsx";

export const MODAL_ADD_PERSON = 'MODAL_ADD_PERSON';
export const MODAL_EDIT_DETAILS = 'MODAL_EDIT_DETAILS';
export const MODAL_INVITE_RESENT = 'MODAL_INVITE_RESENT';
export const MODAL_REMOVE_USER = 'MODAL_REMOVE_USER';
export const MODAL_RESET_PASSWORD = 'MODAL_RESET_PASSWORD';
export const MODAL_RESET_PASSWORD_MANUAL = 'MODAL_RESET_PASSWORD_MANUAL';
export const MODAL_RESET_PASSWORD_EMAIL = 'MODAL_RESET_PASSWORD_EMAIL';
export const MODAL_USER_ADDED_WITH_INVITE = 'MODAL_USER_ADDED_WITH_INVITE';
export const MODAL_USER_ADDED_WITH_PASSWORD = 'MODAL_USER_ADDED_WITH_PASSWORD';

import { getUsers, getModal, getGroups } from "../selectors";
import {
    createUser,
    deleteUser,
    fetchUsers,
    resetPasswordManually,
    resetPasswordViaEmail,
    showModal,
    updateUser,
    resendInvite,
    loadGroups,
    loadMemberships,
    createMembership,
    deleteMembership,
} from "../people";

const mapStateToProps = (state, props) => {
    return {
        users: getUsers(state, props),
        modal: getModal(state, props),
        user: state.currentUser,
        groups: getGroups(state, props)
    }
}

const mapDispatchToProps = {
    createUser,
    deleteUser,
    fetchUsers,
    resetPasswordManually,
    resetPasswordViaEmail,
    showModal,
    updateUser,
    resendInvite,
    loadGroups,
    loadMemberships,
    createMembership,
    deleteMembership
};

@connect(mapStateToProps, mapDispatchToProps)
export default class PeopleListingApp extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = { error: null };
    }

    static propTypes = {
        user: PropTypes.object.isRequired,
        users: PropTypes.object,
        groups: PropTypes.array,
        modal: PropTypes.object,
        createUser: PropTypes.func.isRequired,
        deleteUser: PropTypes.func.isRequired,
        fetchUsers: PropTypes.func.isRequired,
        resetPasswordManually: PropTypes.func.isRequired,
        resetPasswordViaEmail: PropTypes.func.isRequired,
        showModal: PropTypes.func.isRequired,
        updateUser: PropTypes.func.isRequired,
        resendInvite: PropTypes.func.isRequired,
        loadGroups: PropTypes.func.isRequired,
        loadMemberships: PropTypes.func.isRequired,
        createMembership: PropTypes.func.isRequired,
        deleteMembership: PropTypes.func.isRequired,
    };

    async componentDidMount() {
        try {
            await Promise.all([
                this.props.fetchUsers(),
                this.props.loadGroups(),
                this.props.loadMemberships()
            ]);
        } catch (error) {
            this.setState({ error });
        }
    }

    async onAddPerson(user) {
        // close the modal no matter what
        this.props.showModal(null);

        if (user) {
            let modal = MODAL_USER_ADDED_WITH_INVITE;

            // we assume invite style creation and tweak as needed if email not available
            if (!MetabaseSettings.isEmailConfigured()) {
                modal = MODAL_USER_ADDED_WITH_PASSWORD;
                user.password = MetabaseUtils.generatePassword();
            }

            // create the user
            this.props.createUser(user);

            // carry on
            this.props.showModal({
                type: modal,
                details: {
                    user: user
                }
            });
        }
    }

    onEditDetails(user) {
        // close the modal no matter what
        this.props.showModal(null);

        if (user) {
            this.props.updateUser(user);
        }
    }

    onPasswordResetConfirm(user) {
        if (MetabaseSettings.isEmailConfigured()) {
            // trigger password reset email
            this.props.resetPasswordViaEmail(user);

            // show confirmation modal
            this.props.showModal({
                type: MODAL_RESET_PASSWORD_EMAIL,
                details: {user: user}
            });

        } else {
            // generate a password
            const password = MetabaseUtils.generatePassword(14, MetabaseSettings.get('password_complexity'));

            // trigger the reset
            this.props.resetPasswordManually(user, password);

            // show confirmation modal
            this.props.showModal({
                type: MODAL_RESET_PASSWORD_MANUAL,
                details: {password: password, user: user}
            });
        }
    }

    onRemoveUserConfirm(user) {
        this.props.showModal(null);
        this.props.deleteUser(user);
    }

    onCloseModal = () => {
        this.props.showModal(null);
    }

    renderAddPersonModal(modalDetails) {
        return (
            <Modal title="新增用户" onClose={this.onCloseModal}>
                <EditUserForm
                    buttonText="新增用户"
                    submitFn={this.onAddPerson.bind(this)}
                    groups={this.props.groups}
                />
            </Modal>
        );
    }

    renderEditDetailsModal(modalDetails) {
        let { user } = modalDetails;

        return (
            <Modal full form title="编辑详情" onClose={this.onCloseModal}>
                <EditUserForm
                    user={user}
                    submitFn={this.onEditDetails.bind(this)}
                />
            </Modal>
        );
    }

    renderUserAddedWithPasswordModal(modalDetails) {
        let { user } = modalDetails;

        return (
            <Modal small
                title={user.first_name+" 已存在，请不要重复添加"}
                footer={[
                    <Button onClick={() => this.props.showModal({type: MODAL_ADD_PERSON})}>再次新增用户</Button>,
                    <Button primary onClick={this.onCloseModal}>确认</Button>
                ]}
                onClose={this.onCloseModal}
            >
                <div className="px4 pb4">
                    <div className="pb4">我们暂时无法通过email发送账户信息,
                    请确保将此账户 <span className="text-bold">{user.email} </span>
                    及密码抄录给这位用户:</div>

                    <PasswordReveal password={user.password} />

                    <div style={{paddingLeft: "5em", paddingRight: "5em"}} className="pt4 text-centered">
                    如果您希望通过发送账户信息, 您只需要 <Link to="/admin/settings/email" className="link text-bold">Email 设置</Link> 来完成设定。
                    </div>
                </div>
            </Modal>
        );
    }

    renderUserAddedWithInviteModal(modalDetails) {
        let { user } = modalDetails;

        return (
            <Modal small
                title={user.first_name+" 添加成功"}
                footer={[
                    <Button onClick={() => this.props.showModal({type: MODAL_ADD_PERSON})}>继续新增用户</Button>,
                    <Button primary onClick={this.onCloseModal}>确认</Button>
                ]}
                onClose={this.onCloseModal}
            >
                <div style={{paddingLeft: "5em", paddingRight: "5em"}} className="pb4">We’ve sent an invite to <span className="text-bold">{user.email}</span> with instructions to set their password.</div>
            </Modal>
        );
    }

    renderInviteResentModal(modalDetails) {
        let { user } = modalDetails;

        return (
            <Modal small form
                title={"We've Re-sent "+user.first_name+"'s Invite"}
                footer={[
                    <Button primary onClick={this.onCloseModal}>确认</Button>
                ]}
                onClose={this.onCloseModal}
            >
                <div>此前发出的所有邮件邀请将失效</div>
            </Modal>
        );
    }

    renderRemoveUserModal(modalDetails) {
        let { user } = modalDetails;

        return (
            <Modal small
                title={"Remove "+user.common_name}
                footer={[
                    <Button onClick={this.onCloseModal}>取消</Button>,
                    <Button warning onClick={() => this.onRemoveUserConfirm(user)}>Remove</Button>
                ]}
                onClose={this.onCloseModal}
            >
                <div className="px4 pb4">
                    确认是否进行此操作？ {user.first_name}将不能再登录，此操作不可撤销。
                </div>
            </Modal>
        );
    }

    renderResetPasswordModal(modalDetails) {
        let { user } = modalDetails;

        return (
            <Modal small
                title={"Reset "+user.first_name+"'s Password"}
                footer={[
                    <Button onClick={this.onCloseModal}>取消</Button>,
                    <Button warning onClick={() => this.onPasswordResetConfirm(user)}>重置</Button>
                ]}
                onClose={this.onCloseModal}
            >
                <div className="px4 pb4">
                    确认此操作？
                </div>
            </Modal>
        );
    }

    renderPasswordResetManuallyModal(modalDetails) {
        let { user, password } = modalDetails;

        return (
            <Modal small
                title={user.first_name+"'s Password Has Been Reset"}
                footer={<button className="Button Button--primary mr2" onClick={this.onCloseModal}>Done</button>}
                onClose={this.onCloseModal}
            >
                <div className="px4 pb4">
                    <span className="pb3 block">这是一个临时密码，用户可以此登陆并修改密码。</span>

                    <PasswordReveal password={password} />
                </div>
            </Modal>
        );
    }

    renderPasswordResetViaEmailModal(modalDetails) {
        let { user } = modalDetails;

        return (
            <Modal
                small
                title={user.first_name+"'s Password Has Been Reset"}
                footer={<Button primary onClick={this.onCloseModal}>Done</Button>}
                onClose={this.onCloseModal}
            >
                <div className="px4 pb4">We've sent them an email with instructions for creating a new password.</div>
            </Modal>
        );
    }

    renderModal(modalType, modalDetails) {

        switch(modalType) {
            case MODAL_ADD_PERSON:               return this.renderAddPersonModal(modalDetails);
            case MODAL_EDIT_DETAILS:             return this.renderEditDetailsModal(modalDetails);
            case MODAL_USER_ADDED_WITH_PASSWORD: return this.renderUserAddedWithPasswordModal(modalDetails);
            case MODAL_USER_ADDED_WITH_INVITE:   return this.renderUserAddedWithInviteModal(modalDetails);
            case MODAL_INVITE_RESENT:            return this.renderInviteResentModal(modalDetails);
            case MODAL_REMOVE_USER:              return this.renderRemoveUserModal(modalDetails);
            case MODAL_RESET_PASSWORD:           return this.renderResetPasswordModal(modalDetails);
            case MODAL_RESET_PASSWORD_MANUAL:    return this.renderPasswordResetManuallyModal(modalDetails);
            case MODAL_RESET_PASSWORD_EMAIL:     return this.renderPasswordResetViaEmailModal(modalDetails);
        }

        return null;
    }

    render() {
        let { modal, users, groups } = this.props;
        let { error } = this.state;

        users = _.values(users).sort((a, b) => (b.date_joined - a.date_joined));

        return (
            <LoadingAndErrorWrapper loading={!users} error={error}>
            {() =>
                <AdminPaneLayout
                    title="用户"
                    buttonText="新增用户"
                    buttonAction={() => this.props.showModal({type: MODAL_ADD_PERSON})}
                >
                    <section className="pb4">
                        <table className="ContentTable">
                            <thead>
                                <tr>
                                    <th>用户名</th>
                                    <th></th>
                                    <th>Email</th>
                                    <th>用户组</th>
                                    <th>上次登陆</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { users.map(user =>
                                <tr key={user.id}>
                                    <td><span className="text-white inline-block"><UserAvatar background={(user.is_superuser) ? "bg-purple" : "bg-brand"} user={user} /></span> <span className="ml2 text-bold">{user.common_name}</span></td>
                                    <td>
                                      {user.google_auth ?
                                        <Tooltip tooltip="Signed up via Google">
                                            <Icon name='google' />
                                        </Tooltip> : null}
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <UserGroupSelect
                                            user={user}
                                            groups={groups}
                                            createMembership={this.props.createMembership}
                                            deleteMembership={this.props.deleteMembership}
                                        />
                                    </td>
                                    <td>{ user.last_login ? user.last_login.fromNow() : "Never" }</td>
                                    <td className="text-right">
                                        <UserActionsSelect user={user} showModal={this.props.showModal} resendInvite={this.props.resendInvite} isActiveUser={this.props.user.id === user.id} />
                                    </td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </section>
                    { modal ? this.renderModal(modal.type, modal.details) : null }
                </AdminPaneLayout>
            }
            </LoadingAndErrorWrapper>
        );
    }
}
