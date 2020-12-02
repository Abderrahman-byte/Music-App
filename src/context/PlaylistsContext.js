import React, { createContext } from 'react'
import { AuthContext } from './AuthContext'

export const PlaylistsContext = createContext({})

export class PlaylistsProvider extends React.Component {
    static contextType = AuthContext

    state = {
        
    }

    render = () => {
        return (
            <PlaylistsContext.Provider value={{}}>
                {this.props.children}
            </PlaylistsContext.Provider>
        )    
    }
}