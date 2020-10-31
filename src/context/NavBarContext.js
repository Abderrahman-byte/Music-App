import React, { createContext, useEffect, useState } from 'react'

export const NavBarContext = createContext({})

export const NavBarProvider = ({children}) => {
    const [isOpenLarge, setOpenLarge] = useState(true)
    const [isOpenSmall, setOpenSmall] = useState(false)

    const [breackPoint] = useState(700)

    const [windoWidth, setWindoWidth] = useState(() => window.innerWidth)

    const updateWindoWidth = () => {
        if(window.innerWidth !== windoWidth) {
            setWindoWidth(window.innerWidth)
        }
    }

    useEffect(() => {
        // On windows resized change windoWindth
        window.addEventListener('resize', updateWindoWidth)
        return () => window.removeEventListener('resize', updateWindoWidth)
    }, [])

    useEffect(() => console.log(windoWidth >= breackPoint ? 'is large': 'is small'), [windoWidth])

    return (
        <NavBarContext.Provider value={{
            isOpenLarge, isOpenSmall, breackPoint, windoWidth,
            setOpenLarge, setOpenSmall
        }}>
            {children}
        </NavBarContext.Provider>
    )
}