import React from 'react'
import { Switch, Route} from 'react-router'
import Page from 'components/Page'

function renderRoutes(routes, extraProps, switchProps) {
    if (extraProps === void 0) {
        extraProps = {}
    }
    if (switchProps === void 0) {
        switchProps = {}
    }

    return routes
    ? (<Switch>
        {routes.map((route, i) => {
            const { key, path, exact, strict, render } = route
            return (
                <Route
                key={key || i}
                path={path}
                exact={exact}
                strict={strict}
                render={(props) => render
                    ? render(Object.assign({}, props, {}, extraProps, {route: route}))
                : <route.component {...props} {...extraProps} route={route} />
            }
                />
            )
        })}
       </Switch>)
    : null
}

function routeWithSubRoutes(route) {
    return (
      <Route
       exact={route.exact}
        path={route.path}
        render={props => (
          route.layout
          ? <Page title={route.title}>
              <route.layout {...props}>
                <route.component {...props} routes={route.routes} />
              </route.layout>
            </Page>
          : <Page title={route.title}>
            <route.component {...props} routes={route.routes} />
            </Page>
        )}
      />
    )
  }

export { renderRoutes, routeWithSubRoutes }