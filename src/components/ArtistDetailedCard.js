import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import '../styles/ArtistDetailedCard.scss'

export const ArtistDetailedCard = ({data}) => {
    return (
        <div className='ArtistDetailedCard'>
            <Link className='cover-container' to={`/artist/${data.id}`}>
                <img src={data.picture_medium} className='cover' />
            </Link>

            <div className='info-container'>
                <h6 className='name'>{data.name}</h6>

                <div className='info-row'>
                    <span>{data.nb_album} album{data.nb_album !== 1 ? 's':''}</span>
                    <span>{data.nb_follow} follower{data.nb_follow !== 1 ? 's':''}</span>
                </div>

                <div className='info-row'>
                    <button className='subcribe-btn'>
                        <i className='fas fa-plus'></i>
                        <p>follow</p>
                    </button>
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