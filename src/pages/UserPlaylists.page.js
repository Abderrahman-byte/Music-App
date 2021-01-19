import React from 'react'
import { ClassWithMultipleContexts } from '../components/ClassWithMultipleContexts'

import { ModelsContext } from '../context/ModelsContext'
import { AuthContext } from '../context/AuthContext'
import { PlaylistsContext } from '../context/PlaylistsContext'
import { PageHeader } from '../components/PageHeader'
import { TableOfPlaylists } from '../components/TableOfPlaylists'

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

    render = () => {
        console.log(this.state.data)
        return (
            <div className='UserPlaylistsPage page'>
                <PageHeader title='User Playlists' />

                {this.state.data && this.state.data.length > 0 ? (
                    <TableOfPlaylists data={this.state.data} />
                ) : null}
            </div>
        )
    }
}

export default ClassWithMultipleContexts(UserPlaylistsPage, { ModelsContext, AuthContext, PlaylistsContext })