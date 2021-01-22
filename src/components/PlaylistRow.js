import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import '../styles/PlaylistRow.scss'

import { getCookie } from '../utils/http'
import { ModelsContext } from '../context/ModelsContext'
import { ConfirmModel } from './ConfirmModel'
import { PlaylistFormModel } from './PlaylistFormModel'

export const PlaylistRow = ({withAuthor, data, deletePlaylist, updatePlaylist}) => {
    const { openModel, closeModel } = useContext(ModelsContext)

    const playlistEdited = (savedData) => {
        const newData = {...savedData, tracks: [...data.tracks]}
        updatePlaylist(data.id, newData)
        closeModel()
    }

    const editPlaylistBtn = () => {
        const initData = {title: data.title, description: data.description, is_public: data.is_public}
        openModel(<PlaylistFormModel callback={playlistEdited} initData={initData} edit id={data.id} />, true)
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
                <button className='btn btn-edit' onClick={editPlaylistBtn}>
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
    deletePlaylist: PropTypes.func.isRequired,
    updatePlaylist: PropTypes.func.isRequired
}