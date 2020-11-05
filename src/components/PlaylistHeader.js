import React, { useContext, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import '../styles/PlaylistHeader.scss'

import { MusicPlayer } from '../context/MusicPlayer'

export const PlaylistHeader = ({cover, title, release_date, itemsNb, author, items}) => {
    const { isPlaying, currentId, play, setPlayingStatus, queue } = useContext(MusicPlayer)

    const isCurrent = useMemo(() => {
        const isAllInQueue = items.every(plItem => queue.findIndex(queueItem => queueItem.id === plItem.id) >= 0)
        const isQueueAllIn = queue.every(queueItem => queue.findIndex(plItem => queueItem.id === plItem.id) >= 0)
        const isCurrentInItems = items.findIndex(item => item.id === currentId) >= 0
        return isAllInQueue && isQueueAllIn && isCurrentInItems
    }, [items, queue, currentId])

    const handlePlayBtn = () => {
        if(isCurrent && !isPlaying) {
            setPlayingStatus(true)
        } else if(isCurrent) {
            setPlayingStatus(false)
        } else {
            play(items)
        }
    }

    return (
        <div className='PlaylistHeader'>
            <div className={`cover-container${isCurrent ? ' current': ''}`}>
                <img className='cover' src={cover} alt={title} />
                <div className='cover-frontdrop'>
                    <button className='play-btn' onClick={handlePlayBtn}>
                        {isCurrent && isPlaying ? (
                            <i className='fas fa-pause'></i>
                        ) :(
                            <i className='fas fa-play'></i>
                        )}
                    </button>
                </div>
            </div>

            <div className='info-container'>
                <h6 className='title'>{title}</h6>
                <div className='info-row'>
                    <Link className='author' to='#'>
                        <img className='author-pic' src={author.picture} alt={author.title} />
                        <h6 className='name'>{author.name}</h6>
                    </Link>
                    <span className='date'>{new Date(release_date).toLocaleDateString()}</span>
                    <span className='items-count'>{itemsNb} track{itemsNb !== 1 ? 's': ''}</span>
                </div>
            </div>
        </div>
    )
}

PlaylistHeader.propTypes = {
    cover: PropTypes.string,
    title: PropTypes.string.isRequired,
    itemsNb: PropTypes.number,
    release_date: PropTypes.number.isRequired,
    author: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string.isRequired,
        picture: PropTypes.string
    }).isRequired,
    items: PropTypes.array
}