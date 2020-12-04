import React, { createContext } from 'react'

import { AuthContext } from './AuthContext'

export const PlaylistsContext = createContext({})

export class PlaylistsProvider extends React.Component {
    static contextType = AuthContext

    state = {}

    initList = async (path, dataName, type) => {
        if(!this.context.user) return []

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

    addTracksToPlaylist = async (id, ...tracks) => {
        let playlists = await this.getPlaylists()

        playlists = playlists.map(playlist => {
            if(playlist.id !== id) return playlist
            playlist.tracks = [...(playlist.tracks || []), ...tracks]
            return playlist
        })

        this.setState({ playlists: playlists })
    }

    removeTracksToPlaylist = async (playlistId, trackId) => {
        let playlists = await this.getPlaylists()

        playlists = playlists.map(playlist => {
            if(playlist.id !== playlistId) return playlist
            playlist.tracks = playlist.tracks.filter(track => track.id !== trackId)
            return playlist
        })

        this.setState({ playlists: playlists })
    }

    getRemoveFrom = (from, path, type) => {
        return async (id) => {
            let newState = {}
            if(!this.state[from]) {
                newState[from] = await this.initList(path, from, type)
                newState[from] = newState[from].filter(item => item.id !== id)
            } else {
                newState[from] = this.state[from].filter(item => item.id !== id)
            }
            this.setState({...newState})
        }
    }

    generateAddTo = (to, path, type) => {
        return async (data) => {
            let newState = {...this.state}

            if(!newState[to]) {
                newState[to] = await this.initList(path, to, type)
            }

            newState[to] = [...(newState[to] || []), data] 
            this.setState({...newState})
        }
    }

    render = () => {
        const contextData = {
            getFavoriteAlbums: this.getFavoriteAlbums,
            getFavoriteArtists: this.getFavoriteArtists,
            getFavoritePlaylists: this.getFavoritePlaylists,
            getFavoriteTracks: this.getFavoriteTracks,
            getPlaylists: this.getPlaylists,
            removeFromFavoriteTracks: this.getRemoveFrom('favoriteTracks', 'favorite/tracks', 'tracks'),
            addToFavoriteTracks: this.generateAddTo('favoriteTracks', 'favorite/tracks', 'tracks'),
            addTracksToPlaylist: this.addTracksToPlaylist,
            removeTracksToPlaylist: this.removeTracksToPlaylist
        }

        return (
            <PlaylistsContext.Provider value={contextData}>
                {this.props.children}
            </PlaylistsContext.Provider>
        )    
    }
}