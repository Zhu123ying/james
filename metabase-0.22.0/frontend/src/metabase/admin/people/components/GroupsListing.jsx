import React, { Component } from "react";
import { Link } from "react-router";

import _ from "underscore";
import cx from "classnames";

import MetabaseAnalytics from "metabase/lib/analytics";
import { isDefaultGroup, isAdminGroup } from "metabase/lib/groups";

import { PermissionsApi } from "metabase/services";

import Icon from "metabase/components/Icon.jsx";
import Input from "metabase/components/Input.jsx";
import ModalContent from "metabase/components/ModalContent.jsx";
import Alert from "metabase/components/Alert.jsx";
import ModalWithTrigger from "metabase/components/ModalWithTrigger.jsx";
import PopoverWithTrigger from "metabase/components/PopoverWithTrigger.jsx";
import UserAvatar from "metabase/components/UserAvatar.jsx";

import AdminContentTable from "metabase/components/AdminContentTable.jsx";
import AdminPaneLayout from "metabase/components/AdminPaneLayout.jsx";

import AddRow from "./AddRow.jsx";

// ------------------------------------------------------------ Add Group ------------------------------------------------------------

function AddGroupRow({ text, onCancelClicked, onCreateClicked, onTextChange }) {
    const textIsValid = text && text.length;
    return (
        <tr>
            <td colSpan="3" style={{ padding: 0 }}>
                <AddRow
                    value={text}
                    isValid={textIsValid}
                    placeholder="请输入用户组名称"
                    onChange={(e) => onTextChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                            onCreateClicked();
                        }
                    }}
                    onDone={onCreateClicked}
                    onCancel={onCancelClicked}
                />
            </td>
        </tr>
    );
}


// ------------------------------------------------------------ Groups Table: editing ------------------------------------------------------------

function DeleteGroupModal({ group, onConfirm = () => {} , onClose = () => {} }) {
    return (
        <ModalContent title="移除用户组?" onClose={onClose}>
            <p className="px4 pb4">
                请确认，此组的所有成员将丢失基于此组的任何权限设置。此操作无法撤销。
            </p>
            <div className="Form-actions">
                <button className="Button Button--danger" onClick={() => { onClose(); onConfirm(group); }}>
                    确认
                </button>
                <button className="Button ml1" onClick={onClose}>
                    取消
                </button>
            </div>
        </ModalContent>
    );
}

function ActionsPopover({ group, onEditGroupClicked, onDeleteGroupClicked }) {
    return (
        <PopoverWithTrigger className="block" triggerElement={<Icon className="text-grey-1" name="ellipsis" />}>
            <ul className="UserActionsSelect">
                <li className="pt1 pb2 px2 bg-brand-hover text-white-hover cursor-pointer" onClick={onEditGroupClicked.bind(null, group)}>
                    编辑名称
                </li>
                <li className="pt1 pb2 px2 bg-brand-hover text-white-hover cursor-pointer text-error">
                    <ModalWithTrigger triggerElement="移除用户组">
                        <DeleteGroupModal group={group} onConfirm={onDeleteGroupClicked} />
                    </ModalWithTrigger>
                </li>
            </ul>
        </PopoverWithTrigger>
    )
}

function EditingGroupRow({ group, textHasChanged, onTextChange, onCancelClicked, onDoneClicked }) {
    const textIsValid = group.name && group.name.length;
    return (
        <tr className="bordered border-brand rounded">
            <td>
                <Input className="AdminInput h3" type="text" autoFocus={true} value={group.name}
                       onChange={(e) => onTextChange(e.target.value)}
                />
            </td>
            <td />
            <td className="text-right">
                <span className="link no-decoration cursor-pointer" onClick={onCancelClicked}>
                    取消
                </span>
                <button className={cx("Button ml2", {"Button--primary": textIsValid && textHasChanged})} disabled={!textIsValid || !textHasChanged} onClick={onDoneClicked}>
                    确认
                </button>
            </td>
        </tr>
    )
}


