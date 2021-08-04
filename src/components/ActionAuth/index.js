/* eslint-disable */
import { connect } from 'react-redux'
import React from 'react'
class ActionAuth extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    checkAuth = (action) => {
        if (!action) return true // 如果不需要action，则直接过
        const type = Object.prototype.toString.call(action)
        const { userPermission } = this.props
        let f = false
        switch (type) {
            case '[object String]':
                f = Boolean(userPermission[action])
                break
            case '[object Array]':
                action.forEach(item => {
                    f = f || userPermission[item]
                })
                break
        }
        return f
    }
    render() {
        const { action, children } = this.props
        return (
            <React.Fragment>
                {
                    // 先写死肯定通过
                    this.checkAuth(action) ? children : null
                }
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    userPermission: state.applicationCenter.userPermission
})

export default connect(mapStateToProps)(ActionAuth)
