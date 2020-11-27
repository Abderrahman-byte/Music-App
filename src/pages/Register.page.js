import React from 'react'
import { useHistory } from 'react-router-dom'

import '../styles/RegisterPage.scss'

import SignUpFormManager from '../components/SignUpFormManager'

export const RegisterPage = () => {
    const history = useHistory()

    return (
        <div className='RegisterPage page'>
            <SignUpFormManager history={history} />
        </div>
    )
}