import React, { useContext } from 'react'

import '../styles/AddToPlaylistBtn.scss'

import { ModelsContext } from '../context/ModelsContext'
import { AuthContext } from '../context/AuthContext'
import { AddToPlaylistModel } from './AddToPlaylistModel'

export const AddToPlaylistBtn = ({ id, data }) => {
    const { openModel } = useContext(ModelsContext)
    const { user } = useContext(AuthContext)

    const handleClicked = () => {
        if(user) openModel(<AddToPlaylistModel />, true)
    }

    return (
        <button className='AddToPlaylistBtn' onClick={handleClicked}>
            <i className='fas fa-plus'></i>
        </button>
    )
}