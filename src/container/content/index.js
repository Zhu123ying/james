import React, { useState, useCallback, Suspense } from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { renderRoutes } from 'react-router-config'
import routes from '~/router/routes'
import Breadcrumb from '~/components/CustomBreadcrumb'

const Container = props => {
    console.log(props.route)
    const { route: currentRoute, match } = props
    const intl = useIntl()
    const [extraItem, setExtraItem] = useState({})
    // 添加slot模块
    const handleExtra = useCallback(
        (data) => {
            setExtraItem(data)
        },
        [setExtraItem]
    )
    return (
        <div>
            <Breadcrumb
                // show={isShow}
                mode="menu"
                routes={routes}
                params={match.params}
                webName={_.get(localStorage, 'siteTitle', '')}
                // hiddenLinkDesc={hiddenLinkDesc}
                extraItem={extraItem}
            />
            {
                renderRoutes(currentRoute.routes)
            }
        </div>
    )
}

// Container.propTypes = {
//     prefixCls: PropTypes.string
// }

export default Container
