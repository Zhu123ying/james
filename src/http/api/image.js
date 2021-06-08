/* eslint-disable */
import { API_Prefix as prefix } from '~/constants'

const api = {
    getRepositoryCredentialList: `${prefix}getRepositoryCredentialList`, // 获取仓库凭证列表
    deleteRepositoryCredential: `${prefix}deleteRepositoryCredential`, // 删除仓库凭证
    createRepositoryCredential: `${prefix}createRepositoryCredential`, // 创建仓库凭证
    updateRepositoryCredential: `${prefix}updateRepositoryCredential`, // 修改仓库凭证
    getRepositoryCredential: `${prefix}getRepositoryCredential`, // 查看仓库凭证
}

export default api