import React from 'react'

import '../styles/HeaderBar.scss'

import { SearchBar } from './SearchBar'

export const HeaderBar = () => {
    return (
        <header className='HeaderBar'>
            <button className='nav-toggler'>
                <i className='fas fa-bars'></i>
            </button>
            <div className='logo-div'>
                <h1 role='logo'>Music App</h1>
            </div>
            <SearchBar />
        </header>
    )
}