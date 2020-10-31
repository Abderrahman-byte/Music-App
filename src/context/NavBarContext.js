import React, { createContext, useEffect, useState } from 'react'
import { NavHeader } from '../components/NavHeader'

export const NavBarContext = createContext({})

export const NavBarProvider = ({children}) => {
    const [isOpenLarge, setOpenLarge] = useState(true)
    const [isOpenSmall, setOpenSmall] = useState(false)

    const [breackPoint] = useState(700)

    const [isSmall, setSmallStatus] = useState(() => {
        return window.innerWidth <= breackPoint
    })

    useEffect(() => {
        setSmallStatus(window.innerWidth <= breackPoint)
    }, [window.innerWidth])

    return (
        <NavBarContext.Provider>
            {children}
        </NavBarContext.Provider>
    )
}