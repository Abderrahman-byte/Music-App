import React, { createContext, useContext, useEffect, useState } from 'react'

import { LoadingModel } from '../components/LoadingModel'
import { ModelsContext } from './ModelsContext'
import { getCookie } from '../utils/http'

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

    const logout = async () => {
        setLoadingState(true)
        setUser(null)

        try {
            const req = await fetch(`${process.env.API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                redirect: 'manual',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })

        } catch(err) {
            console.error(err)
        }

        setLoadingState(false)
        
        return
    }

    useEffect(() => {
        authenticate()
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            setUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}