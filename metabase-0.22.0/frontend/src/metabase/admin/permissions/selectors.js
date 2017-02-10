/* @flow weak */

import { createSelector } from 'reselect';

import { push } from "react-router-redux";

import Metadata from "metabase/meta/metadata/Metadata";
import MetabaseAnalytics from "metabase/lib/analytics";

import type { DatabaseId } from "metabase/meta/types/Database";
import type { SchemaName } from "metabase/meta/types/Table";
import type { Group, GroupsPermissions } from "metabase/meta/types/Permissions";

import { isDefaultGroup, isAdminGroup, isMetaBotGroup } from "metabase/lib/groups";
import _ from "underscore";
import { getIn, assocIn } from "icepick";

import {
    getNativePermission,
    getSchemasPermission,
    getTablesPermission,
    getFieldsPermission,
    updateFieldsPermission,
    updateTablesPermission,
    updateSchemasPermission,
    updateNativePermission,
    diffPermissions,
} from "metabase/lib/permissions";

const getPermissions = (state) => state.permissions.permissions;
const getOriginalPermissions = (state) => state.permissions.originalPermissions;

const getDatabaseId = (state, props) => props.params.databaseId ? parseInt(props.params.databaseId) : null
const getSchemaName = (state, props) => props.params.schemaName

const getMetadata = createSelector(
    [(state) => state.permissions.databases],
    (databases) => databases && new Metadata(databases)
);

// reorder groups to be in this order
const SPECIAL_GROUP_FILTERS = [isAdminGroup, isDefaultGroup, isMetaBotGroup].reverse();

function getTooltipForGroup(group) {
    if (isAdminGroup(group)) {
        return "Administrators总是有最高级别的权限，能访问DataUltra BI的一切。"
    } else if (isDefaultGroup(group)) {
        return "每个DataUltra BI用户都属于All Users用户组。如果要限制或限制组的访问权限，请确保所有用户组具有相等或较低的访问权限。";
    } else if (isMetaBotGroup(group)) {
        return "DataUltra BIbot DataUltra BI的源数据管控服务，您可以设置他具体访问哪些数据。";
    }
    return null;
}

export const getGroups = createSelector(
    (state) => state.permissions.groups,
    (groups) => {
        let orderedGroups = groups ? [...groups] : [];
        for (let groupFilter of SPECIAL_GROUP_FILTERS) {
            let index = _.findIndex(orderedGroups, groupFilter);
            if (index >= 0) {
                orderedGroups.unshift(...orderedGroups.splice(index, 1))
            }
        }
        return orderedGroups.map(group => ({
            ...group,
            tooltip: getTooltipForGroup(group)
        }))
    }
);

export const getIsDirty = createSelector(
    getPermissions, getOriginalPermissions,
    (permissions, originalPermissions) =>
        JSON.stringify(permissions) !== JSON.stringify(originalPermissions)
)

export const getSaveError = (state) => state.permissions.saveError;


// these are all the permission levels ordered by level of access
const PERM_LEVELS = ["write", "read", "all", "controlled", "none"];
function hasGreaterPermissions(a, b) {
    return (PERM_LEVELS.indexOf(a) - PERM_LEVELS.indexOf(b)) < 0
}

function getPermissionWarning(getter, entityType, defaultGroup, permissions, groupId, entityId, value) {
    if (!defaultGroup || groupId === defaultGroup.id) {
        return null;
    }
    let perm = value || getter(permissions, groupId, entityId);
    let defaultPerm = getter(permissions, defaultGroup.id, entityId);
    if (perm === "controlled" && defaultPerm === "controlled") {
        return `警告："${defaultGroup.name}" 用户组在 ${entityType} 项上的权限设置与此处有差异,这将是您的此项设置不能完全正确工作。 `;
    }
    if (hasGreaterPermissions(defaultPerm, perm)) {
        return `警告："${defaultGroup.name}" 用户组对此项目拥有更高的权限，这将导致您对当前组做的设置被更高级的权限所覆盖。建议您修改"${defaultGroup.name}" 的相应权限。`;

    }
    return null;
}

