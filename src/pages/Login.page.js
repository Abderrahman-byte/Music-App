import React from 'react'

import '../styles/LoginPage.scss'

import { LoginFormManager } from '../components/LoginFormManager'

export const LoginPage = () => {
    return (
        <div className='LoginPage page'>
            <LoginFormManager />
        </div>
    )
}