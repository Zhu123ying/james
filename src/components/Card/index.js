/* eslint-disable react/prop-types */
import React, { memo } from 'react'
import { Icon, Button } from 'ultraui'
import './index.less'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'

const Card = ({ handleDelete, children, action, disabled }) => {
    return (
        <div className='card'>
            {handleDelete ? (
                <ActionAuth action={action}>
                    <Button
                        type='text'
                        size='small-s'
                        onClick={handleDelete}
                        disabled={disabled}
                        className='cardBtn'
                    >
                        <Icon type='error' />
                    </Button>
                </ActionAuth>
            ) : null}
            {
                children
            }
        </div>
    )
}

export default Card
