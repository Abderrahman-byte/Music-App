import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

// import '../styles/LoginForm.scss'

export const LoginForm = ({username, password, updater, submitHandler, className, errors}) => {
    return (
        <form className={`form LoginForm ${className || ''}`} onSubmit={submitHandler}>
            <div className='form-div form-header'>
                <h6>Login</h6>
            </div>
            <div className='form-div'>
                <input type='text' name='username' className='form-control' 
                    value={username} 
                    onChange={updater} 
                    placeholder='username' 
                    autoComplete='off'
                />
            </div>

            <div className='form-div'>
                <input type='password' name='password' className='form-control' 
                    value={password} 
                    onChange={updater} 
                    placeholder='password' 
                    autoComplete='off'
                />
            </div>

            {errors && errors.length > 0 ? (
                <div className='form-div errors-div'>
                    {errors.map((error, i) => <p key={i} className='error'>{error}</p>)}
                </div>
            ) : null}

            <div className='form-div'>
                <button className='submit-btn'>Login</button>
            </div>

            <div className='form-div form-footer'>
                <Link to='/register'>Not Member Yet? Create account</Link>
            </div>
        </form>
    )
}

LoginForm.propTypes = {
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    updater: PropTypes.func.isRequired,
    submitHandler: PropTypes.func.isRequired,
    errors: PropTypes.array
}