/* eslint-disable */
import { PORTAL, SCOPE_TYPE, ENV_LOCALSTORAGE_KEY, ENV_TO_LICENSE, ROOT_VDC_ID } from '~/constants/config'
import { LICENSE_STATUS } from '~/constants/enterprise'
import * as cookie from './cookie'
import * as url from './url'
import store from '~/store'
const _ = window._

/**
 * 获取当前登录用户信息
 * @param key 用户某个属性，可选值：userId, loginName, userName; 不提供则返回整个对象
 * @returns {*}
 */
export const getCurrentUser = (key = null) => {
    // 用户服务调整后，cookie中将不存userId信息，而代码中大量使用getCurrentUser('userId')，因此此处将userId排除
    if (key && key !== 'userId') {
        return cookie.get(key)
    }

    if (localStorage['currentUser']) {
        const user = JSON.parse(localStorage['currentUser'])
        // 针对页面中使用getCurrentUser('userId')的情况，此处判断key为userId时直接返回缓存数据
        if (key === 'userId') {
            return user.userId || user.id
        }
        
        return { 
            ...user, 
            id: user.userId || user.id, 
            roleType: user?.currentRole?.roleType, 
            roleId: user?.currentRole?.roleId
        }
    }

    return {}
}

/**
 * 获取当前用户的项目ID集合
 * 返回值为数组，如[1,33,45]
 * @returns {*}
 */
export const getProjectIds = () => {
    const projectIds = localStorage['projectIds']
    if (projectIds) {
        return JSON.parse(projectIds)
    }
    return []
}

/**
 * 获取当前的portal
 * 可选值：admin, project,selfservice
 * @returns {*}
 */
export const getCurrentPortal = () => {
    if (isAdmin() || isVdcManager()) {
        return 'admin'
    }
    return 'project'
}

/**
 * 获取当前选中的云环境
 */
export const getCurrentIdc = () => {
    const { env } = url.queryParamsToObject(location.search)
    if (env) {
        return env
    }
    return null
}

export const getCurrentVDC = () => {
    const currentVDCId = localStorage['currentVDCId']

    if (currentVDCId) {
        return currentVDCId
    }

    return 'all'
}

export const getAllRoles = () => {
    const roles = localStorage['systemRole']

    if (roles) {
        return JSON.parse(roles)
    }

    return []
}

export const getCurrentRole = () => {
    const currentUser = localStorage['currentUser']
    const user = currentUser ? JSON.parse(currentUser) : {}
    const allRoles = getAllRoles()

    return allRoles.find(item => item.id === user?.currentRole?.roleId)
}

/**
 * 获取当前用户的系统权限
 */
export const getPermissions = () => {
    const role = getCurrentRole()

    if (role) {
        return role.permissions
    }
    return []
}

/**
 * 获取当前用户所有有权访问的portal
 */
export const getAllPortals = () => {
    const portals = localStorage['portals']
    if (portals) {
        return JSON.parse(portals)
    }

    return []
}

export const getVDCList = () => {
    const vdcs = localStorage['vdcs']
    if (vdcs) {
        return JSON.parse(vdcs)
    }

    return []
}

/**
 * 判断当前用户是否为云平台管理员
 */
// export const isAdmin = () => {
//     return getAllPortals().indexOf('Admin') !== -1
// }

/**
 * 判断当前用户是否为云平台管理员 --- 新 （根据角色判断）
 */
export const isAdmin = () => {
    let result = false
    const systemRole = localStorage['systemRole']
    if (systemRole && _.size(systemRole) > 0) {
        JSON.parse(systemRole).map(item => {
            if (item.type === 'System') {
                result = true
            }
        })
    }
    return result
}

// 判断当前用户是否为业务管理员
export const isProject = () => {
    let result = false
    const systemRole = localStorage['systemRole']
    if (systemRole && _.size(systemRole) > 0) {
        JSON.parse(systemRole).map(item => {
            if (item.type === 'Project') {
                result = true
            }
        })
    }
    return result
}

/**
 * 判断当前用户是否为项目管理员
 */
export const isProjectManager = () => {
    const user = JSON.parse(localStorage['currentUser'])
    const PROJECTUSER_ROLEID = '935a8647-ef3e-4e28-bac1-61e7ae7d6ebc'
    return user?.currentRole?.roleId === PROJECTUSER_ROLEID
}

/**
 * 判断当前用户是否为普通用户
 */
export const isNormalUser = () => {
    const user = JSON.parse(localStorage['currentUser'])
    const NORMALUSER_ROLEID = '4b665fd6-23f9-488e-b0a1-d0dedbf311ed'
    const PROJECTUSER_ROLEID = '935a8647-ef3e-4e28-bac1-61e7ae7d6ebc'
    return user?.currentRole?.roleId === NORMALUSER_ROLEID || ( user?.currentRole?.roleType === 'Project' && user?.currentRole?.roleId !== PROJECTUSER_ROLEID)
}

/**
 * 判断当前用户是否为VDC管理员
 */
export const isVdcManager = () => {
    let result = false
    let systemRole = localStorage['systemRole']
    if (systemRole && _.size(systemRole) > 0) {
        JSON.parse(systemRole).map(item => {
            if (item.type === 'Vdc') {
                result = true
            }
        })
    }
    return result
}

export const isManager = () => {
    return isAdmin() || isVdcManager() || isProjectManager()
}

