import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types' 

import '../../styles/FavoriteButtons.scss'

import { PlaylistsContext } from '../../context/PlaylistsContext'
import { getCookie } from '../../utils/http'
import { AuthContext } from '../../context/AuthContext'
import { ModelsContext } from '../../context/ModelsContext'
import LoginFormManager from '../LoginFormManager'

export const FavoriteArtistsBtn = ({ id, data }) => {
    const { getFavoriteArtists, removeFromFavoriteArtists, addToFavoriteArtists } = useContext(PlaylistsContext)
    const { user } = useContext(AuthContext)
    const { openModel } = useContext(ModelsContext)

    const [isInFavorite, setInFavorite] = useState(false)

    const checkIfInFavorite = async () => {
        if(!user) {
            setInFavorite(false)
            return
        }

        const favoriteArtists = await getFavoriteArtists()
        setInFavorite(favoriteArtists.some(artist => artist.id === id))
    }

    const toggleFromFavorite = () => {
        if(!user) {
            openModel(<LoginFormManager isModel className='model' />, true)
            return
        }

        fetch(`${process.env.API_URL}/api/playlists/favorite/artists`, {
            credentials: 'include',
            method: isInFavorite ? 'DELETE' : 'POST',
            body: JSON.stringify({ id }),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')    
            }
        })

        if(isInFavorite) removeFromFavoriteArtists(id)
        else addToFavoriteArtists(data)
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

FavoriteArtistsBtn.propTypes = {
    id: PropTypes.string.isRequired
}