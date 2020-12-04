import React, { useState } from 'react'
import PropTypes from 'prop-types'

import '../styles/AddToPlaylistModel.scss'

const PlaylistCheckItem = ({ playlist, trackId, toggleCallback }) => {
    const [isInPlaylist, setInPlaylist] = useState(playlist.tracks.some(track => track.id === trackId) || false)

    const handleChange = (e) => {
        setInPlaylist(e.target.checked)
        toggleCallback(playlist.id, e.target.checked)
    }

    return (
        <div className='PlaylistCheckItem'>
            {playlist.is_public ? (
                <i className="fas fa-globe-africa"></i>
            ): (
                <i className='fas fa-lock'></i>
            )}
            
            <h6 className='title'>{playlist.title}</h6>

            <div className='checkbox'>
                <input type='checkbox' onChange={handleChange} checked={isInPlaylist} />
                <div className='checkmark' />
            </div>
        </div>
    )
} 

export const AddToPlaylistModel = ({ playlists, id, toggleCallback }) => {

    return (
        <div className='model AddToPlaylistModel'>
            <div className='playlists-container'>
                {playlists.map(playlist => <PlaylistCheckItem 
                    key={playlist.id} 
                    playlist={playlist} 
                    trackId={id} 
                    toggleCallback={toggleCallback}
                />)}
            </div>

            <button className='create-playlist-btn'>
                <i className='fas fa-plus'></i>
                <p>Create Playlist</p>
            </button>
        </div>
    )
}

AddToPlaylistModel.propTypes = {
    playlists: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    CreatePlaylistCallback: PropTypes.func.isRequired,
    toggleCallback: PropTypes.func.isRequired
}