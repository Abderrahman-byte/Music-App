import React from 'react'
import PropTypes from 'prop-types'

import '../styles/SignUpForm.scss'
import { Link } from 'react-router-dom'

export const SignUpForm = ({data, updater, className}) => {
    return (
        <div className={`form SignInForm ${className}`}>
            <div className='form-div form-header'>
                <h6>Create Account</h6>
            </div>

            <div className='form-div'>
                <input 
                    type='text' 
                    name='username' 
                    value={data.username}
                    onChange={updater}
                    className='form-control' 
                    placeholder='username' 
                    autoComplete='off'
                />
            </div>

            <div className='form-div'>
                <input 
                    type='email' 
                    name='email' 
                    value={data.email}
                    onChange={updater}
                    className='form-control' 
                    placeholder='email address' 
                />
            </div>

            <div className='form-div'>
                <input 
                    type='password' 
                    name='password' 
                    value={data.password}
                    onChange={updater}
                    className='form-control' 
                    placeholder='password' 
                />
            </div>

            <div className='form-div'>
                <input 
                    type='password' 
                    name='password2' 
                    value={data.password2}
                    onChange={updater}
                    className='form-control' 
                    placeholder='confirm password' 
                />
            </div>

            <div className='form-div'>
                <button className='submit-btn'>Create</button>
            </div>

            <div className='form-div form-footer'>
                <Link to='/login'>You already a member? Sign In</Link>
            </div>
            
        </div>
    )
}

SignUpForm.propTypes = {
    data: PropTypes.shape({
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,   
        password: PropTypes.string.isRequired,
        password2: PropTypes.string.isRequired
    }).isRequired,
    updater: PropTypes.func.isRequired,
    className: PropTypes.string
}

SignUpForm.defaultProps = {
    className: ''
}