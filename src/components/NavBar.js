import React, { useContext } from 'react'

import '../styles/NavBar.scss'

import { NavBarContext } from '../context/NavBarContext'
import { NavHeader } from './NavHeader'

export class NavBar extends React.Component {
    static contextType = NavBarContext

    closeSmallNav = () => {
        const { setOpenSmall } = this.context
        setOpenSmall(false)
    }

    render = () => {
        const { windoWidth, isOpenLarge, isOpenSmall, breackPoint } = this.context

        return (
            <>
            <nav className={`NavBar${isOpenLarge ? '': ' close-large'}${isOpenSmall ? '': ' close-small'}`} role='navigation'>
                {windoWidth <= breackPoint ? (
                    <div className='header'>
                        <NavHeader />
                    </div>
                ) : null }  
            </nav>

            {windoWidth <= breackPoint && isOpenSmall ? (
                <div className='backdrop' onClick={this.closeSmallNav}></div>
            ) : null}
            </>
        )
    }
}