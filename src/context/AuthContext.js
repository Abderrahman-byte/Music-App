import React, { createContext, useContext, useEffect, useState } from 'react'

import { LoadingModel } from '../components/LoadingModel'
import { ModelsContext } from './ModelsContext'

export const AuthContext = createContext({})
AuthContext.displayName = 'AuthContext'

export const AuthProvider = ({children}) => {
    const { openModel, closeModel } = useContext(ModelsContext)

    const [user, setUser] = useState(undefined)
    const [isLoading, setLoadingState] = useState(true)

    const authenticate = async () => {
        setLoadingState(true)
        openModel(<LoadingModel msg='Loading user data' />, false)

        const req = await fetch(`${process.env.API_URL}/api/auth/account`, {
            credentials: 'include'
        })

        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            setUser(data)
        } else {
            setUser(null)
        }
        
        // closeModel()
        setLoadingState(false)        
    }

    useEffect(() => {
        authenticate()
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}