function getPermissionWarningModal(entityType, getter, defaultGroup, permissions, groupId, entityId, value) {
    let permissionWarning = getPermissionWarning(entityType, getter, defaultGroup, permissions, groupId, entityId, value);
    if (permissionWarning) {
        return {
            title: `${value === "controlled" ? "限制" : "撤销"} 访问, 当前 "${defaultGroup.name}" 用户组拥有更高的访问权限?`,
            message: permissionWarning,
            confirmButtonText: (value === "controlled" ? "限制" : "撤销") + " 访问",
            cancelButtonText: "取消"
        };
    }
}

function getControlledDatabaseWarningModal(permissions, groupId, entityId) {
    if (getSchemasPermission(permissions, groupId, entityId) !== "controlled") {
        return {
            title: "变更数据库访问设置",
            confirmButtonText: "确认",
            cancelButtonText: "取消"
        };
    }
}

function getRawQueryWarningModal(permissions, groupId, entityId, value) {
    if (value === "write" &&
        getNativePermission(permissions, groupId, entityId) !== "write" &&
        getSchemasPermission(permissions, groupId, entityId) !== "all"
    ) {
        return {
            title: "允许对源数据查询的写入？",
            message: "这也将改变该组对数据库的访问权限。",
            confirmButtonText: "确认",
            cancelButtonText: "取消"
        };
    }
}

const OPTION_GREEN = {
    icon: "check",
    iconColor: "#9CC177",
    bgColor: "#F6F9F2"
};
const OPTION_YELLOW = {
    icon: "eye",
    iconColor: "#F9D45C",
    bgColor: "#FEFAEE"
};
const OPTION_RED = {
    icon: "close",
    iconColor: "#EEA5A5",
    bgColor: "#FDF3F3"
};


const OPTION_ALL = {
    ...OPTION_GREEN,
    value: "all",
    title: "Grant unrestricted access",
    tooltip: "无访问限制",
};

const OPTION_CONTROLLED = {
    ...OPTION_YELLOW,
    value: "controlled",
    title: "限制访问",
    tooltip: "限制访问",
    icon: "permissionsLimited",
};

const OPTION_NONE = {
    ...OPTION_RED,
    value: "none",
    title: "禁止访问",
    tooltip: "禁止访问",
};

const OPTION_NATIVE_WRITE = {
    ...OPTION_GREEN,
    value: "write",
    title: "Write raw queries",
    tooltip: "可新增查询",
    icon: "sql",
};

const OPTION_NATIVE_READ = {
    ...OPTION_YELLOW,
    value: "read",
    title: "View raw queries",
    tooltip: "可查看查询",
};

const OPTION_COLLECTION_WRITE = {
    ...OPTION_GREEN,
    value: "write",
    title: "Curate collection",
    tooltip: "能对此分类新增或移除查询",
};

const OPTION_COLLECTION_READ = {
    ...OPTION_YELLOW,
    value: "read",
    title: "View collection",
    tooltip: "能查看此分类中的查询",
};

export const getTablesPermissionsGrid = createSelector(
    getMetadata, getGroups, getPermissions, getDatabaseId, getSchemaName,
    (metadata: Metadata, groups: Array<Group>, permissions: GroupsPermissions, databaseId: DatabaseId, schemaName: SchemaName) => {
        const database = metadata && metadata.database(databaseId);

        if (!groups || !permissions || !metadata || !database) {
            return null;
        }

        const tables = database.tablesInSchema(schemaName || null);
        const defaultGroup = _.find(groups, isDefaultGroup);

        return {
            type: "table",
            crumbs: database.schemaNames().length > 1 ? [
                ["Databases", "/admin/permissions/databases"],
                [database.name, "/admin/permissions/databases/"+database.id+"/schemas"],
                [schemaName]
            ] : [
                ["Databases", "/admin/permissions/databases"],
                [database.name],
            ],
            groups,
            permissions: {
                "fields": {
                    header: "数据访问",
                    options(groupId, entityId) {
                        return [OPTION_ALL, OPTION_NONE]
                    },
                    getter(groupId, entityId) {
                        return getFieldsPermission(permissions, groupId, entityId);
                    },
                    updater(groupId, entityId, value) {
                        MetabaseAnalytics.trackEvent("Permissions", "fields", value);
                        return updateFieldsPermission(permissions, groupId, entityId, value, metadata);
                    },
                    confirm(groupId, entityId, value) {
                        return [
                            getPermissionWarningModal(getFieldsPermission, "fields", defaultGroup, permissions, groupId, entityId, value),
                            getControlledDatabaseWarningModal(permissions, groupId, entityId)
                        ];
                    },
                    warning(groupId, entityId) {
                        return getPermissionWarning(getFieldsPermission, "fields", defaultGroup, permissions, groupId, entityId);
                    }
                }
            },
            entities: tables.map(table => ({
                id: {
                    databaseId: databaseId,
                    schemaName: schemaName,
                    tableId: table.id
                },
                name: table.display_name,
                subtitle: table.name
            }))
        };
    }
);

