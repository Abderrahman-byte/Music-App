import React, { useCallback, useContext } from 'react'
import { Link } from 'react-router-dom'

import '../styles/HeaderBar.scss'

import { AuthContext } from '../context/AuthContext'
import { SearchBar } from './SearchBar'
import { NavHeader } from './NavHeader'
import { ModelsContext } from '../context/ModelsContext'
import { LoadingModel } from './LoadingModel'
import { ConfirmModel } from './ConfirmModel'

export const HeaderBar = () => {
    const { user, logout } = useContext(AuthContext)
    const { openModel, closeModel } = useContext(ModelsContext)
    
    const LogoutBtnClicked = () => {
        const callback = () => {
            openModel(<LoadingModel msg='Flush user data' />, false)
            logout()
            setTimeout(closeModel, 1000)
        }

        openModel(<ConfirmModel callback={callback} action='logout' msg='Do want to logout...?' />, true)
    }

    return (
        <header className='HeaderBar'>
            <NavHeader />

            <div className='right-side'>
                <SearchBar />

                {user !== undefined ? user && user.id ? (
                    <button onClick={LogoutBtnClicked} className='login-btn'>Logout</button>
                ) : (
                    <Link className='login-btn' to='/login'>Login</Link>
                ): null}
            </div>
        </header>
    )
}