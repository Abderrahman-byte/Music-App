import React, { useContext } from 'react'
import { NavBarContext } from '../context/NavBarContext'

import '../styles/NavHeader.scss'

export const NavHeader = () => {
    const { windoWidth, breackPoint, isOpenLarge, isOpenSmall, setOpenLarge, setOpenSmall} = useContext(NavBarContext)

    const ToggleNavBar = () => {
        if(windoWidth > breackPoint) {
            // That means that the window is large
            setOpenLarge(!isOpenLarge)
        } else {
            // That means that the window is small
            setOpenSmall(!isOpenSmall)
        }
    }

    return (
        <div className='NavHeader'>
            <button className='nav-toggler' onClick={ToggleNavBar}>
                <i className='fas fa-bars'></i>
            </button>
            <div className='logo-div'>
                <h1 role='logo'>Music App</h1>
            </div>
        </div>
    )
}