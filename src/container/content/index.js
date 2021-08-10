import React, { useState, useCallback, Suspense } from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { renderRoutes } from 'react-router-config'
import routes from '~/router/routes'
import Breadcrumb from '~/components/CustomBreadcrumb'

const Container = props => {
    const { route: currentRoute, match, location: { pathname } } = props
    const intl = useIntl()
    const [extraItem, setExtraItem] = useState({})
    // 添加slot模块
    const handleExtra = useCallback(
        (data) => {
            setExtraItem(data)
        },
        [setExtraItem]
    )
    let breadcrumbRoutes = []
    const getBreadcrumbRoutes = (arr) => {
        return arr.map(item => {
            if ((pathname.indexOf(item.path) > -1) && (item.path !== '/')) {
                breadcrumbRoutes.push(item)
                if ((pathname !== item.path) && item.routes) {
                    item.routes && getBreadcrumbRoutes(item.routes)
                }
            }
        })
    }
    getBreadcrumbRoutes(routes)
    return (
        <div className='rootContent'>
            <Breadcrumb
                routes={breadcrumbRoutes}
                params={match.params}
                webName={_.get(localStorage, 'siteTitle', '')}
                extraItem={extraItem}
            />
            {
                renderRoutes(currentRoute.routes, { intl, handleExtra })
            }
        </div>
    )
}

export default Container
