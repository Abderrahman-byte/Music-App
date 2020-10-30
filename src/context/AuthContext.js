import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext({})

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(undefined)

    const authenticate = async () => {
        const req = await fetch(`${process.env.API_URL}/api/auth/account`)

        if(req.status >= 200 && req.status < 300) {
            console.log(await req.json())
        } else {
            console.log(await req.text())
            setUser(null)
        }
    }

    useEffect(() => {
        authenticate()
    }, [])

    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    )
}