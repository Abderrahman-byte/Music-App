import React, { useContext } from 'react'

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
    const { getPlaylists, addTracksToPlaylist, removeTracksToPlaylist } = useContext(PlaylistsContext)
    const { user } = useContext(AuthContext)

    const trackToggleCallback = (playlistId, action = true) => {
        if(action) {
            addTracksToPlaylist(playlistId, data)
        } else {
            removeTracksToPlaylist(playlistId, id)
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

    const getPlaylistsWithTracks = async () => {
        let playlists = await getPlaylists()
        
        const playlistsWithTracks = await Promise.all(playlists.map(async playlist => {
            if('tracks' in playlist) return playlist

            const req = await fetch(`${process.env.API_URL}/api/playlists/list/${playlist.id}`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
    
            if(req.status >= 200 && req.status < 300) {
                const data = await req.json()
                addTracksToPlaylist(playlist.id, ...(data.tracks || []))
                return data
            } else {
                console.error(await req.json())
                return null
            }
        }))
    
        return playlistsWithTracks
    }

    const CreatePlaylistBtnHandle = () => {
        openModel(<PlaylistFormModel />, true)
    }

    const handleClicked = async () => {
        if(!user) {
            openModel(<LoginFormManager isModel className='model' />, true)
        } else {
            openModel(<LoadingModel msg='Loading playlists data' />, false)
            const playlists = await getPlaylistsWithTracks()
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