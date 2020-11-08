import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import '../styles/AlbumCard.scss'

export const AlbumCard = ({data}) => {
    console.log(data)
    return (
        <div className='AlbumCard'>
            <div className='cover-container'>
                <img className='cover' src={data.cover_medium} alt={data.title} />
                <div className='front-drop'>
                    <Link to='#'>
                        <i className='fas fa-play'></i>
                    </Link>
                </div>
            </div>

            <Link to='' >{data.title}</Link>
        </div>
    )
}

AlbumCard.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string.isRequired,
        cover_medium: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
    }).isRequired
}