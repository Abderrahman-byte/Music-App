import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types' 

import '../../styles/FavoriteButtons.scss'

import { PlaylistsContext } from '../../context/PlaylistsContext'

export const FavoriteTracksBtn = ({ id }) => {
    const { getFavoriteTracks, removeFromFavoriteTracks } = useContext(PlaylistsContext)
    const [isInFavorite, setInFavorite] = useState(false)

    const checkIfInFavorite = async () => {
        const favoriteTracks = await getFavoriteTracks()
        setInFavorite(favoriteTracks.some(track => track.id === id))
    }

    const toggleFromFavorite = () => {
        if(isInFavorite) {
            removeFromFavoriteTracks(id)
        }

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