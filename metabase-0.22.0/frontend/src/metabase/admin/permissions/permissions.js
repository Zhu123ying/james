import { createAction, createThunkAction, handleActions, combineReducers } from "metabase/lib/redux";

import { canEditPermissions } from "metabase/lib/groups";
import MetabaseAnalytics from "metabase/lib/analytics";

import { MetabaseApi, PermissionsApi, CollectionsApi } from "metabase/services";

const RESET = "metabase/admin/permissions/RESET";
export const reset = createAction(RESET);

const INITIALIZE = "metabase/admin/permissions/INITIALIZE";
export const initialize = createThunkAction(INITIALIZE, (load, save) =>
    async (dispatch, getState) => {
        dispatch(reset({ load, save }));
        await Promise.all([
            dispatch(loadPermissions()),
            dispatch(loadGroups()),
        ]);
    }
);

// TODO: move these to their respective ducks
const LOAD_METADATA = "metabase/admin/permissions/LOAD_METADATA";
export const loadMetadata = createAction(LOAD_METADATA, () => MetabaseApi.db_list_with_tables());

// TODO: move these to their respective ducks
const LOAD_COLLECTIONS = "metabase/admin/permissions/LOAD_COLLECTIONS";
export const loadCollections = createAction(LOAD_COLLECTIONS, () => CollectionsApi.list());


const LOAD_GROUPS = "metabase/admin/permissions/LOAD_GROUPS";
export const loadGroups = createAction(LOAD_GROUPS, () => PermissionsApi.groups());

const LOAD_PERMISSIONS = "metabase/admin/permissions/LOAD_PERMISSIONS";
export const loadPermissions = createThunkAction(LOAD_PERMISSIONS, () =>
    async (dispatch, getState) => {
        const { load } = getState().permissions;
        return load();
    }
);

const UPDATE_PERMISSION = "metabase/admin/permissions/UPDATE_PERMISSION";
export const updatePermission = createThunkAction(UPDATE_PERMISSION, ({ groupId, entityId, value, updater, postAction }) =>
    async (dispatch, getState) => {
        if (postAction) {
            let action = postAction(groupId, entityId, value);
            if (action) {
                dispatch(action);
            }
        }
        return updater(groupId, entityId, value);
    }
);

const SAVE_PERMISSIONS = "metabase/admin/permissions/SAVE_PERMISSIONS";
export const savePermissions = createThunkAction(SAVE_PERMISSIONS, () =>
    async (dispatch, getState) => {
        MetabaseAnalytics.trackEvent("????????????", "??????");
        const { permissions, revision, save } = getState().permissions;
        let result = await save({
            revision: revision,
            groups: permissions
        });
        return result;
    }
)

const save = handleActions({
    [RESET]: { next: (state, { payload }) => payload.save }
}, null);
const load = handleActions({
    [RESET]: { next: (state, { payload }) => payload.load }
}, null);

const permissions = handleActions({
    [RESET]: { next: () => null },
    [LOAD_PERMISSIONS]: { next: (state, { payload }) => payload.groups },
    [SAVE_PERMISSIONS]: { next: (state, { payload }) => payload.groups },
    [UPDATE_PERMISSION]: { next: (state, { payload }) => payload }
}, null);

const originalPermissions = handleActions({
    [RESET]: { next: () => null },
    [LOAD_PERMISSIONS]: { next: (state, { payload }) => payload.groups },
    [SAVE_PERMISSIONS]: { next: (state, { payload }) => payload.groups },
}, null);

const revision = handleActions({
    [RESET]: { next: () => null },
    [LOAD_PERMISSIONS]: { next: (state, { payload }) => payload.revision },
    [SAVE_PERMISSIONS]: { next: (state, { payload }) => payload.revision },
}, null);

const groups = handleActions({
    [LOAD_GROUPS]: { next: (state, { payload }) =>
        payload && payload.map(group => ({
            ...group,
            editable: canEditPermissions(group)
        }))
    },
}, null);

const databases = handleActions({
    [LOAD_METADATA]: { next: (state, { payload }) => payload },
}, null);

const collections = handleActions({
    [LOAD_COLLECTIONS]: { next: (state, { payload }) => payload },
}, null);

const saveError = handleActions({
    [RESET]: { next: () => null },
    [SAVE_PERMISSIONS]: {
        next: (state) => null,
        throw: (state, { payload }) => (payload && typeof payload.data === "string" ? payload.data : payload.data.message) || "??????????????????????????????????????????"
    },
    [LOAD_PERMISSIONS]: {
        next: (state) => null,
    }
}, null);

export default combineReducers({
    save,
    load,

    permissions,
    originalPermissions,
    saveError,
    revision,
    groups,

    databases,
    collections
});
