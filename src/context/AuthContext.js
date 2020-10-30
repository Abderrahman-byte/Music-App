import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext({})

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(undefined)

    const authenticate = async () => {
        const req = await fetch(`${process.env.API_URL}/api/auth/account`, {
            credentials: 'include'
        })

        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            setUser(data)
        } else {
            setUser(null)
        }
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