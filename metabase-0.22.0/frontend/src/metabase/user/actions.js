import { createAction } from "redux-actions";

import { createThunkAction } from "metabase/lib/redux";

import { UserApi } from "metabase/services";

import { refreshCurrentUser } from "metabase/user";

// action constants
export const CHANGE_TAB = 'CHANGE_TAB';
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const UPDATE_USER = 'UPDATE_USER';


// action creators

export const setTab = createAction(CHANGE_TAB);

export const updatePassword = createThunkAction(UPDATE_PASSWORD, function(user_id, new_password, current_password) {
    return async function(dispatch, getState) {
        try {
            await UserApi.update_password({
                id: user_id,
                password: new_password,
                old_password: current_password
            });

            return {
                success: true,
                data:{
                    message: "密码更新成功!"
                }
            };

        } catch(error) {
            return error;
        }
    };
});

export const updateUser = createThunkAction(UPDATE_USER, function(user) {
    return async function(dispatch, getState) {
        try {
            await UserApi.update(user);

            dispatch(refreshCurrentUser());

            return {
                success: true,
                data:{
                    message: "账户更新成功!"
                }
            };

        } catch(error) {
            return error;
        }
    };
});
