// import React from 'react'
import { ENUM } from '~/constants/enum/resource'
import { useSelector, shallowEqual } from 'react-redux'
import { useAsyncFetch, useGlobalParams } from 'Hooks'
import { isAdmin, isVdcManager, isProjectManager, getCurrentUser, getProjectIds } from 'utils/cache'

const _ = window._
const useCreateVMData = () => {
    const { envId, availableZoneId } = useGlobalParams()
    const asyncFetch = useAsyncFetch()
    const { isSdn } = useSelector(state => ({
        isSdn: state.menuReducer.availableZoneActive.isSdn
    }), shallowEqual)
    // 获取安全组列表
    const fetchSecurityGroup = (ownerId, zoneParams) => {
        const ownerIds = ownerId ? [ownerId] : undefined
        if (isSdn) {
            asyncFetch('sdn', 'securityGroup.listSdnSecurityGroup', 'post', { environmentId: envId, availableZoneId, ownerIds, pageSize: 9999 }, {}, { onError: null })
        } else {
            asyncFetch('resource', 'instance.listSecurityGroup', 'post', { environmentId: envId, ...zoneParams }, {}, { onError: null })
        }
    }
    // 获取网络列表
    const fetchNetwork = (ownerId, zoneParams) => {
        const ownerIds = ownerId ? [ownerId] : undefined
        if (isSdn) {
            asyncFetch('network', 'allSdnNetworks', 'post', {
                availableZoneId,
                pageSize: 9999,
                sharedToAll: true,
                sharedTo: ownerIds
            }, {}, { onError: null })
        } else {
            const postParam = {
                ...zoneParams,
                type: ENUM.INTRANET,
                environmentId: envId,
                sharedToAll: true
            }
            // if (type === 'EXTRANET') {
            //     // 如果是外网，需要加上一个参数，只查找启用的外网
            //     postParam.enabled = 1
            // }
            asyncFetch('network', 'allNetworks', 'post', postParam, {}, { onError: null })
        }
    }
    // 获取密钥对
    const fetchKeypair = async (zoneParams) => {
        const params = { environmentId: envId, ...zoneParams }
        if ((!(isAdmin() || isVdcManager() || isProjectManager()))) {
            params.createUserId = getCurrentUser('userId')
        }
        if (isVdcManager() || isProjectManager()) {
            params.createUserIds = await getAuthedUserIds()
        }
        asyncFetch('resource', 'keypair.list', 'post', params, {}, { onError: null })
    }
    const getAuthedUserIds = async () => {
        const params = {}
        if (isProjectManager()) {
            params.projectIds = getProjectIds()
            if (_.isEmpty(params.projectIds)) {
                return [getCurrentUser('userId')]
            }
        }
        const users = await asyncFetch('enterprise', 'role.userList', 'post', params, {}, { onError: null }) || []
        return users.map(user => user.id)
    }

    return {
        fetchKeypair,
        fetchNetwork,
        fetchSecurityGroup,
        isSdn
    }
}

export default useCreateVMData
