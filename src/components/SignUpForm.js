import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import '../styles/SignUpForm.scss'

export const SignUpForm = ({data, updater, className, errors, submitHandler}) => {
    return (
        <form onSubmit={submitHandler} className={`form SignUpForm ${className}`}>
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

            {errors && errors.length > 0 ? (
                <div className='form-div errors-div'>
                    {errors.map((error, i) => <p key={i} className='error'>{error}</p>)}
                </div>
            ) : null}

            <div className='form-div'>
                <button className='submit-btn'>Create</button>
            </div>

            <div className='form-div form-footer'>
                <Link to='/login'>You already a member? Sign In</Link>
            </div>
            
        </form>
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
    className: PropTypes.string,
    errors: PropTypes.array,
    submitHandler: PropTypes.func.isRequired
}

SignUpForm.defaultProps = {
    className: ''
}