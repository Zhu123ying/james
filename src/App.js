import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import './global.less'
import routes from '~/router/routes'

const App = () => {
  return (
    <>
      <Switch>
        <Route exact path="/">
          <Redirect to="/applicationCenter/applicationManage" />
        </Route>
        {renderRoutes(routes)}
      </Switch>
    </>
  )
}

export default App
