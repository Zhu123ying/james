import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import './global.less'
import PageNotFound from '~/container/error'
import routes from '~/router/routes'

const App = () => {
  return (
    <>
      <Switch>
        <Route exact path="/">
          <Redirect to="/application/appManage" />
        </Route>
        {renderRoutes(routes)}
        <Route component={PageNotFound} />
      </Switch>
    </>
  )
}

export default App
