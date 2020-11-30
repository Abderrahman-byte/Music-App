import React from 'react'
import { NavLink } from 'react-router-dom'

import '../styles/NavBar.scss'

import { NavBarContext } from '../context/NavBarContext'
import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'
import { NavHeader } from './NavHeader'
import { ClassWithMultipleContexts } from './ClassWithMultipleContexts'
import LoginFormManager from './LoginFormManager'

export class NavBar extends React.Component {
    state = {
        items : [
            {
                type: 1,
                iconClassName: 'fas fa-music',
                title: 'music',
                to: '/'
            },
            {
                type: 1,
                iconClassName: 'fas fa-guitar',
                title: 'subscriptions',
                to: '/feed/subscriptions',
                loginRequired: true
            },
            {
                type: 1,
                iconClassName: 'fas fa-record-vinyl',
                title: 'playlists',
                to: '/playlists'
            },
            {
                type: 1,
                iconClassName: 'fas fa-heart',
                title: 'favorites',
                to: '/favs'
            }
        ]
    }

    static contextType = NavBarContext

    closeSmallNav = () => {
        const { setOpenSmall } = this.context.NavBarContext
        setOpenSmall(false)
    }

    getItemsComponents = () => {
        const openLoginModel = () => {
            this.context.ModelsContext.openModel(<LoginFormManager isModel className='model' />, true)
        }

        return this.state.items.map((item, index) => {
            if(item.type === 1) {
                if(item.loginRequired && !this.context.AuthContext.user) {
                    return (
                        <button key={index} className='nav-item' onClick={openLoginModel}>
                            <i className={item.iconClassName}></i>
                            <p>{item.title.split(' ').map(item => {
                                return item.split('').map((char, i) => i === 0 ? char.toUpperCase() : char).join('')
                            }).join(' ')}</p>
                        </button>
                    )
                } else if(item.authenticatedOnly && !this.context.AuthContext.user) {
                    return <></>
                } else {
                    return (
                        <NavLink exact key={index} className='nav-item' to={item.to}>
                            <i className={item.iconClassName}></i>
                            <p>{item.title.split(' ').map(item => {
                                return item.split('').map((char, i) => i === 0 ? char.toUpperCase() : char).join('')
                            }).join(' ')}</p>
                        </NavLink>
                    )
                }
            } 

            throw Error(`items type ${item.type} is not supported yet`)
        })
    }

    render = () => {
        const { windoWidth, isOpenLarge, isOpenSmall, breackPoint } = this.context.NavBarContext
        const ItemsComponents = this.getItemsComponents()

        return (
            <>
            <nav className={`NavBar${isOpenLarge ? '': ' close-large'}${isOpenSmall ? '': ' close-small'}`} role='navigation'>
                {windoWidth <= breackPoint ? (
                    <div className='header'>
                        <NavHeader />
                    </div>
                ) : null }  

                {ItemsComponents}
            </nav>

            {windoWidth <= breackPoint && isOpenSmall ? (
                <div className='backdrop' onClick={this.closeSmallNav}></div>
            ) : null}
            </>
        )
    }
}

export default ClassWithMultipleContexts(NavBar, { NavBarContext, AuthContext, ModelsContext })