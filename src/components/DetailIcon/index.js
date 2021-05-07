/* eslint-disable react/prop-types */
import React, { memo } from 'react'
import { Icon, Static } from 'ultraui'
import './style.less'

const DetailIcon = ({
    iconType,
    size,
    className,
    style,
    staticType
}) => {
    return (
        <div className={`${className} detail-icon-wrapper ${size === 'small' ? 'small-size' : ''}`} style={style}>
            <Icon type={iconType} />
            {
                staticType ? <Static type={staticType} /> : null
            }
        </div>
    )
}

export default memo(DetailIcon)