export const getChargedVdcs = () => {
    let vdcs = localStorage['vdcs']

    if (vdcs) {
        vdcs = JSON.parse(vdcs)
        return vdcs.filter(({ userType = '' }) => (_.toLower(userType) === 'manager'))
    }

    return []
}

export const hasPermission = (permission) => {
    const permissions = getPermissions() || []
    return permissions.indexOf(permission) > -1
}

/**
 * 获取当前用户的某个项目的权限
 */
export const getProjectPermission = (projectId) => {
    let permissions = []
    if (!projectId) {
        return permissions
    }
    const projectRoles = localStorage['projectRoles']
    if (projectRoles) {
        const project = JSON.parse(projectRoles).filter(item => item.projectId === projectId)
        if (project.length > 0) {
            return project[0].permissions
        }
    }
    return permissions
}

/**
 * 对查询接口的请求参数做补充，如果是项目或自服务平台，加上ownerIds
 * @param queryParams
 * @returns {*}
 * @modify 20180611 luobinjin 网关鉴权逻辑：如果当前用户没有加入任何项目（getProjectIds=[])时，ownerIds不传
 */
export const addOwnerIds = (queryParams) => {
    return queryParams
}

/**
 * AuthAction组件里scope属性
 * @returns {string}
 */
export const getAuthScope = () => {
    return getCurrentPortal() === PORTAL.ADMIN || getCurrentPortal() === PORTAL.OPERATION ? SCOPE_TYPE.SYSTEM : SCOPE_TYPE.PROJECT
}

/**
 * 获取资源id的详情页路径
 * @param resourceType
 * @param id
 * @returns {*}
 */
export const getResourceRoute = (resourceType, id) => {
    if (!resourceType || !id) {
        return false
    }
    const prefix = getCurrentPortal()
    switch (resourceType) {
        case 'instance':
            return `/${prefix}/resource/${resourceType}/${id}`
        default:
            return false
    }
}

/**
 * 从缓存中获取所有的云环境
 */
export const getEnvironmentList = () => {
    const envirs = localStorage[ENV_LOCALSTORAGE_KEY] || '[]'

    return JSON.parse(envirs)
}

/**
 * 从缓存中获取所有的授权环境
 */
export const getLicenseData = () => {
    let data = _.get(window.ReducerStore.getState(), 'siteReducer.licenseData', []) || []
    return data
}

/**
 * 获取授权的云环境
 */
export const getAuthenticatedLicenseData = () => {
    const licenseFeature = getLicenseData() || []
    const authenticatedList = licenseFeature.filter(({ status }) => status !== LICENSE_STATUS.UNINSTALLED && status !== LICENSE_STATUS.INACTIVE)
    return authenticatedList.map(({ component }) => component && component.code && ENV_TO_LICENSE[component.code.toUpperCase()])
}

/**
 * 是否看过新手引导
 */
export const isLookGuide = (type = '') => {
    if (_.isEmpty(type)) {
        return true
    }

    const userId = getCurrentUser().id
    let guideLook = localStorage['guideLook'] ? JSON.parse(localStorage['guideLook']) : []

    // 老版本兼容
    !_.isArray(guideLook) && (guideLook = [])

    if (_.isEmpty(guideLook) || !guideLook.some(user => user.userId === userId)) {
        // 第一次进来或者是新用户进入
        guideLook.push({
            userId: userId,
            guide: {
                [`${type}`]: true
            }
        })
        localStorage['guideLook'] = JSON.stringify(guideLook)
        return false
    }

    const userGuide = guideLook.filter(user => user.userId === userId)[0]
    if (!userGuide['guide'][type]) {
        guideLook = guideLook.map(user => {
            if (user.userId === userId) {
                user['guide'][type] = true
            }
            return user
        })
        localStorage['guideLook'] = JSON.stringify(guideLook)
        return false
    }

    return true
}

/**
 * 判断当前用户是否为云平台管理员，且当前登录的portal是admin
 */
export const isAdminRoleAtAdminPortal = () => {
    let result = isAdmin()
    if (result) {
        result = getCurrentPortal() === PORTAL.ADMIN
    }
    return result
}

export const isVersionUntil = (version) => {
    return (currentVersion) => {
        return +currentVersion.replace(/([^\d\.])*/g, '') <= +version.replace(/([^\d\.])*/g, '')
    }
}

// 方便获取登录用户所在的vdc的id
export const getUserVDCId = () => {
    const vdcs = localStorage['vdcs']
    const vdcList = JSON.parse(vdcs)
    let vdcListId = ''
    if (!_.isEmpty(vdcList)) {
        // 通过vdcType获取登录用户所在vdc，而不是登录用户的下级vdc
        let selfVdc = vdcList.find(item => item.vdcType === 'self')
        vdcListId = (selfVdc && selfVdc.id) || vdcList[0].id
    }
    // 如果是平台管理员登录，vdc的id是root，但是因为前端无感知root的存在，因此不返回id
    return vdcListId === ROOT_VDC_ID ? '' : vdcListId
}

export const checkUserAuth = (action) => {
    const { applicationCenter: { userPermission } } = store.getState()
    if (!action) return true // 如果不需要action，则直接过
    const type = Object.prototype.toString.call(action)
    let f = false
    switch (type) {
        case '[object String]':
            f = Boolean(userPermission[action])
            break
        case '[object Array]':
            action.forEach(item => {
                f = f || userPermission[item]
            })
            break
    }
    return f
}
