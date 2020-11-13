import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import '../styles/ArtistCard.scss'

export const ArtistCard = ({data, itemsPerLine}) => {
    return (
        <Link className={`ArtistCard perline-${itemsPerLine}`} to='#'>
            <img className='cover' src={data.picture_medium} alt={data.name} />
            <h6 className='name'>{data.name}</h6>
        </Link>
    )
}

ArtistCard.propTypes = {
    data: PropTypes.shape({
        picture_medium: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired
}