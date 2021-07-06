import store from '../store'
import { GET_USER_PERMISSION } from '~/redux/actionTypes'
import * as cache from '~/utils/cache'

// 获取用户权限
export const getUserPermission = () => {
    let permissions = [...cache.getPermissions(), ...cache.getAuthenticatedLicenseData()]
    let permissionObject = {}
    permissions.forEach(key => {
        permissionObject[key] = key
    })
    console.log(permissions)
    console.log(permissionObject)

    store.dispatch({
        action: GET_USER_PERMISSION,
        permission: permissionObject
    })
}