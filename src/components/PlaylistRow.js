import React from 'react'
import PropTypes from 'prop-types'

import '../styles/TableOfPlaylists.scss'

export const PlaylistRow = ({index, data}) => {
    console.log(data)
    return (
        <tr className='PlaylistRow'>
            <td>{data.is_public ? (
                <i className='fas fa-globe'></i>
            ) : (
                <i className='fa fa-lock'></i>
            )}</td>
            <td>{data.title}</td>
            <td>@{data.author.username}</td>
            <td>{data.tracks_count}</td>

            <td>
                <i className='fas fa-heart'></i>
            </td>

            <td>
                <i className='fas fa-plus'></i>
            </td>
        </tr>
    )
}

PlaylistRow.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
    }).isRequired,
    index: PropTypes.number.isRequired
}