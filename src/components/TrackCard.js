import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import '../styles/TrackCard.scss'

import { MusicPlayer } from '../context/MusicPlayer'

export const TrackCard = ({data}) => {
    const { play, currentId, isPlaying, setPlayingStatus} = useContext(MusicPlayer)

    const playTrack = () => {
        if(!isPlaying && currentId === data.id) {
            setPlayingStatus(true)
        } else {
            play([data])
        }
    }

    const handlePlaybtnClicked = () => {
        if(isPlaying && currentId === data.id) {
            setPlayingStatus(false)
        } else {
            playTrack()
        }
    }

    return (
        <div className={`TrackCard${currentId === data.id ? ' active':''}`}>
            <div className='play-div'>
                <img className='cover' src={data.album.cover_medium} alt={data.album.title} />
                <button onClick={handlePlaybtnClicked} className='play'>
                    {currentId === data.id && isPlaying ? (
                        <i className="fas fa-pause"></i>
                        ) : (
                        <i className="fas fa-play"></i>
                    )}
                </button>
            </div>
            <div className='info'>
                <h6 className='title'>{data.title} </h6>
                <Link to={`/artist/${data.artist.id}`} className='artist'>{data.artist.name}</Link>
                <Link to={`/album/${data.album.id}`} className='album'>{data.album.title}</Link>
            </div>
        </div>
    )
}