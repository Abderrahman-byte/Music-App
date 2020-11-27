import React from 'react'
import PropTypes from 'prop-types'

import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'
import { ClassWithMultipleContexts } from './ClassWithMultipleContexts'
import { SignUpForm } from './SignUpForm'
import { registerFormRules } from '../utils/forms'
import { getCookie } from '../utils/http'
import { LoadingModel } from './LoadingModel'
import { AccountCreatedModel } from './AccountCreatedModel'

export class SignUpFormManager extends React.Component {
    state = {
        data: {...this.props.initData},
        errors: []
    }

    updateFormData = (e) => {
        const target = e.target
        const stateClone = {...this.state}
        stateClone.data[target.name] = target.value
        if(target.name === 'username') {
            stateClone.data.first_name = target.value
            stateClone.data.last_name = target.value
        }
        this.setState(stateClone)
    }

    register = async () => {
        this.context.ModelsContext.openModel(<LoadingModel msg='Creating user Account' />)
        let body = {username: '', email: '', password: '', first_name: '', last_name: ''}
        for(let field in body) {
            body[field] = this.state.data[field]
        }
        body = JSON.stringify(body)

        try {
            const req = await fetch(`${process.env.API_URL}/api/auth/register`, {
                method: 'POST',
                credentials: 'include',
                body: body,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })

            if(req.status >= 200 && req.status < 300) {
                const response = await req.json()
                this.context.ModelsContext.openModel(<AccountCreatedModel msg={response.success} />, true)
                this.props.history.push('/login')
            } else {
                const data = await req.json()
                const message = data.detail || 'Something went wrong.'
                this.setState({ errors: [message]})
                this.context.ModelsContext.closeModel()
            }

        } catch(e) {
            console.error(e)
        }

    }

    verifieData = () => {
        let requirementErrors = []
        let regexErrors = []

        for(let field in registerFormRules) {
            const fieldRules = registerFormRules[field]
            if(fieldRules.isRequired && this.state.data[field] === '') {
                requirementErrors.push(`${fieldRules.name || field} field is required.`)
            }

            if(fieldRules.regex && !fieldRules.regex.test(this.state.data[field])) {
                regexErrors.push(fieldRules.regexErrorText || `${fieldRules.name || field} field is invalid`)
            }
        }
        
        if(requirementErrors.length > 1) {
            this.setState({ errors : [...requirementErrors]})
            return false
        }

        if(regexErrors.length > 1) {
            this.setState({ errors: [...requirementErrors, ...regexErrors]})
            return false
        }

        if(this.state.data.password !== this.state.data.password2) {
            this.setState({ errors: [...requirementErrors,...regexErrors, 'Passwords doesnt match.']})
            return false
        } else if(requirementErrors.length > 0 || regexErrors.length > 0) {
            this.setState({ errors: [...requirementErrors, ...regexErrors]})
            return false
        }

        this.setState({ errors: [] })
        return true
    }

    submitFormHandler = (e) => {
        e.preventDefault()
        const formVerified = this.verifieData()

        if(formVerified) {
            this.register()
        }
    }

    render = () => (
        <SignUpForm 
            className={this.state.className}
            data={this.state.data}
            updater={this.updateFormData} 
            submitHandler={this.submitFormHandler}
            errors={this.state.errors}
        />
    ) 
}

SignUpFormManager.propTypes = {
    initData: PropTypes.shape({
        username: PropTypes.string,
        email: PropTypes.string,
        password: PropTypes.string,
        password2: PropTypes.string
    }),
    className: PropTypes.string,
    history: PropTypes.object.isRequired
}

SignUpFormManager.defaultProps = {
    initData: {
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password2: ''
    },
    className: ''
}

export default ClassWithMultipleContexts(SignUpFormManager, { AuthContext, ModelsContext })