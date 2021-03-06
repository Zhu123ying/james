import React, { Component, PropTypes } from "react";

import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper.jsx";
import Confirm from "metabase/components/Confirm.jsx";
import Modal from "metabase/components/Modal.jsx";
import PermissionsGrid from "../components/PermissionsGrid.jsx";
import PermissionsConfirm from "../components/PermissionsConfirm.jsx";
import EditBar from "metabase/components/EditBar.jsx";
import Breadcrumbs from "metabase/components/Breadcrumbs.jsx";
import Button from "metabase/components/Button";

import cx from "classnames";

import _ from "underscore";

const PermissionsEditor = ({ title = "查询权限", modal, admin, grid, onUpdatePermission, onSave, onCancel, confirmCancel, isDirty, saveError, diff, location }) => {
    const saveButton =
        <Confirm
            title="保存权限设置?"
            action={onSave}
            content={<PermissionsConfirm diff={diff} />}
            triggerClasses={cx({ disabled: !isDirty })}
        >
            <Button primary small={!modal}>确认</Button>
        </Confirm>;

    const cancelButton = confirmCancel ?
        <Confirm
            title="放弃变更？"
            action={onCancel}
            content="变更操作将不会被执行"
        >
            <Button small={!modal}>取消</Button>
        </Confirm>
    :
        <Button small={!modal} onClick={onCancel}>取消</Button>;

    return (
        <LoadingAndErrorWrapper loading={!grid} className="flex-full flex flex-column">
        { () => // eslint-disable-line react/display-name
        modal ?
            <Modal inline title={title} footer={[cancelButton, saveButton]} onClose={onCancel}>
                <PermissionsGrid
                    className="flex-full"
                    grid={grid}
                    onUpdatePermission={onUpdatePermission}
                    {...getEntityAndGroupIdFromLocation(location)}
                />
            </Modal>
        :
            <div className="flex-full flex flex-column">
                { isDirty &&
                    <EditBar
                        admin={admin}
                        title="您变更了权限设置."
                        buttons={[cancelButton, saveButton]}
                    />
                }
                <div className="wrapper pt2">
                    { grid && grid.crumbs ?
                        <Breadcrumbs className="py1" crumbs={grid.crumbs} />
                    :
                        <h2>{title}</h2>
                    }
                </div>
                <PermissionsGrid
                    className="flex-full"
                    grid={grid}
                    onUpdatePermission={onUpdatePermission}
                    {...getEntityAndGroupIdFromLocation(location)}
                />
            </div>
        }
        </LoadingAndErrorWrapper>
    )
}

PermissionsEditor.defaultProps = {
    admin: true
}

function getEntityAndGroupIdFromLocation({ query = {}} = {}) {
    query = _.mapObject(query, (value) => isNaN(value) ? value : parseFloat(value));
    const entityId = _.omit(query, "groupId");
    const groupId = query.groupId;
    return {
        groupId: groupId || null,
        entityId: Object.keys(entityId).length > 0 ? entityId : null
    };
}

export default PermissionsEditor;
