import React from 'react'
import PropTypes from 'prop-types'

import { LoginForm } from './LoginForm'
import { ClassWithMultipleContexts } from './ClassWithMultipleContexts'
import { getCookie } from '../utils/http'
import { ModelsContext } from '../context/ModelsContext'
import { AuthContext } from '../context/AuthContext'

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

    login = async () => {
        const data = JSON.stringify({username: this.state.data.username, password: this.state.data.password})
        const req = await fetch(`${process.env.API_URL}/api/auth/login`, {
            method: 'POST',
            body: data,
            headers : {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') || ''
            }
        })

        if(req.status >= 200 && req.status < 300) {
            const response = await req.json()
            const userData = response.data
            console.log(userData)
        } else {
            console.error(await req.json())
        }
    }

    submitHandler = async (e) => {
        e.preventDefault()
        const dataIsValidated = this.checkData()

        if(dataIsValidated) {
            this.login()
        }
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

export default ClassWithMultipleContexts(LoginFormManager,{ ModelsContext, AuthContext })