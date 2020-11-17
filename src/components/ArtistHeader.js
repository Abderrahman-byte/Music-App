import React from 'react'
import PropTypes from 'prop-types'

import '../styles/ArtistHeader.scss'

export const ArtistHeader = ({name, picture, nb_albums, nb_tracks, nb_followers}) => {
    return (
        <div className='ArtistHeader'>
            <img className='picture' src={picture} alt={name} />

            <div className='info-container'>
                <h6 className='name'>{name}</h6>
                <div className='info-row'>
                    <span>{nb_albums} album{nb_albums !== 1 ? 's':''}</span>
                    <span>{nb_tracks} track{nb_tracks !== 1 ? 's':''}</span>
                    <span>{nb_followers} follower{nb_followers !== 1 ? 's':''}</span>
                    {/* <span>545 follower</span> */}
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

ArtistHeader.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string,
    nb_albums: PropTypes.number.isRequired,
    nb_tracks: PropTypes.number.isRequired,
    nb_followers: PropTypes.number.isRequired,
}