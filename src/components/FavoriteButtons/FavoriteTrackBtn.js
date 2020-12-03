import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types' 

import '../../styles/FavoriteButtons.scss'

import { PlaylistsContext } from '../../context/PlaylistsContext'
import { getCookie } from '../../utils/http'
import { AuthContext } from '../../context/AuthContext'
import { ModelsContext } from '../../context/ModelsContext'
import LoginFormManager from '../LoginFormManager'

export const FavoriteTracksBtn = ({ id, data }) => {
    const { getFavoriteTracks, removeFromFavoriteTracks, addToFavoriteTracks } = useContext(PlaylistsContext)
    const { user } = useContext(AuthContext)
    const { openModel } = useContext(ModelsContext)

    const [isInFavorite, setInFavorite] = useState(false)

    const checkIfInFavorite = async () => {
        if(!user) {
            setInFavorite(false)
            return
        }

        const favoriteTracks = await getFavoriteTracks()
        setInFavorite(favoriteTracks.some(track => track.id === id))
    }

    const toggleFromFavorite = () => {
        if(!user) {
            openModel(<LoginFormManager isModel className='model' />, true)
            return
        }

        fetch(`${process.env.API_URL}/api/playlists/favorite/tracks`, {
            credentials: 'include',
            method: isInFavorite ? 'DELETE' : 'POST',
            body: JSON.stringify({ id }),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')    
            }
        })

        if(isInFavorite) removeFromFavoriteTracks(id)
        else addToFavoriteTracks(data)
        setInFavorite(!isInFavorite)
    }

    useEffect(() => {
        checkIfInFavorite()
    }, [user])

    return (
        <button onClick={toggleFromFavorite} className={`FavoriteButton ${isInFavorite ? 'active': ''}`}>
            <i className='fas fa-heart'></i>
        </button>
    )
}

FavoriteTracksBtn.propTypes = {
    id: PropTypes.string.isRequired
}