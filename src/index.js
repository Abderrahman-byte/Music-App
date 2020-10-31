import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import './styles/index.scss'

import App from './App'
import { AuthProvider } from './context/AuthContext'

ReactDOM.render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App /> 
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
    document.getElementById('root')
)