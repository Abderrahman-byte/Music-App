import React from 'react'
import  { Route, Switch } from 'react-router-dom'

import './styles/App.scss'

import { HeaderBar } from './components/HeaderBar'
import { NavBar } from './components/NavBar'
import { NavBarProvider } from './context/NavBarContext'
import { MainPages } from './pages/Main.pages'

class App extends React.Component {
    render = () => {
        return (
            <div className='App'>
                <NavBarProvider>
                    <HeaderBar />
                    <div className='content'>
                        <NavBar />
                        
                        <Switch>
                            <Route path='/' component={MainPages} />
                        </Switch>
                    </div>
                </NavBarProvider>
            </div>
        )
    }
}

export default App ;
