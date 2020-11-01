import React from 'react'

import '../styles/PageHeader.scss'

export const PageHeader = ({title}) => {
    return (
        <header className='PageHeader' role='banner'>
            <h2>{title} </h2>
        </header>
    )
}