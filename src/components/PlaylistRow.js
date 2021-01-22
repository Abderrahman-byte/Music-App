import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import '../styles/PlaylistRow.scss'

export const PlaylistRow = ({withAuthor, data}) => {
    console.log(data)
    return (
        <tr className='PlaylistRow'>
            <td className='text-start'>{data.is_public ? (
                <i className='fas fa-globe'></i>
            ) : (
                <i className='fa fa-lock'></i>
            )}</td>

            <td>
                <Link className='playlist-title' to={`/playlist/${data.id}`}>{data.title}</Link>
            </td>

            {withAuthor ? (
                <td>@{data.author.username}</td>
            ) : null}

            <td>{data.tracks_count}</td>
            <td>{new Date(data.created_date || 0).toLocaleString()} </td>

            <td className='col-btn'>
                <button className='btn btn-edit'>
                    <i className='fas fa-pen'></i>
                </button>
            </td>

            <td className='col-btn'>
                <button className='btn btn-delete'>
                    <i className='fas fa-trash'></i>
                </button>
            </td>
        </tr>
    )
}

PlaylistRow.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
    }).isRequired,
    withAuthor: PropTypes.bool
}