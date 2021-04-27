import store from '../store'
import { GET_USER_PERMISSION } from '~/redux/actionTypes'

export const getUserPermission = (permissions = []) => {
    let permissionObject = {}
    permissions.forEach(key => {
        permissionObject[key] = key
    })
    store.dispatch({
        action: GET_USER_PERMISSION,
        permission: permissionObject
    })
}