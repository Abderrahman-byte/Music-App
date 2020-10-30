import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'

import './styles/index.scss'

import App from './App'
import { AuthProvider } from './context/AuthContext'

ReactDOM.render(
    <StrictMode>
        <AuthProvider>
            <App /> 
        </AuthProvider>
    </StrictMode>,
    document.getElementById('root')
)