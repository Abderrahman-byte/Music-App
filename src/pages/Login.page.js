import React from 'react'
import { useHistory } from 'react-router-dom'

import '../styles/LoginPage.scss'

import LoginFormManager from '../components/LoginFormManager'

export const LoginPage = () => {
    const history = useHistory()
    
    return (
        <div className='LoginPage page'>
            <LoginFormManager history={history} />
        </div>
    )
}