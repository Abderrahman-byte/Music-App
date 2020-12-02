import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types' 

import '../../styles/FavoriteButtons.scss'

import { PlaylistsContext } from '../../context/PlaylistsContext'
import { getCookie } from '../../utils/http'

export const FavoriteTracksBtn = ({ id, data }) => {
    const { getFavoriteTracks, removeFromFavoriteTracks, addToFavoriteTracks } = useContext(PlaylistsContext)
    const [isInFavorite, setInFavorite] = useState(false)

    const checkIfInFavorite = async () => {
        const favoriteTracks = await getFavoriteTracks()
        setInFavorite(favoriteTracks.some(track => track.id === id))
    }

    const toggleFromFavorite = () => {
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
    }, [])

    return (
        <button onClick={toggleFromFavorite} className={`FavoriteButton ${isInFavorite ? 'active': ''}`}>
            <i className='fas fa-heart'></i>
        </button>
    )
}

FavoriteTracksBtn.propTypes = {
    id: PropTypes.string.isRequired
}