/* eslint-disable */
import { API_Prefix as prefix } from '~/constants'

const api = {
    list: `${prefix}getApplicationPackageList`, // 获取App包列表；
    delete: `${prefix}deleteApplicationPackage`, // 删除App包
    create: `${prefix}createApplicationPackage`, // 创建App包
    update: `${prefix}updateApplicationPackage`, // 更新App包信息
    detail: `${prefix}getApplicationPackage`, // 获取App包详情
    getApplicationPackageForApplication: `${prefix}getApplicationPackageForApplication`, // 从应用包进入到创建应用获取详情数据
    // 应用包版本管理
    versionList: `${prefix}getApplicationPackageVersionList`, // 获取版本列表；
    deleteVersion: `${prefix}deleteApplicationPackageVersion`, // 删除版本
    createVersion: `${prefix}createApplicationPackageVersion`, // 创建版本
    createVersionByUpload: `${prefix}createApplicationPackageVersionByUpload`, // 通过上传创建版本
    createVersionByCopy: `${prefix}createApplicationPackageVersionByCopy`, // 通过复制创建版本
    updateVersion: `${prefix}updateApplicationPackageVersion`, // 更新版本
    versionDetail: `${prefix}getApplicationPackageVersion`, // 获取版本详情
    downLoadVersionChart: `${prefix}downApplicationPackageVersionChart`, // 下载版本chart包
    versionListWithoutPage: `${prefix}getApplicationPackageVersionsByPackageId`, // 获取无分页的版本列表；
    // 信创1.2新加的接口
    appPackageVersionDetail: `${prefix}getApplicationPackageVersionInfo`, // 应用包版本的详情
    versionStoreList: `${prefix}getApplicationPackageVersionStoresByPackageId`, // 获取应用商店创建的应用的版本列表；
    getChartContent: `${prefix}getApplicationPackageVersionChartDirByVersionId`, // 解析chart包文件目录内容
    verifyChartContent: `${prefix}verifyChartContent`, // 验证chart包内容
    saveChartContent: `${prefix}updateApplicationPackageVersionSaveChartFile`, // 保存chart包内容
    submitVersionChart: `${prefix}updateApplicationPackageVersionChartCommit`, // 保存chart包内容
    getApplicationPackageInfoForShare: `${prefix}getApplicationPackageInfoForShare`, // 应用包分享可供选择的版本
    createApplicationPackageAndVersionByShare: `${prefix}createApplicationPackageAndVersionByShare`, // 分享应用包版本
    // 应用中心1.3
    queryApplicationPackageVersionGateway: `${prefix}queryApplicationPackageVersionGateway`, // 获取应用入口
    createApplicationPackageVersionGateway: `${prefix}createApplicationPackageVersionGateway`, // 创建应用入口
    updateApplicationPackageVersionGateway: `${prefix}updateApplicationPackageVersionGateway`, // 编辑应用入口
    getApplicationPackageGatewayResourceList: `${prefix}getApplicationPackageGatewayResourceList`, // 查询应用入口的入口对象
    getApplicationPackageVersionsForApplication: `${prefix}getApplicationPackageVersionsForApplication`, // 根据应用包获取所有可使用的版本
    getApplicationHarborInfo: `${prefix}getApplicationHarborInfo` // 获取Harbor权限信息
}

export default api