import React from 'react'
import PropTypes from 'prop-types'

import '../styles/CreatePlaylistBtn.scss'

export const CreatePlaylistBtn = ({ callback }) => {
    return (
        <button className='CreatePlaylistBtn' onClick={callback}>
            <i className='fas fa-plus'></i>
            <p>New Playlist</p>
        </button>
    )
}

CreatePlaylistBtn.propTypes = {
    callback: PropTypes.func.isRequired
}