// ------------------------------------------------------------ Groups Table: not editing ------------------------------------------------------------

const COLORS = ['bg-error', 'bg-purple', 'bg-brand', 'bg-gold', 'bg-green'];

function GroupRow({ group, groupBeingEdited, index, showGroupDetail, showAddGroupRow, onEditGroupClicked, onDeleteGroupClicked,
                    onEditGroupTextChange, onEditGroupCancelClicked, onEditGroupDoneClicked }) {
    const color  = COLORS[(index % COLORS.length)];
    const showActionsButton = !isDefaultGroup(group) && !isAdminGroup(group);
    const editing = groupBeingEdited && groupBeingEdited.id === group.id;

    return editing ? (
        <EditingGroupRow group={groupBeingEdited} textHasChanged={group.name !== groupBeingEdited.name} onTextChange={onEditGroupTextChange}
                         onCancelClicked={onEditGroupCancelClicked} onDoneClicked={onEditGroupDoneClicked}
        />
    ) : (
        <tr>
            <td>
                <Link to={"/admin/people/groups/" + group.id} className="link no-decoration">
                    <span className="text-white inline-block">
                        <UserAvatar background={color} user={{first_name: group.name}} />
                    </span>
                    <span className="ml2 text-bold forgroupName">
                        {group.name}
                    </span>
                </Link>
            </td>
            <td>
                {group.members || 0}
            </td>
            <td className="text-right">
                {showActionsButton ? (
                     <ActionsPopover group={group} onEditGroupClicked={onEditGroupClicked} onDeleteGroupClicked={onDeleteGroupClicked} />
                 ) : null}
            </td>
        </tr>
    );
}

function GroupsTable({ groups, text, groupBeingEdited, showAddGroupRow, onAddGroupCanceled, onAddGroupCreateButtonClicked, onAddGroupTextChanged,
                       onEditGroupClicked, onDeleteGroupClicked, onEditGroupTextChange, onEditGroupCancelClicked, onEditGroupDoneClicked }) {

    return (
        <AdminContentTable columnTitles={["名称", "用户数"]}>
            {showAddGroupRow ? (
                 <AddGroupRow text={text} onCancelClicked={onAddGroupCanceled} onCreateClicked={onAddGroupCreateButtonClicked} onTextChange={onAddGroupTextChanged} />
             ) : null}
            {groups && groups.map((group, index) =>
                <GroupRow key={group.id} group={group} index={index} groupBeingEdited={groupBeingEdited}
                          onEditGroupClicked={onEditGroupClicked}
                          onDeleteGroupClicked={onDeleteGroupClicked}
                          onEditGroupTextChange={onEditGroupTextChange}
                          onEditGroupCancelClicked={onEditGroupCancelClicked}
                          onEditGroupDoneClicked={onEditGroupDoneClicked}
                />
             )}
        </AdminContentTable>
    );
}


// ------------------------------------------------------------ Logic ------------------------------------------------------------

function sortGroups(groups) {
    return _.sortBy(groups, (group) => group.name && group.name.toLowerCase());
}

