/* eslint-disable react/prop-types */
import React, { useEffect, memo } from 'react'
import { Drawer, Button } from 'huayunui'
import { Icon, Loading } from 'ultraui'
import Operates from './Operates'
import DetailIcon from '../DetailIcon'
import EventHandler from '../EventHandler'
import './style.less'

const DetailDrawer = ({
    matchId = '',
    icon = '',
    staticType = '',
    name = '',
    onRefresh = () => { },
    onRefreshExtra = () => { },
    title = '',
    visible = false,
    onClose = () => { },
    children,
    loading = false,
    operateConfig = null,
    narrow = false,
    className = ''
}) => {
    // 推送事件注册注销机制
    useEffect(() => {
        EventHandler.register({ handler: handleRefreshEvents })
        return () => {
            EventHandler.remove({ handler: handleRefreshEvents })
        }
    })

    const handleRefreshEvents = (event, resource) => {
        const resources = _.get(resource, 'result.payload.resources', []) || []
        const isInclude = resources.some(({ data = {}, resourceId = '' }) => (!_.isEmpty(data.id) && data.id === matchId) || (!_.isEmpty(resourceId) && resourceId === matchId))
        if (isInclude) {
            onRefresh()
        }
    }
    return (
        <Drawer
            className={`detail-drawer-wrapper ${narrow ? 'narrow-drawer' : ''} ${className}`}
            title={title || (
                <>
                    { icon ? <DetailIcon iconType={icon} staticType={staticType} className="m-r-sm" /> : null }
                    <span className="m-r-sm detail-title-span" title={name}>{name}</span>
                    <Button
                        type="text"
                        icon={<Icon type="refresh" />}
                        onClick={e => {
                            onRefresh()
                            onRefreshExtra()
                        }}
                    />
                </>
            )}
            placement="right"
            width={narrow ? 500 : 900}
            closeIcon={<Icon type="error" />}
            onClose={onClose}
            visible={visible}
            mask={false}
            destroyOnClose
            getContainer="#applicationCenterRoot"
        >
            {
                operateConfig ? (
                    <Operates {...operateConfig} narrow={narrow} />
                ) : null
            }
            {
                loading ? (
                    <Loading />
                ) : children
            }
        </Drawer>
    )
}

export {
    Operates
}

export default memo(DetailDrawer)
