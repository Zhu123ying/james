/* eslint-disable react/prop-types */
/*
 * @Author: SiMeiyu
 * @Date: 2017-07-04 09:56:23
 */
import React from 'react'
import { Link } from 'react-router-dom'
// eslint-disable-next-line import/named
import { Breadcrumb } from 'huayunui'
import { useIntl } from 'react-intl'
import './breadcrumb.less'

const CustomBreadcrumb = ({
    prefixCls = 'ult',
    routes,
    params,
    hiddenLinkDesc = false,
    webName,
    show = true,
    extraItem
}) => {
    const intl = useIntl()
    if (!show) {
        return null
    }
    return (
        <Breadcrumb
            mode="menu"
            customerRoutes={routes.map(route => ({
                ...route,
                breadcrumbName: intl.formatMessage({ id: route.langCode || route.name || '-' }),
                tips: route.descLangCode ? intl.formatMessage({ id: route.descLangCode }) : null
            }))}
            customerRender={(route, params, routes, paths) => {
                if (hiddenLinkDesc) {
                    return null
                }
                const last = routes.indexOf(route) === routes.length - 1
                if (last) {
                    // 修改页面title
                    if (!document.title.includes(route.breadcrumbName)) {
                        document.title = `${webName}  ${route.breadcrumbName}`
                    }
                    return <div>{route.breadcrumbName}</div>
                } else {
                    return <Link disabled={!route.path} to={route.path}>{route.breadcrumbName}</Link>
                }
            }}
            params={params}
            prefixCls={prefixCls}
            border
            {...extraItem}
        />
    )
}

export default CustomBreadcrumb
