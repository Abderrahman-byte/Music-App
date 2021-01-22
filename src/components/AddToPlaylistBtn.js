import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import '../styles/AddToPlaylistBtn.scss'

import { ModelsContext } from '../context/ModelsContext'
import { AuthContext } from '../context/AuthContext'
import { AddToPlaylistModel } from './AddToPlaylistModel'
import { PlaylistsContext } from '../context/PlaylistsContext'
import { getCookie } from '../utils/http'
import LoginFormManager from './LoginFormManager'
import { LoadingModel } from './LoadingModel'
import { PlaylistFormModel } from './PlaylistFormModel'

export const AddToPlaylistBtn = ({ id, data }) => {
    const { openModel } = useContext(ModelsContext)
    const { getPlaylists, addTracksToPlaylist, removeTracksFromPlaylist, addToPlaylists } = useContext(PlaylistsContext)
    const { user } = useContext(AuthContext)

    const trackToggleCallback = (playlistId, action = true) => {
        if(action) {
            addTracksToPlaylist(playlistId, data)
        } else {
            removeTracksFromPlaylist(playlistId, id)
        }

        fetch(`${process.env.API_URL}/api/playlists/list/${playlistId}`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ action, tracks_ids: [id] }),
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
    }

    const CreatePlaylistBtnHandle = () => {
        const playlistCreated = async (data) => {
            addToPlaylists(data)
            const playlists = await getPlaylists()
            openModel(<AddToPlaylistModel 
                playlists={playlists} 
                toggleCallback={trackToggleCallback} 
                id={id}
                CreatePlaylistCallback={CreatePlaylistBtnHandle}
            />, true)
        }
        openModel(<PlaylistFormModel callback={playlistCreated} />, true)
    }

    const handleClicked = async () => {
        if(!user) {
            openModel(<LoginFormManager isModel className='model' />, true)
        } else {
            openModel(<LoadingModel msg='Loading playlists data' />, false)
            const playlists = await getPlaylists()
            openModel(<AddToPlaylistModel 
                playlists={playlists} 
                toggleCallback={trackToggleCallback} 
                id={id}
                CreatePlaylistCallback={CreatePlaylistBtnHandle}
            />, true)
        }
    }

    return (
        <button className='AddToPlaylistBtn' onClick={handleClicked}>
            <i className='fas fa-plus'></i>
        </button>
    )
}

AddToPlaylistBtn.propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired
}