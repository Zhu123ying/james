/* eslint-disable quotes */
/* eslint react/no-multi-comp: 0 */
// import React, { useEffect } from 'react'
// import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
// import { shouldHandle } from '../EventHandlerWrapper'
// import EventHandler from 'BCmpt/EventHandler'
// import { useGetCurrentRoute } from 'Hooks'

/**
 * 详情页公共逻辑
 * @param {Object} baseAction: { app, method, method, data }
 * @param {string} id
 * @param {boolean} loading 数据加载中
 */
function useBaseDetail({ onRefresh }) {
    // const route = useGetCurrentRoute()
    // const matchId = _.get(route, 'params.id', '')
    // const history = useHistory()
    // // 推送事件注册注销机制
    // useEffect(() => {
    //     EventHandler.register({ handler: handleRefreshEvents })
    //     return () => {
    //         EventHandler.remove({ handler: handleRefreshEvents })
    //     }
    // })

    // // 基础数据
    // useEffect(() => {
    //     matchId ? onRefresh() : handleBackListPage()
    // }, [])

    // const handleBackListPage = () => {
    //     history.goBack()
    // }

    // const handleRefreshEvents = (event, resource) => {
    //     const resources = _.get(resource, 'result.payload.resources', []) || []
    //     const isInclude = resources.some(({ data = {}, resourceId = '' }) => (!_.isEmpty(data.id) && data.id === matchId) || (!_.isEmpty(resourceId) && resourceId === matchId))
    //     if (shouldHandle(event, _.get(route, 'key', '')) && isInclude) {
    //         onRefresh()
    //     }
    // }
}

useBaseDetail.propTypes = {
    onRefresh: PropTypes.func.isRequired
}

useBaseDetail.defaultProps = {
}

export default useBaseDetail
