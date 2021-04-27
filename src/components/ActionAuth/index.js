import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

class ActionAuth extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const { userPermission, action, children } = this.props
        return (
            <React.Fragment>
                {
                    // 先写死肯定通过
                    userPermission[action] ? children : children
                }
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    userPermission: state.applicationCenter.userPermission
})

export default connect(mapStateToProps)(ActionAuth)
