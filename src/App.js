import React from 'react'
import  { Route, Switch } from 'react-router-dom'

import './styles/App.scss'
import './styles/Models.scss'

import { ModelsContext } from './context/ModelsContext'
import { HeaderBar } from './components/HeaderBar'
import NavBar from './components/NavBar'
import { NavBarProvider } from './context/NavBarContext'
import { MainPages } from './pages/Main.pages'
import { MusicProvider } from './context/MusicPlayer'
import { LoginPage } from './pages/Login.page'
import UnAuthenticatedOnly from './components/UnAuthenticatedOnly'
import { RegisterPage } from './pages/Register.page'
import FeedPages from './pages/Feed.pages'

class App extends React.Component {
    static contextType = ModelsContext
    
    render = () => {
        return (
            <div className='App'>
                <MusicProvider>
                    <NavBarProvider>
                        <HeaderBar />
                        <div className='content'>
                            <NavBar />
                            
                            <Switch>
                                {/* Login page route */}
                                <Route exact path='/login'>
                                    <UnAuthenticatedOnly >
                                        <LoginPage />
                                    </UnAuthenticatedOnly>
                                </Route>

                                {/* Register page route */}
                                <Route exact path='/register'>
                                    <UnAuthenticatedOnly >
                                        <RegisterPage />
                                    </UnAuthenticatedOnly>
                                </Route>

                                {/* Main pages routes */}
                                <Route path='/feed' component={FeedPages} />
                                <Route path='/' component={MainPages} />
                            </Switch>
                        </div>
                    </NavBarProvider>
                </MusicProvider>

                {this.context.model && this.context.isOpen ? (
                <>
                    {this.context.model}
                    <div onClick={this.context.backdropClickEvent} className='model-backdrop'></div>
                </>
            ) : null}
            </div>
        )
    }
}

export default App ;
