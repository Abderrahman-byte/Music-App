import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import '../styles/AlbumCard.scss'

export const AlbumCard = ({data, itemsPerLine}) => {
    return (
        <div className={`AlbumCard perline-${itemsPerLine}`}>
            <Link to={`/album/${data.id}`} className='cover-container'>
                <img className='cover' src={data.cover_medium} alt={data.title} />
                <div className='front-drop'>
                    <Link className='play-btn' to={{
                        pathname: `/album/${data.id}`,
                        state: {
                            autoPlay: true
                        }
                    }}>
                        <i className='fas fa-play'></i>
                    </Link>
                </div>
            </Link>

            {/* <Link to='' >{data.title}</Link> */}
        </div>
    )
}

AlbumCard.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string.isRequired,
        cover_medium: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
    }).isRequired,
    itemsPerLine: PropTypes.number.isRequired
}