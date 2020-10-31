import React from 'react'

import './styles/App.scss'

import { HeaderBar } from './components/HeaderBar'
import { NavBar } from './components/NavBar'
import { NavBarProvider } from './context/NavBarContext'

class App extends React.Component {
    render = () => {
        return (
            <div className='App'>
                <NavBarProvider>
                    <HeaderBar />
                    <div className='content'>
                        <NavBar />
                    </div>
                </NavBarProvider>
            </div>
        )
    }
}

export default App ;
