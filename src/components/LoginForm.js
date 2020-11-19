import React from 'react'
import PropTypes from 'prop-types'

import '../styles/LoginForm.scss'

export const LoginForm = ({username, password, updater, submitHandler}) => {
    return (
        <form className='LoginForm form' onSubmit={submitHandler}>
            <div className='form-div'>
                <input type='text' name='username' value={username} onChange={updater} />
            </div>

            <div className='form-div'>
                <input type='password' name='password' value={password} onChange={updater} />
            </div>
        </form>
    )
}

LoginForm.propTypes = {
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    updater: PropTypes.func.isRequired,
    submitHandler: PropTypes.func.isRequired,
}