export const getSchemasPermissionsGrid = createSelector(
    getMetadata, getGroups, getPermissions, getDatabaseId,
    (metadata: Metadata, groups: Array<Group>, permissions: GroupsPermissions, databaseId: DatabaseId) => {
        const database = metadata && metadata.database(databaseId);

        if (!groups || !permissions || !metadata || !database) {
            return null;
        }

        const schemaNames = database.schemaNames();
        const defaultGroup = _.find(groups, isDefaultGroup);

        return {
            type: "schema",
            crumbs: [
                ["Databases", "/admin/permissions/databases"],
                [database.name],
            ],
            groups,
            permissions: {
                header: "数据访问",
                "tables": {
                    options(groupId, entityId) {
                        return [OPTION_ALL, OPTION_CONTROLLED, OPTION_NONE]
                    },
                    getter(groupId, entityId) {
                        return getTablesPermission(permissions, groupId, entityId);
                    },
                    updater(groupId, entityId, value) {
                        MetabaseAnalytics.trackEvent("Permissions", "tables", value);
                        return updateTablesPermission(permissions, groupId, entityId, value, metadata);
                    },
                    postAction(groupId, { databaseId, schemaName }, value) {
                        if (value === "controlled") {
                            return push(`/admin/permissions/databases/${databaseId}/schemas/${encodeURIComponent(schemaName)}/tables`);
                        }
                    },
                    confirm(groupId, entityId, value) {
                        return [
                            getPermissionWarningModal(getTablesPermission, "tables", defaultGroup, permissions, groupId, entityId, value),
                            getControlledDatabaseWarningModal(permissions, groupId, entityId)
                        ];
                    },
                    warning(groupId, entityId) {
                        return getPermissionWarning(getTablesPermission, "tables", defaultGroup, permissions, groupId, entityId);
                    }
                }
            },
            entities: schemaNames.map(schemaName => ({
                id: {
                    databaseId,
                    schemaName
                },
                name: schemaName,
                link: { name: "查看表", url: `/admin/permissions/databases/${databaseId}/schemas/${encodeURIComponent(schemaName)}/tables`}
            }))
        }
    }
);

