import React from 'react'

import '../styles/NavHeader.scss'

export const NavHeader = () => {
    return (
        <div className='NavHeader'>
            <button className='nav-toggler'>
                <i className='fas fa-bars'></i>
            </button>
            <div className='logo-div'>
                <h1 role='logo'>Music App</h1>
            </div>
        </div>
    )
}