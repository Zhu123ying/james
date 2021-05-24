/* eslint-disable react/prop-types */
import React, { memo, useState } from 'react'
import { Divider } from 'antd'
import { Icon } from 'ultraui'
import './index.less'

const DividerBox = ({ title, children }) => {
    const [type, setType] = useState('down_t')
    const handleIconClick = () => {
        setType(type === 'down_t' ? 'up_t' : 'down_t')
    }
    return (
        <div className='dividerBox'>
            <Divider>
                <div className='dividerTitle'>
                    {title}
                    <Icon type={type} onClick={handleIconClick} />
                </div>
            </Divider>
            {
                type === 'down_t' ? null : children
            }
        </div>
    )
}

export default DividerBox
