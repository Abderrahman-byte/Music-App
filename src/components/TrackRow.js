import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import '../styles/TrackRow.scss'
import { MusicPlayer } from '../context/MusicPlayer'

export const TrackRow = ({data, index, withAlbum, withArtist, playFunc}) => {
    const { isPlaying, currentId, setPlayingStatus } = useContext(MusicPlayer)

    const playTrack = () => {
        if(currentId === data.id && isPlaying) {
            setPlayingStatus(false)
        } else if(currentId === data.id) {
            setPlayingStatus(true)
        } else {
            playFunc(data.id)
        }
    }

    return (
        <tr className={`TrackRow${currentId === data.id ? ' current': ''}`}>
            <td>{index}</td>
            <td className='btn-col'>
                <button className='play-btn' onClick={playTrack}>
                    {currentId === data.id && isPlaying ? (
                        <i className='fas fa-pause'></i>
                    ) : (
                        <i className='fas fa-play'></i>
                    )}
                </button>
            </td>
            <td className='text-start'>{data.title}</td>
            {withAlbum ? <td>{data.album?.title} </td> : null}
            {withArtist ? <td>{data.artist?.name} </td> : null}
            <td className='btn-col'></td>
            <td className='btn-col'></td>
        </tr>
    )
}

TrackRow.propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    withAlbum: PropTypes.bool,
    withArtist: PropTypes.bool,
    playFunc: PropTypes.func.isRequired
}