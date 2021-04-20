import React from 'react'
import _ from 'lodash'
import './breadcrumb.less'
import { Link } from 'react-router-dom'

const Breadcrumb = (props) => {
  const {
    prefixCls = 'ult',
    langCode = window.LangCode || 'en',
    routes = [],
    params = {},
    hiddenLinkDesc = false,
    webName = '',
    separator = '/',
    className = ''
  } = props

  if (_.isEmpty(routes)) {
    return null
  }

  const route = _.last(routes)
  const title = _.get(
    window,
    `LanguageData.${langCode}.${_.get(route, 'langCode')}`,
    _.get(route, 'name')
  )
  const description = _.get(route, 'descLangCode', '')
  if (webName) {
    document.title = `${webName}  ${title}`
  }

  return (
    <div className={`${prefixCls}-breadcrumb ${className}`}>
      <div>
        <span className="title">{title}</span>
        <span className="description">{description}</span>
      </div>
      <ul>
        {hiddenLinkDesc
          ? null
          : routes.map((item, index) => {
              const linkName = _.get(
                window,
                `LanguageData.${langCode}.${_.get(item, 'langCode')}`,
                _.get(item, 'name')
              )
              let linkPath = item.path || ''
              Object.keys(params).forEach((key) => {
                linkPath = linkPath.replace(
                  new RegExp(`:${key}`, 'g'),
                  params[key]
                )
              })
              if (index === routes.length - 1) {
                return <li key={item.key}>{linkName}</li>
              } else {
                if (item.path) {
                  return (
                    <li key={item.key}>
                      <Link href={linkPath} to={linkPath}>
                        {linkName}
                      </Link>
                      <span className={`${prefixCls}-breadcrumb-separator`}>
                        {separator}
                      </span>
                    </li>
                  )
                }
                return (
                  <li key={item.key} className="disabled">
                    {linkName}
                  </li>
                )
              }
            })}
      </ul>
    </div>
  )
}

export default Breadcrumb
