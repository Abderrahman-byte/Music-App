import React from 'react'
import PropTypes from 'prop-types'

import { LoginForm } from './LoginForm'

export class LoginFormManager extends React.Component {
    state = {
        data: {...this.props.initData}
    }

    dataUpdater = (e) => {
        let newData = {...this.state.data}
        newData[e.target.name] = e.target.value
        this.setState({ data: {...newData}})
    }

    submitHandler = (e) => {
        e.preventDefault()
    }

    render = () => (<LoginForm 
        {...this.state.data} 
        updater={this.dataUpdater} 
        submitHandler={this.submitHandler} 
    />)
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