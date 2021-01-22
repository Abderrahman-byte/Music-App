import React from 'react'

import { ModelsContext } from '../context/ModelsContext'
import { AuthContext } from '../context/AuthContext'
import { PlaylistsContext } from '../context/PlaylistsContext'
import { PageHeader } from '../components/PageHeader'
import { TableOfPlaylists } from '../components/TableOfPlaylists'
import { ClassWithMultipleContexts } from '../components/ClassWithMultipleContexts'
import { CreatePlaylistBtn } from '../components/CreatePlaylistBtn'
import { PlaylistFormModel } from '../components/PlaylistFormModel'

export class UserPlaylistsPage extends React.Component {
    state = {
        data: []
    }

    componentDidMount = () => {
        this.getPlaylistsData()
    }

    closeModelOnAuthLoaded = () => {
        if(this.context.AuthContext.isLoading)
            setTimeout(this.closeModelOnAuthLoaded, 300)
        else this.context.ModelsContext.closeModel() 
    }

    getPlaylistsData = async () => {
        const playlists = await this.context.PlaylistsContext.getPlaylists()
        this.setState({ data: [...playlists]})
        this.closeModelOnAuthLoaded()
    }

    deletePlaylist = (id) => {
        this.setState({ data: this.state.data.filter(pl => pl.id != id)})
        this.context.PlaylistsContext.removeFromPlaylists(id)
    }

    updatePlaylist = (id, newData) => {
        this.setState({ data : this.state.data.map(playlist => {
            if(playlist.id === id) return newData
            return playlist
        })})

        this.context.PlaylistsContext.updatePlaylist(id, newData)
    }

    playlistCreated = (playlist) => {
        this.context.ModelsContext.closeModel()
        this.setState({ data: [...this.state.data, playlist]})
        this.context.PlaylistsContext.addToPlaylists(playlist)
    }

    createPlaylistBtnHandler = () => {
        this.context.ModelsContext.openModel(<PlaylistFormModel callback={this.playlistCreated} />)
    }  

    render = () => {
        return (
            <div className='UserPlaylistsPage page'>
                <PageHeader title='User Playlists' />

                {this.state.data && this.state.data.length > 0 ? (
                    <TableOfPlaylists
                        updatePlaylist={this.updatePlaylist}
                        deletePlaylist={this.deletePlaylist} 
                        data={this.state.data} 
                    />
                ) : null}

                <CreatePlaylistBtn callback={this.createPlaylistBtnHandler} />
            </div>
        )
    }
}

export default ClassWithMultipleContexts(UserPlaylistsPage, { ModelsContext, AuthContext, PlaylistsContext })