import React from 'react'
import { SignUpFormManager } from '../components/SignUpFormManager'

import '../styles/RegisterPage.scss'

export const RegisterPage = () => {
    return (
        <div className='RegisterPage page'>
            <SignUpFormManager />
        </div>
    )
}