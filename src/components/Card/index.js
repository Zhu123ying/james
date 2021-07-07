/* eslint-disable react/prop-types */
import React, { memo } from 'react'
import { Icon } from 'ultraui'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'

const Card = ({ handleDelete, children, action }) => {
    return (
        <div className='card'>
            {handleDelete ? (
                <ActionAuth action={action}>
                    <div className='deleteIcon' onClick={handleDelete}>
                        <Icon type='error' />
                    </div>
                </ActionAuth>
            ) : null}
            {
                children
            }
        </div>
    )
}

export default Card
