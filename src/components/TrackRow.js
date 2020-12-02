import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import '../styles/TrackRow.scss'

import { MusicPlayer } from '../context/MusicPlayer'
import { FavoriteTracksBtn } from './FavoriteButtons/FavoriteTrackBtn'

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

    const addToFav = () => {
        console.error('You forgot to ampleilent add to fav functionality')
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
            {withAlbum ? (
                <td className='album'>
                    <Link to={data.album ? `/album/${data.album.id}` : '#'}>{data.album?.title}</Link>
                </td>
            ) : null}
            {withArtist ? (
                <td className='artist'>
                    <Link to={data.artist ? `/artist/${data.artist.id}` : '#'}>{data.artist?.name}</Link>
                </td>
            ) : null}

            <td className='btn-col'>
                <FavoriteTracksBtn id={data.id} />
            </td>

            <td className='btn-col'>
                <button className='add-btn' onClick={addToFav}>
                    <i className='fas fa-plus'></i>
                </button>
            </td>
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