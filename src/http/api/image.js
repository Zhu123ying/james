/* eslint-disable */
import { API_Prefix as prefix } from '~/constants'

const api = {
    getRepositoryCredentialList: `${prefix}getRepositoryCredentialList`, // 获取仓库凭证列表
    deleteRepositoryCredential: `${prefix}deleteRepositoryCredential`, // 删除仓库凭证
    createRepositoryCredential: `${prefix}createRepositoryCredential`, // 创建仓库凭证
    updateRepositoryCredential: `${prefix}updateRepositoryCredential`, // 修改仓库凭证
    getRepositoryCredential: `${prefix}getRepositoryCredential`, // 查看仓库凭证
    // 平台公共库
    getPubRepoImageRepoList: `${prefix}getPubRepoImageRepoList`, // 列出平台公共库的镜像仓库列表
    getPubRepoImageArtifactList: `${prefix}getPubRepoImageArtifactList`, // 列出平台公共库的镜像实例列表
    deletePubRepoImageRepositoryByRepoName: `${prefix}deletePubRepoImageRepositoryByRepoName`, // 删除平台公共库的镜像仓库
    createPubRepoImageByPullFromExternalRepo: `${prefix}createPubRepoImageByPullFromExternalRepo`, // 平台公共库从外部仓库拉取镜像
    createPubRepoImageByPullFromProjectRepo: `${prefix}createPubRepoImageByPullFromProjectRepo`, // 平台公共库从项目仓库拉取镜像
    getRepositoryCredentialListForImagePull: `${prefix}getRepositoryCredentialListForImagePull`, // 获取凭证
    getPubRepoImagePullTaskList: `${prefix}getPubRepoImagePullTaskList`, // 查询平台公共库镜像拉取记录
    // 应用商店库
    getStoreRepoImageRepoList: `${prefix}getStoreRepoImageRepoList`, // 列出应用商店库的镜像仓库列表
    getStoreRepoImageArtifactList: `${prefix}getStoreRepoImageArtifactList`, // 列出应用商店库的镜像实例列表
    // 项目仓库
    getImageProjectList: `${prefix}getImageProjectList`, // 列出镜像管理项目库列表
    getProjectImageRepoList: `${prefix}getProjectImageRepoList`, // 列出项目仓库的镜像仓库列表
    getProjectImageArtifactList: `${prefix}getProjectImageArtifactList`, // 列出项目仓库的镜像实例列表
    deleteProjectImageRepositoryByRepoName: `${prefix}deleteProjectImageRepositoryByRepoName`, // 删除项目的镜像仓库
    getImageArtifactByImageRepository: `${prefix}getImageArtifactByImageRepository`, // 获取源仓库可供选择的镜像集合
    getProjectImagePullTaskList: `${prefix}getProjectImagePullTaskList`, // 项目仓库的镜像拉取列表
    createProjectRepository: `${prefix}createProjectRepository`, // 初始化项目的仓库
    createImageByPullFromProject: `${prefix}createImageByPullFromProject`, // 项目仓库从其他项目仓库拉取镜像
    createImageByPullFromExternalRepo: `${prefix}createImageByPullFromExternalRepo`, // 项目仓库从外部仓库拉取镜像
    createImageByPullFromPublicRepo: `${prefix}createImageByPullFromPublicRepo`, // 项目仓库从平台公共库拉取镜像

    getImageRepositoryPath: `${prefix}getImageRepositoryPath`, // 获取镜像仓库路径（公共平台库下projectId不需要传，项目库下需要传）
    deleteImageArtifactByIds: `${prefix}deleteImageArtifactByIds`, // 删除镜像实例(删除实例只要一个删除接口)
    getImageArtifactInfo: `${prefix}getImageArtifactInfo`, // 查看镜像实例的详情
    createImageTag: `${prefix}createImageTag`, // 镜像添加Tag
    deleteImageTag: `${prefix}deleteImageTag`, // 镜像删除Tag
    getImageArtifactTagRecords: `${prefix}getImageArtifactTagRecords`, // 查看镜像的Tag维护记录
    createImageByPushToProject: `${prefix}createImageByPushToProject`, // 镜像推送到其他项目仓库中
    createImageByPushToPubRepo: `${prefix}createImageByPushToPubRepo`, // 镜像推送到平台公共库中
    getImageArtifactBuildHistory: `${prefix}getImageArtifactBuildHistory`, // 查看镜像实例的分层信息
    getImageArtifactVulnerabilities: `${prefix}getImageArtifactVulnerabilities`, // 查看镜像实例的漏洞列表
    scanImageById: `${prefix}scanImageById`, // 镜像扫描
    getImageArtifactScanStatus: `${prefix}getImageArtifactScanStatus`, // 镜像扫描状态查询
}

export default api