export default class GroupsListing extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: "",
            showAddGroupRow: false,
            groups: null,
            groupBeingEdited: null,
            alertMessage: null,
        };
    }

    alert(alertMessage) {
        this.setState({ alertMessage });
    }

    onAddGroupCanceled() {
        this.setState({
            showAddGroupRow: false
        });
    }

    // TODO: move this to Redux
    onAddGroupCreateButtonClicked() {
        MetabaseAnalytics.trackEvent("People Groups", "Group Added");
        PermissionsApi.createGroup({name: this.state.text}).then((newGroup) => {
            const groups = this.state.groups || this.props.groups || [];
            const newGroups = sortGroups(_.union(groups, [newGroup]));

            this.setState({
                groups: newGroups,
                showAddGroupRow: false,
                text: ""
            });
        }, (error) => {
            console.error('Error creating group:', error);
            if (error.data && typeof error.data === "string") this.alert(error.data);
        });
    }

    onAddGroupTextChanged(newText) {
        this.setState({
            text: newText
        });
    }

    onCreateAGroupButtonClicked() {
        this.setState({
            text: "",
            showAddGroupRow: true,
            groupBeingEdited: null
        });
    }

    onEditGroupClicked(group) {
        this.setState({
            groupBeingEdited: _.clone(group),
            text: "",
            showAddGroupRow: false
        });
    }

    onEditGroupTextChange(newText) {
        let groupBeingEdited = this.state.groupBeingEdited;
        groupBeingEdited.name = newText;

        this.setState({
            groupBeingEdited: groupBeingEdited
        });
    }

    onEditGroupCancelClicked() {
        this.setState({
            groupBeingEdited: null
        });
    }

    // TODO: move this to Redux
    onEditGroupDoneClicked() {
        const groups = this.state.groups || this.props.groups || [];
        const originalGroup = _.findWhere(groups, {id: this.state.groupBeingEdited.id});
        const group = this.state.groupBeingEdited;

        // if name hasn't changed there is nothing to do
        if (originalGroup.name === group.name) {
            this.setState({
                groupBeingEdited: null
            });
            return;
        }

        // ok, fire off API call to change the group
        MetabaseAnalytics.trackEvent("People Groups", "Group Updated");
        PermissionsApi.updateGroup({id: group.id, name: group.name}).then((newGroup) => {
            // now replace the original group with the new group and update state
            let newGroups = _.reject(groups, (g) => g.id === group.id);
            newGroups = sortGroups(_.union(newGroups, [newGroup]));

            this.setState({
                groups: newGroups,
                groupBeingEdited: null
            });

        }, (error) => {
            console.error("Error updating group name:", error);
            if (error.data && typeof error.data === "string") this.alert(error.data);
        });
    }

    // TODO: move this to Redux
    async onDeleteGroupClicked(group) {
        const groups = this.state.groups || this.props.groups || [];
        MetabaseAnalytics.trackEvent("People Groups", "Group Deleted");
        PermissionsApi.deleteGroup({id: group.id}).then(() => {
            const newGroups = sortGroups(_.reject(groups, (g) => g.id === group.id));
            this.setState({
                groups: newGroups
            });
        }, (error) => {
            console.error("Error deleting group: ", error);
            if (error.data && typeof error.data === "string") this.alert(error.data);
        });
    }

    render() {
        const { alertMessage } = this.state;
        let { groups } = this.props;
        groups = this.state.groups || groups || [];

        return (
            <AdminPaneLayout
                title="用户组"
                buttonText="新增用户组"
                buttonAction={this.state.showAddGroupRow ? null : this.onCreateAGroupButtonClicked.bind(this)}
                description="用户组可以实现灵活赋权，管理员可以轻松控制各组用户对数据的访问权限。Administrators 及 ALL Users 用户组为默认用户组。"

            >
                <GroupsTable
                    groups={groups}
                    text={this.state.text}
                    showAddGroupRow={this.state.showAddGroupRow}
                    groupBeingEdited={this.state.groupBeingEdited}
                    onAddGroupCanceled={this.onAddGroupCanceled.bind(this)}
                    onAddGroupCreateButtonClicked={this.onAddGroupCreateButtonClicked.bind(this)}
                    onAddGroupTextChanged={this.onAddGroupTextChanged.bind(this)}
                    onEditGroupClicked={this.onEditGroupClicked.bind(this)}
                    onEditGroupTextChange={this.onEditGroupTextChange.bind(this)}
                    onEditGroupCancelClicked={this.onEditGroupCancelClicked.bind(this)}
                    onEditGroupDoneClicked={this.onEditGroupDoneClicked.bind(this)}
                    onDeleteGroupClicked={this.onDeleteGroupClicked.bind(this)}
                />
                <Alert message={alertMessage} onClose={() => this.setState({ alertMessage: null })} />
            </AdminPaneLayout>
        );
    }
}
