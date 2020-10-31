import React, { createContext, useContext, useEffect, useState } from 'react'
import { LoadingModel } from './LoadingModel'
import { ModelsContext } from './ModelsContext'

const AuthContext = createContext({})

export const AuthProvider = ({children}) => {
    const { openModel, closeModel } = useContext(ModelsContext)

    const [user, setUser] = useState(undefined)

    const authenticate = async () => {
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
        
        closeModel()
    }

    useEffect(() => {
        authenticate()
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
        }}>
            {children}
        </AuthContext.Provider>
    )
}