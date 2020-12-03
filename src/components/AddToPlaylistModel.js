import React, { useEffect } from 'react'

import '../styles/AddToPlaylistModel.scss'

const PlaylistCheckItem = ({ playlist, trackId }) => {
    return (
        <div className='PlaylistCheckItem'>
            <h6>{playlist.title}</h6>
        </div>
    )
} 

export const AddToPlaylistModel = ({ playlists, id, data }) => {

    useEffect(() => {
        console.log(playlists)
        console.log(id)
        console.log(data)
    }, [])

    return (
        <div className='model AddToPlaylistModel'>
            {playlists.map(playlist => <PlaylistCheckItem key={playlist.id} playlist={playlist} trackId={id} />)}
        </div>
    )
}