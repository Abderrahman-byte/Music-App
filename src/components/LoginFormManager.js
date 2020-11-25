import React from 'react'
import PropTypes from 'prop-types'

import { LoginForm } from './LoginForm'
import { ClassWithMultipleContexts } from './ClassWithMultipleContexts'
import { getCookie } from '../utils/http'
import { ModelsContext } from '../context/ModelsContext'
import { AuthContext } from '../context/AuthContext'
import { LoadingModel } from './LoadingModel'


export class LoginFormManager extends React.Component {
    state = {
        data: {...this.props.initData},
        errors: [...this.props.initErrors]
    }

    // componentDidMount = () => console.log(this.context)

    dataUpdater = (e) => {
        let newData = {...this.state.data}
        newData[e.target.name] = e.target.value
        this.setState({ data: {...newData}})
    }
    
    checkData = () => {
        const data = {...this.state.data}
        
        if(data.username === '') {
            this.setState({ errors: ['Username field is required'] })
            return false
        }
        
        if(data.password === '') {
            this.setState({ errors: ['Password field is required'] })
            return false
        }
        
        if(data.username.length < 6) {
            this.setState({ errors: ['Username field length is not enough.']})
            return false
        }
        
        if(data.password.length < 6) {
            this.setState({ errors: ['Password field length is not enough.']})
            return false
        }
        
        this.setState({ errors: []})
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
            const data = await req.json()
            const detail = data.detail || "Something went wrong."
            
            if(this.props.isModel) {
                // Reopen with init errors
                const dataClone = {...this.state.data}
                const CloneComponent = ClassWithMultipleContexts(LoginFormManager,{ ModelsContext, AuthContext })
                this.context.ModelsContext.openModel(<CloneComponent 
                    initData={dataClone} 
                    className='model'
                    isModel 
                    initErrors={[detail]}
                />)
            } else {
                // Close model and display error
                this.setState({ errors: [detail] })
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
        errors={this.state.errors}
    />)
}
    
LoginFormManager.propTypes = {
    initData: PropTypes.shape({
        username: PropTypes.string,
        password: PropTypes.string
    }),
    initErrors: PropTypes.array,
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
    className: '',
    initErrors: []
}
    
    
export default ClassWithMultipleContexts(LoginFormManager, {AuthContext, ModelsContext}) 