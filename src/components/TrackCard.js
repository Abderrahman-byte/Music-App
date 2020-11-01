import React from 'react'

import '../styles/TrackCard.scss'

export const TrackCard = ({data}) => {
    return (
        <div className='TrackCard'>
            <div className='play-div'>
                <img className='cover' src={data.album.cover_medium} alt={data.album.title} />
                <button className='play'>
                    <i className="fas fa-play"></i>
                </button>
            </div>
            <div className='info'>
                <h6 className='title'>{data.title} </h6>
                <a href='#' className='artist'>{data.artist.name} </a>
                <a href='#' className='album'>{data.album.title}</a>
            </div>
        </div>
    )
}