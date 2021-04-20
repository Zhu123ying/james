import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import DetailItem from './detailItem'

const DetailList = ({ prefixCls, options }) => {
    return (
            <table className={classnames(`${prefixCls}-detail-list-new`)} >
                <tbody>
                    {
                        options.map(({ id, name, value, extraOptions }) => (<DetailItem key={id} name={name} value={value} id={id} extraOptions={extraOptions} prefixCls={prefixCls} />))
                    }
                </tbody>
            </table>
    )
}
DetailList.propTypes = {
    options: PropTypes.array.isRequired,
    prefixCls: PropTypes.string
}
DetailList.defaultProps = {
    prefixCls: 'ult'
}
export default DetailList
