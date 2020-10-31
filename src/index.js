import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import './styles/index.scss'

import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ModelsProvider } from './context/ModelsContext'

ReactDOM.render(
    <StrictMode>
        <BrowserRouter>
            <ModelsProvider>
                <AuthProvider>
                    <App /> 
                </AuthProvider>
            </ModelsProvider>
        </BrowserRouter>
    </StrictMode>,
    document.getElementById('root')
)