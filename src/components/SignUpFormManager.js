import React from 'react'
import PropTypes from 'prop-types'
import { SignUpForm } from './SignUpForm'

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

    render = () => (
        <SignUpForm 
            className={this.state.className}
            data={this.state.data}
            updater={this.updateFormData} 
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