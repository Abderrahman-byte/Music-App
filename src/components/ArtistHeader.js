import React, { useState } from 'react'
import PropTypes from 'prop-types'

import '../styles/ArtistHeader.scss'

import { FollowBtn } from './FollowBtn'
import { FavoriteArtistsBtn } from './FavoriteButtons/FavoriteArtistBtn'

export const ArtistHeader = ({id, name, picture, nb_albums, nb_tracks, nb_followers}) => {
    const [nb_follow, setFollowNb] = useState(nb_followers || 0)

    const updateFollows = (updater) => setFollowNb(nb_follow + updater)

    return (
        <div className='ArtistHeader'>
            <img className='picture' src={picture} alt={name} />

            <div className='info-container'>
                <h6 className='name'>{name}</h6>
                <div className='info-row'>
                    <span>{nb_albums} album{nb_albums !== 1 ? 's':''}</span>
                    <span>{nb_tracks} track{nb_tracks !== 1 ? 's':''}</span>
                    <span>{nb_follow} follower{nb_follow !== 1 ? 's':''}</span>
                </div>

                <div className='info-row'>
                    <FollowBtn id={id} callback={updateFollows} />
                    <FavoriteArtistsBtn id={id} data={{id, name, nb_albums, nb_tracks, nb_followers}} />
                </div>
            </div>
        </div>
    )
}

ArtistHeader.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string,
    nb_albums: PropTypes.number.isRequired,
    nb_tracks: PropTypes.number.isRequired,
    nb_followers: PropTypes.number.isRequired,
}