import React from 'react'
import { ClassWithMultipleContexts } from '../components/ClassWithMultipleContexts'

import { ModelsContext } from '../context/ModelsContext'
import { AuthContext } from '../context/AuthContext'
import { PlaylistsContext } from '../context/PlaylistsContext'
import { PageHeader } from '../components/PageHeader'

export class UserPlaylistsPage extends React.Component {
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
        this.closeModelOnAuthLoaded()
    }

    render = () => {
        return (
            <div className='UserPlaylistsPage page'>
                <PageHeader title='User Playlists' />
            </div>
        )
    }
}

export default ClassWithMultipleContexts(UserPlaylistsPage, { ModelsContext, AuthContext, PlaylistsContext })