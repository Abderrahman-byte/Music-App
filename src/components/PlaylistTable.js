import React, { useContext } from 'react';
import PropTypes from 'prop-types'

import '../styles/PlaylistTable.scss'
import { TrackRow } from './TrackRow';
import { MusicPlayer } from '../context/MusicPlayer';

export const PlaylistTable = ({items, withAlbum, withArtist, small}) => {
    const { play } = useContext(MusicPlayer)

    const playFrom = (id) => {
        const itemToPlayIndex = items.findIndex(track => track.id === id)
        if(itemToPlayIndex < 0) throw Error(`track with id ${id} not in playlist.`)
        const queue = items.slice(itemToPlayIndex).concat(items.slice(0, itemToPlayIndex))
        play(queue)
    }

    return (
        <table className={`PlaylistTable${small ? ' mini': ''}`}>
            <thead>
                <tr>
                    <th>#</th>
                    <th className='btn-col'></th>
                    <th className='text-start'>title</th>
                    {withAlbum ? (<th>Album</th>): (null)}
                    {withArtist ? (<th>Artist</th>): (null)}
                    <th className='btn-col'></th>
                    <th className='btn-col'></th>
                </tr>
            </thead>

            <tbody>
                {items.map((track, i) => <TrackRow 
                    key={track.id} 
                    data={track} 
                    index={i + 1} 
                    withAlbum={withAlbum || false}
                    withArtist={withArtist || false}
                    playFunc={playFrom}
                />)}
            </tbody>
        </table>
    )
}

PlaylistTable.propTypes = {
    items : PropTypes.array.isRequired,
    withAlbum: PropTypes.bool,
    withArtist: PropTypes.bool,
    small: PropTypes.bool
}