/* eslint-disable */
import PropTypes from 'prop-types'
import React from 'react'
import { useIntl } from 'react-intl'
import './index.less'

class CommonLayOut extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    renderSearchBar = (searchItems) => {
        return (
            <>
                {
                    searchItems.map(({ render, key }) => {
                        return (
                            <div key={key}>{render}</div>
                        )
                    })
                }
            </>
        )
    }
    render() {
        const { searchItems } = this.props
        return (
            <div id='applicationCenter_layout' >
                <div className='searchBar'>{this.renderSearchBar(searchItems)}</div>
                <div className='content'>
                    <div className='tableContent'></div>
                    <div className='detailContent'></div>
                </div>
            </div>
        )
    }
}

CommonLayOut.propTypes = {
    prefixCls: PropTypes.string,
    searchItems: PropTypes.array, // 顶部日期，项目，标签搜索栏
    searchKey: PropTypes.string, // 名称搜索框
}

CommonLayOut.defaultProps = {
    prefixCls: 'ult',
    searchItems: [], // 顶部日期，项目，标签搜索栏
    searchKey: 'name', // 名称搜索框
}

export default CommonLayOut
