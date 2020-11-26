import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import '../styles/HeaderBar.scss'

import { AuthContext } from '../context/AuthContext'
import { SearchBar } from './SearchBar'
import { NavHeader } from './NavHeader'

export const HeaderBar = () => {
    const { user } = useContext(AuthContext)

    return (
        <header className='HeaderBar'>
            <NavHeader />

            <div className='right-side'>
                <SearchBar />

                {user !== undefined ? user && user.id ? (
                    <button className='login-btn'>Logout</button>
                ) : (
                    <Link className='login-btn' to='#'>Login</Link>
                ): null}
            </div>
        </header>
    )
}