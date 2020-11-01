import React, { useContext } from 'react'

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
        <div className='TrackCard'>
            <div className='play-div'>
                <img className='cover' src={data.album.cover_medium} alt={data.album.title} />
                <button onClick={handlePlaybtnClicked} className='play'>
                    <i className="fas fa-play"></i>
                </button>
            </div>
            <div className='info'>
                <h6 className='title'>{data.title} </h6>
                <a href='#' className='artist'>{data.artist.name} </a>
                <a href='#' className='album'>{data.album.title}</a>
            </div>
        </div>
    )
}