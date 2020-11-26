import React from 'react'
import PropTypes from 'prop-types'

import { SignUpForm } from './SignUpForm'
import { registerFormRules } from '../utils/forms'

export class SignUpFormManager extends React.Component {
    state = {
        data: {...this.props.initData},
        errors: []
    }

    updateFormData = (e) => {
        const target = e.target
        const stateClone = {...this.state}
        stateClone.data[target.name] = target.value
        this.setState(stateClone)
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
            console.log('form is verified')
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
    className: PropTypes.string
}

SignUpFormManager.defaultProps = {
    initData: {
        username: '',
        email: '',
        password: '',
        password2: ''
    },
    className: ''
}