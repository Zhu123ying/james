import React from 'react'
import Helmet from 'react-helmet'

const Title = ({title = ''}) => {
    return (
        <Helmet>
            <title>{title}</title>
        </Helmet>
    )
}

export const withTitle = ({ component: Component, title }) => {
    return class TitleComponent extends React.Component {
        render() {
            return (
                <>
                    <Title title={title} />
                    <Component {...this.props} />
                </>
            )
        }
    }
}

export default Title