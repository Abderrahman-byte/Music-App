import React from 'react'
import PropTypes from 'prop-types'

export class LoginFormManager extends React.Component {

    render = () => {
        console.log(this.props)
        return (
            <div className='LoginFormManager'>
                this login form class manager
            </div>
        )
    }
}

LoginFormManager.propTypes = {
    initData: PropTypes.shape({
        username: PropTypes.string,
        password: PropTypes.string
    }),
    isModel: PropTypes.bool,
    className: PropTypes.string
}

LoginFormManager.defaultProps = {
    initData : {
        username: '',
        password: ''
    },
    isModel: false,
    className: ''
}