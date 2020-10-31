import React from 'react'

import '../styles/HeaderBar.scss'

import { SearchBar } from './SearchBar'
import { NavHeader } from './NavHeader'

export const HeaderBar = () => {
    return (
        <header className='HeaderBar'>
            <NavHeader />
            <SearchBar />
        </header>
    )
}