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

    checkData = () => {
        const data = {...this.state.data}

        if(data.username === '') {
            console.error('Username field is required')
            return false
        }

        if(data.password === '') {
            console.error('Password field is required')
            return false
        }

        if(data.username.length < 6) {
            console.error('Username field length is not enough.')
            return false
        }

        if(data.password.length < 6) {
            console.error('Password field length is not enough.')
            return false
        }

        return true
    }

    submitHandler = (e) => {
        e.preventDefault()
        const dataIsValidated = this.checkData()
        
    }

    render = () => (<LoginForm 
        {...this.state.data} 
        updater={this.dataUpdater} 
        submitHandler={this.submitHandler} 
        className={this.props.className}
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