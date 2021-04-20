import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import './global.less'
import { PageNotFound } from './pages/errors'
import routes from './router/routes'

const App = () => {
  return (
    <>
      <Switch>
        <Route exact path="/">
          <Redirect to="/childApp/home" />
        </Route>
        {renderRoutes(routes)}
        <Route component={PageNotFound} />
      </Switch>
    </>
  )
}

export default App
