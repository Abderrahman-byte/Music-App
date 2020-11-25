import React from 'react'
import PropTypes from 'prop-types'

import { LoginForm } from './LoginForm'
import { ClassWithMultipleContexts } from './ClassWithMultipleContexts'
import { getCookie } from '../utils/http'
import { ModelsContext, ModelsProvider } from '../context/ModelsContext'
import { AuthContext, AuthProvider } from '../context/AuthContext'
import { LoadingModel } from './LoadingModel'


export class LoginFormManager extends React.Component {
    state = {
        data: {...this.props.initData}
    }

    componentDidMount = () => console.log(this.context)

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
        // Open Loading Model
        this.context.ModelsContext.openModel(<LoadingModel msg='fetching user data' />, false)
        
        // BEGIN Login 
        const data = JSON.stringify({username: this.state.data.username, password: this.state.data.password})
        const req = await fetch(`${process.env.API_URL}/api/auth/login`, {
            method: 'POST',
            credentials: 'include',
            redirect: 'manual',
            body: data,
            headers : {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') || ''
            }
        })
        
        if(req.status >= 200 && req.status < 300) {
            const response = await req.json()
            const userData = response.data
            // Set User data to auth context
            this.context.AuthContext.setUser(userData)

            if(this.props.isModel) {
                // just close model
                this.context.ModelsContext.closeModel()
            } else {
                // redirect and close model
                const to = this.props.history?.location?.state?.from || '/'
                this.context.ModelsContext.closeModel()
                this.props.history.push(to)
            }
        } else {
            const dataClone = {...this.state.data}
            console.error(await req.json())

            if(this.props.isModel) {
                // Reopen with init errors
                const CloneComponent = ClassWithMultipleContexts(LoginFormManager,{ ModelsContext, AuthContext })
                this.context.ModelsContext.openModel(<CloneComponent 
                    initData={dataClone} 
                    className='model'
                    isModel 
                />)
            } else {
                // Close model and display error
                this.context.ModelsContext.closeModel()
            }
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
    className: PropTypes.string,
    history: PropTypes.object
}

LoginFormManager.defaultProps = {
    initData : {
        username: '',
        password: ''
    },
    isModel: false,
    className: ''
}
    
    
export default ClassWithMultipleContexts(LoginFormManager, {AuthContext, ModelsContext}) 