/* eslint-disable react/prop-types */
import React, { memo } from 'react'
import { Menu, Dropdown } from 'antd'
import { Button } from 'huayunui'
import './style.less'

const DropdownBtn = ({
    disabled = false,
    options = [],
    placement = 'bottomRight',
    getPopupContainer,
    btnProps = {},
    className = ''
}) => {
    const dropContent = (
        <Menu
            onClick={e => {
                const { disabled, callback = () => { } } = options.find(item => item.key === e.key || item.id === e.key || item.name === e.key) || {}
                if (!disabled) {
                    callback()
                }
            }}
        >
            {
                options.map((item, i) => (
                    <Menu.Item
                        key={item.key || item.id || item.name || i}
                        disabled={item.disabled}
                    >
                        <a>{item.name}</a>
                    </Menu.Item>
                ))
            }
        </Menu>
    )

    return (
        <div className={`dropdown-wrapper ${className}`}>
            <Dropdown
                overlay={dropContent}
                placement={placement}
                trigger="click"
                disabled={disabled}
                getPopupContainer={getPopupContainer}
                arrow
            >
                <Button disabled={disabled} className="operate-btn" size="small-s" type="operate" icon="icon-more" {...btnProps} />
            </Dropdown>
        </div>
    )
}

export default memo(DropdownBtn)
