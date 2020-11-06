import React from 'react';
import PropTypes from 'prop-types'

import '../styles/PlaylistTable.scss'
import { TrackRow } from './TrackRow';

export const PlaylistTable = ({items, withAlbum, withArtist}) => {
    return (
        <table className='PlaylistTable'>
            <thead>
                <tr>
                    <th>#</th>
                    <th className='btn-col'></th>
                    <th className='text-start'>title</th>
                    {withAlbum ? (<th>Album</th>): (null)}
                    {withArtist ? (<th>Artist</th>): (null)}
                    <th className='btn-col'>Favorite</th>
                    <th className='btn-col'>Add To Playlist</th>
                </tr>
            </thead>

            <tbody>
                {items.map((track, i) => <TrackRow 
                    key={track.id} 
                    data={track} 
                    index={i + 1} 
                    withAlbum={withAlbum || false}
                    withArtist={withArtist || false}
                />)}
            </tbody>
        </table>
    )
}

PlaylistTable.propTypes = {
    items : PropTypes.array.isRequired,
    withAlbum: PropTypes.bool,
    withArtist: PropTypes.bool,
}