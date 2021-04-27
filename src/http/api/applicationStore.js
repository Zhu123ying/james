/* eslint-disable */
import { API_Prefix as prefix } from '~/constants'

const api = {
    list: `${prefix}getApplicationPackageStoreList`, // 获取应用商店App列表；
    delete: `${prefix}deleteApplicationPackageStore`, // 删除应用商店App
    create: `${prefix}createApplicationPackageStore`, // 创建应用商店App
    update: `${prefix}updateApplicationPackageStore`, // 更新应用商店App
    detail: `${prefix}getApplicationPackageStoreInfo`, // 获取应用商店App详情
    appVersionDetail: `${prefix}getApplicationPackageVersionStoreInfo`, // 应用的版本详情
    manageDetail: `${prefix}getApplicationPackageStoreInfoManage`, // 获取App包管理详情
    appPackageList: `${prefix}getAllApplicationPackageInfo`, // 创建应用时获取应用包列表
    appPackageVersionDetail: `${prefix}getApplicationPackageStoreInfoByPackage` // 应用包的版本列表信息
}

export default api