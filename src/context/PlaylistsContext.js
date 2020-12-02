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
            return this.state?.favoriteTracks || []
        }
    }

    getFavoriteAlbums = async () => {
        if(this.state.favoriteAlbums === undefined) {
            return await this.initList('favorite/albums', 'favoriteAlbums', 'albums')
        } else {
            return this.state?.favoriteAlbums || []
        }
    }

    getFavoriteArtists = async () => {
        if(this.state.favoriteArtists === undefined) {
            return await this.initList('favorite/artists', 'favoriteArtists', 'artists')
        } else {
            return this.state?.favoriteArtists || []
        }
    }

    getFavoritePlaylists = async () => {
        if(this.state.favoritePlaylists === undefined) {
            return await this.initList('favorite/playlists', 'favoritePlaylists', 'playlists')
        } else {
            return this.state?.favoritePlaylists || []
        }
    }

    getPlaylists = async () => {
        if(this.state.playlists === undefined) {
            return await this.initList('', 'playlists', 'playlists')
        } else {
            return this.state?.playlists || []
        }
    }

    render = () => {
        const contextData = {
            getFavoriteAlbums: this.getFavoriteAlbums,
            getFavoriteArtists: this.getFavoriteArtists,
            getFavoritePlaylists: this.getFavoritePlaylists,
            getFavoriteTracks: this.getFavoriteTracks,
            getPlaylists: this.getPlaylists
        }

        return (
            <PlaylistsContext.Provider value={contextData}>
                {this.props.children}
            </PlaylistsContext.Provider>
        )    
    }
}