export const getDatabasesPermissionsGrid = createSelector(
    getMetadata, getGroups, getPermissions,
    (metadata: Metadata, groups: Array<Group>, permissions: GroupsPermissions) => {
        if (!groups || !permissions || !metadata) {
            return null;
        }

        const databases = metadata.databases();
        const defaultGroup = _.find(groups, isDefaultGroup);

        return {
            type: "database",
            groups,
            permissions: {
                "schemas": {
                    header: "数据访问",
                    options(groupId, entityId) {
                        return [OPTION_ALL, OPTION_CONTROLLED, OPTION_NONE]
                    },
                    getter(groupId, entityId) {
                        return getSchemasPermission(permissions, groupId, entityId);
                    },
                    updater(groupId, entityId, value) {
                        MetabaseAnalytics.trackEvent("Permissions", "schemas", value);
                        return updateSchemasPermission(permissions, groupId, entityId, value, metadata)
                    },
                    postAction(groupId, { databaseId }, value) {
                        if (value === "controlled") {
                            let database = metadata.database(databaseId);
                            let schemas = database ? database.schemaNames() : [];
                            if (schemas.length === 0 || (schemas.length === 1 && schemas[0] === "")) {
                                return push(`/admin/permissions/databases/${databaseId}/tables`);
                            } else if (schemas.length === 1) {
                                return push(`/admin/permissions/databases/${databaseId}/schemas/${schemas[0]}/tables`);
                            } else {
                                return push(`/admin/permissions/databases/${databaseId}/schemas`);
                            }
                        }
                    },
                    confirm(groupId, entityId, value) {
                        return [
                            getPermissionWarningModal(getSchemasPermission, "schemas", defaultGroup, permissions, groupId, entityId, value)
                        ];
                    },
                    warning(groupId, entityId) {
                        return getPermissionWarning(getSchemasPermission, "schemas", defaultGroup, permissions, groupId, entityId);
                    }
                },
                "native": {
                    header: "SQL查询",
                    options(groupId, entityId) {
                        if (getSchemasPermission(permissions, groupId, entityId) === "none") {
                            return [OPTION_NONE];
                        } else {
                            return [OPTION_NATIVE_WRITE, OPTION_NATIVE_READ, OPTION_NONE];
                        }
                    },
                    getter(groupId, entityId) {
                        return getNativePermission(permissions, groupId, entityId);
                    },
                    updater(groupId, entityId, value) {
                        MetabaseAnalytics.trackEvent("Permissions", "native", value);
                        return updateNativePermission(permissions, groupId, entityId, value, metadata);
                    },
                    confirm(groupId, entityId, value) {
                        return [
                            getPermissionWarningModal(getNativePermission, null, defaultGroup, permissions, groupId, entityId, value),
                            getRawQueryWarningModal(permissions, groupId, entityId, value)
                        ];
                    },
                    warning(groupId, entityId) {
                        return getPermissionWarning(getNativePermission, null, defaultGroup, permissions, groupId, entityId);
                    }
                },
            },
            entities: databases.map(database => {
                let schemas = database.schemaNames();
                return {
                    id: {
                        databaseId: database.id
                    },
                    name: database.name,
                    link:
                        schemas.length === 0 || (schemas.length === 1 && schemas[0] === "") ?
                            { name: "View tables", url: `/admin/permissions/databases/${database.id}/tables` }
                        : schemas.length === 1 ?
                            { name: "View tables", url: `/admin/permissions/databases/${database.id}/schemas/${schemas[0]}/tables` }
                        :
                            { name: "View schemas", url: `/admin/permissions/databases/${database.id}/schemas`}
                }
            })
        }
    }
);

const getCollections = (state) => state.permissions.collections;
const getCollectionPermission = (permissions, groupId, { collectionId }) =>
    getIn(permissions, [groupId, collectionId])

export const getCollectionsPermissionsGrid = createSelector(
    getCollections, getGroups, getPermissions,
    (collections, groups: Array<Group>, permissions: GroupsPermissions) => {
        if (!groups || !permissions || !collections) {
            return null;
        }

        const defaultGroup = _.find(groups, isDefaultGroup);

        return {
            type: "collection",
            groups,
            permissions: {
                "access": {
                    options(groupId, entityId) {
                        return [OPTION_COLLECTION_WRITE, OPTION_COLLECTION_READ, OPTION_NONE];
                    },
                    getter(groupId, entityId) {
                        return getCollectionPermission(permissions, groupId, entityId);
                    },
                    updater(groupId, { collectionId }, value) {
                        return assocIn(permissions, [groupId, collectionId], value);
                    },
                    confirm(groupId, entityId, value) {
                        return [
                            getPermissionWarningModal(getCollectionPermission, null, defaultGroup, permissions, groupId, entityId, value)
                        ];
                    },
                    warning(groupId, entityId) {
                        return getPermissionWarning(getCollectionPermission, null, defaultGroup, permissions, groupId, entityId);
                    }
                },
            },
            entities: collections.map(collection => {
                return {
                    id: {
                        collectionId: collection.id
                    },
                    name: collection.name
                }
            })
        }
    }
);


export const getDiff = createSelector(
    getMetadata, getGroups, getPermissions, getOriginalPermissions,
    (metadata: Metadata, groups: Array<Group>, permissions: GroupsPermissions, originalPermissions: GroupsPermissions) =>
        diffPermissions(permissions, originalPermissions, groups, metadata)
);
