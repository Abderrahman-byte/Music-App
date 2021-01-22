import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import '../styles/PlaylistRow.scss'

import { getCookie } from '../utils/http'
import { ModelsContext } from '../context/ModelsContext'
import { ConfirmModel } from './ConfirmModel'

export const PlaylistRow = ({withAuthor, data, deletePlaylist}) => {
    const { openModel, closeModel } = useContext(ModelsContext)

    const editPlaylist = () => {
        console.log(`%c Edit playlist ${data.id}`, "color: royalblue;")
    }

    const deletePlaylistConfimed = () => {
        deletePlaylist(data.id)
    
        fetch(`${process.env.API_URL}/api/playlists/list/${data.id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'X-CSRFTOKEN': getCookie('csrftoken')
            }
        })

        closeModel()
        console.log(`%c Playlist ${data.id} deleted`, "color: red;")
    }

    const deletePlaylistBtn = () => {
        openModel(<ConfirmModel 
            callback={deletePlaylistConfimed} 
            action='delete' 
            msg={`Do you really wan to delete playlist "${data.title}" ?`}  
        />, true)
    }

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
                <button className='btn btn-edit' onClick={editPlaylist}>
                    <i className='fas fa-pen'></i>
                </button>
            </td>

            <td className='col-btn'>
                <button className='btn btn-delete' onClick={deletePlaylistBtn}>
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
    withAuthor: PropTypes.bool,
    deletePlaylist: PropTypes.func.isRequired
}