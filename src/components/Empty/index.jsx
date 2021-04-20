import React from 'react'
import { renderRoutes } from 'react-router-config'

const Empty = (props) => {
  const { route } = props
  return <>{renderRoutes(route.routes)}</>
}

export default Empty
