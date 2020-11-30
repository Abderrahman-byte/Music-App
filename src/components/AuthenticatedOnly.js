import React, { useContext } from 'react'
import { Redirect, useLocation } from 'react-router-dom'

import { AuthContext } from '../context/AuthContext'

export const AuthencatedOnly = (Component) => {
    return (props) => {
        const { user } = useContext(AuthContext)
        const location = useLocation()

        if(user === undefined) {
            return <></>
        } else if(user) {
            return <Component {...props} />
        } else {
            return <Redirect to={{
                pathname: '/login',
                state: {
                    from : location.pathname
                }
            }} />
        }
    }
}