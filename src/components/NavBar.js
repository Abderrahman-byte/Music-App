import React from 'react'
import { NavLink } from 'react-router-dom'

import '../styles/NavBar.scss'

import { NavBarContext } from '../context/NavBarContext'
import { NavHeader } from './NavHeader'

export class NavBar extends React.Component {
    state = {
        items : [
            {
                'type': 1,
                'iconClassName': '',
                'title': 'music',
                'to': '/'
            },
            {
                'type': 1,
                'iconClassName': '',
                'title': 'playlists',
                'to': '/playlists'
            },
            {
                'type': 1,
                'iconClassName': '',
                'title': 'favorites',
                'to': '/favs'
            }
        ]
    }

    static contextType = NavBarContext

    closeSmallNav = () => {
        const { setOpenSmall } = this.context
        setOpenSmall(false)
    }

    getItemsComponents = () => {
        return this.state.items.map((item, index) => {
            if(item.type === 1) {
                return (
                    <NavLink exact key={index} className='nav-item' to={item.to}>
                        {item.title.split(' ').map(item => {
                            return item.split('').map((char, i) => i === 0 ? char.toUpperCase() : char).join('')
                        }).join(' ')}
                    </NavLink>
                )
            } 

            throw Error(`items type ${item.type} is not supported yet`)
        })
    }

    render = () => {
        const { windoWidth, isOpenLarge, isOpenSmall, breackPoint } = this.context
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