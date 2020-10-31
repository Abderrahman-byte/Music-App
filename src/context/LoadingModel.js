import React from 'react'

import '../styles/LoadingModel.scss'

export const LoadingModel = ({msg}) => {
    return (
        <div className='model LoadingModel'>
            <div className='lds-ring center'> 
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <p className='text'>{msg || 'loading sync data'}</p>
        </div>
    )
}