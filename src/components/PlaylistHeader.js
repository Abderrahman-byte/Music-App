import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import '../styles/PlaylistHeader.scss'

export const PlaylistHeader = ({cover, title, release_date, itemsNb, author}) => {
    return (
        <div className='PlaylistHeader'>
            <div className='cover-container'>
                <img className='cover' src={cover} alt={title} />
            </div>

            <div className='info-container'>
                <h6 className='title'>{title}</h6>
                <div className='info-row'>
                    <Link className='author' to='#'>
                        <img className='author-pic' src={author.picture} alt={author.title} />
                        <h6 className='name'>{author.name}</h6>
                    </Link>
                    <span className='date'>{new Date(release_date).toLocaleDateString()}</span>
                    <span className='items-count'>{itemsNb} track{itemsNb !== 1 ? 's': ''}</span>
                </div>
            </div>
        </div>
    )
}

PlaylistHeader.propTypes = {
    cover: PropTypes.string,
    title: PropTypes.string.isRequired,
    itemsNb: PropTypes.number,
    release_date: PropTypes.number.isRequired,
    author: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string.isRequired,
        picture: PropTypes.string
    }).isRequired
}