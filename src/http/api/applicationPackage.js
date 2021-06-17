/* eslint-disable */
import { API_Prefix as prefix } from '~/constants'

const api = {
    getApplicationPackageProjectList: `${prefix}getApplicationPackageProjectList`, // 列出应用包项目列表
    getApplicationPackageList: `${prefix}getApplicationPackageList`, // 列出项目的所有应用包
    deleteApplicationPackageVersion: `${prefix}deleteApplicationPackageVersion`, // 删除应用包版本
    getApplicationPackage: `${prefix}getApplicationPackage`, // 查看应用包详情
    createApplicationPackage: `${prefix}createApplicationPackage`, // 创建应用包
    updateApplicationPackage: `${prefix}updateApplicationPackage`, // 更新应用包
    deleteApplicationPackage: `${prefix}deleteApplicationPackage`, // 删除应用包
    getApplicationPackageForApplication: `${prefix}getApplicationPackageForApplication`, // 选择应用包管理的应用包版本创建应用时，应用包及版本的信息
    getApplicationPackageVersionsForApplication: `${prefix}getApplicationPackageVersionsForApplication`, // 创建应用时，根据应用包获取所有可使用的版本

}

export default api