import BasicForm from '~/pages/base/BasicForm'
import { PageNotFound, NoPrivilege } from '../pages/errors'
import StepForm from 'pages/StepForm'
import BaseList from '~/pages/base/BaseList'
import BaseDetail from '~/pages/base/BaseDetail'
import Home from '~/pages/home/Home'
// 路由配置文件 仿照umi
const routers = [
  {
    path: "/childApp/desk/deskManagement",
    component: BasicForm,
    title: '基本表单',
    desc: '基本表单演示'
  },
  {
    path: "/childApp/desk/imageManagement",
    component: StepForm,
    title: '分步表单',
    desc: '分步表单演示'
  },
  {
    path: "/childApp/base/list",
    component: BaseList,
    title: '列表',
    desc: '列表演示'
  },
  {
    path: "/childApp/base/detail",
    component: BaseDetail,
    title: '详情',
    desc: '详情演示'
  },
  {
    path: "/childApp/home",
    component: Home,
    title: '首页',
    desc: '脚手架说明'
  },
  {
    path: '/error/403',
    key: '403',
    component: NoPrivilege
  },
  {
    path: '/error/404',
    key: 'e404',
    component: PageNotFound
  }
]

export default routers
