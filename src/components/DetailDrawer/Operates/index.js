/* eslint-disable react/prop-types */
import React, { useState, memo } from 'react'
import { Button } from 'huayunui'
import { Icon, TooltipAlign } from 'ultraui'
import { Divider } from 'antd'
import './style.less'

const Operates = ({
    list,
    disabled,
    narrow
}) => {
    const [expand, setExpand] = useState(false)
    const handleExpandToggle = () => {
        setExpand(!expand)
    }

    if (_.isEmpty(list)) {
        return null
    }

    const maxLineNumber = narrow ? 4 : 9
    return (
        <div className="detail-operate-wrapper">
            {
                list.filter((item, i) => expand || i < maxLineNumber).map((item, i) => (
                    <>
                        <Button
                            size="small"
                            type="text"
                            key={item.id}
                            disabled={item.disabled || disabled}
                            icon={<Icon type={item.icon} />}
                            onClick={() => item.callback()}
                        >
                            {item.name}
                        </Button>
                        {
                            item.operateIcon && item.operateIcon.tips ? (
                                <TooltipAlign
                                    tips={
                                        <p
                                            // eslint-disable-next-line react/no-danger
                                            dangerouslySetInnerHTML={{
                                                __html: item.operateIcon.tips
                                            }}
                                        />
                                    }
                                >
                                    <Icon className="operate-info" type="min-i" />
                                </TooltipAlign>
                            ) : null
                        }
                        {
                            expand && i !== list.length - 1 ? <Divider type="vertical" /> : null
                        }
                        {
                            !expand && i !== list.filter((item, i) => expand || i < maxLineNumber).length - 1 ? <Divider type="vertical" /> : null
                        }
                    </>
                ))
            }
            {
                list.length > maxLineNumber ? (
                    <Button
                        size="small"
                        type="text"
                        className="more-operate"
                        onClick={handleExpandToggle}
                    >
                        <span className="more-text">{expand ? '收起' : '更多'}</span>
                        <Icon type={expand ? 'up' : 'down'} />
                    </Button>
                ) : null
            }
        </div>
    )
}

export default memo(Operates)
