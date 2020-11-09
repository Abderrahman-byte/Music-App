import React from 'react'

import '../styles/NotFound.scss'

export const AlbumNotFound = () => {
    return (
        <div className='NotFound AlbumNotFound'>
            <div className='container'>
                <h2>Album Is Not Found</h2>
                <p>The Album You Looking For doesn't exist or has been deleted.</p>
            </div>
        </div>
    )
}

export const ArtistNotFound = () => {
    return (
        <div className='NotFound ArtistNotFound'>
            <div className='container'>
                <h2>404 Error</h2>
                <p>The Album You Looking For doesn't exist.</p>
            </div>
        </div>
    )
}