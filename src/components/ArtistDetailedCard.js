import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import '../styles/ArtistDetailedCard.scss'
import { FollowBtn } from './FollowBtn'

export const ArtistDetailedCard = ({data}) => {
    const [nb_followers, setFollowers] = useState(data.nb_follow)

    const updateFollow = (updater) => setFollowers(nb_followers + updater)

    return (
        <div className='ArtistDetailedCard'>
            <Link className='cover-container' to={`/artist/${data.id}`}>
                <img src={data.picture_medium} className='cover' />
            </Link>

            <div className='info-container'>
                <h6 className='name'>{data.name}</h6>

                <div className='info-row'>
                    <span>{data.nb_album} album{data.nb_album !== 1 ? 's':''}</span>
                    <span>{nb_followers} follower{nb_followers !== 1 ? 's':''}</span>
                </div>

                <div className='info-row'>
                    <FollowBtn id={data.id} callback={updateFollow} />
                    <button className='fav-btn'>
                        <i className='fas fa-heart'></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

ArtistDetailedCard.propTypes = {
    data: PropTypes.shape({
        picture_medium: PropTypes.string.isRequired,
        nb_album: PropTypes.number.isRequired,
        nb_follow: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired
}