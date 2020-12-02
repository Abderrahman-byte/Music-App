import React, { createContext } from 'react'
import { AuthContext } from './AuthContext'

export const PlaylistsContext = createContext({})

export class PlaylistsProvider extends React.Component {
    static contextType = AuthContext

    state = {}

    initList = async (path, dataName, type) => {
        if(this.context.isLoading) {
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    resolve(await this.initList(path, dataName, type))
                }, 200)
            })
        }

        const req = await fetch(`${process.env.API_URL}/api/playlists/${path}`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'}
        })

        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            const newState = {}
            newState[dataName] = [...(data[type] || data.data || [])]
            this.setState(newState)
            return [...(data[type] || data.data || [])]
        } else {
            console.error(await req.json())
            return []
        }
    }

    getFavoriteTracks = async () => {
        if(this.state.favoriteTracks === undefined) {
            return await this.initList('favorite/tracks', 'favoriteTracks', 'tracks')
        } else {
            return this.state?.favoriteTracks
        }
    }

    render = () => {
        return (
            <PlaylistsContext.Provider value={{}}>
                {this.props.children}
            </PlaylistsContext.Provider>
        )    
    }
}