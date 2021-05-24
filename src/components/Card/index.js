/* eslint-disable react/prop-types */
import React, { memo } from 'react'
import { Icon } from 'ultraui'
import './index.less'

const Card = ({ handleDelete, children }) => {
    return (
        <div className='card'>
            {handleDelete ? (
                <div className='deleteIcon' onClick={handleDelete}>
                    <Icon type='error' />
                </div>
            ) : null}
            {
                children
            }
        </div>
    )
}

export default Card
