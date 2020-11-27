import React from 'react'

import '../styles/AccountCreatedModel.scss'

export const AccountCreatedModel = ({msg}) => {
    return (
        <div className='model AccountCreatedModel'>
            <h6 className='title'>Congratulation</h6>
            <p className='msg'>{msg}</p>
        </div>
    )
}

AccountCreatedModel.defaultProps = {
    msg: 'You are account has been created. check your email account in order to activate it.'
}