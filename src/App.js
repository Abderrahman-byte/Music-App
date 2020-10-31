import React from 'react'

import './styles/App.scss'

import { HeaderBar } from './components/HeaderBar'
import { NavBar } from './components/NavBar'

class App extends React.Component {
    render = () => {
        return (
            <div className='App'>
                <HeaderBar />
                <div className='content'>
                    <NavBar />
                </div>
            </div>
        )
    }
}

export default App ;
