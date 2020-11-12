import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/ArtistDetailedCard.scss'

export const ArtistDetailedCard = ({data}) => {
    return (
        <div className='ArtistDetailedCard'>
            <Link className='cover-container' to='#'>
                <img src={data.picture_medium} className='cover' />
            </Link>

            <div className='info-container'>
                <h6 className='name'>{data.name}</h6>

                <div className='info-row'>
                    <span>{data.nb_album} album{data.nb_album !== 1 ? 's':''}</span>
                    {/* <span>{nb_followers} follower{nb_followers !== 1 ? 's':''}</span> */}
                    <span>545 follower</span>
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