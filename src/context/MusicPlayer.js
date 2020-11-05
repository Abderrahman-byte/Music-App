import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

export const MusicPlayer = createContext({})

export const MusicProvider = ({children}) => {
    const [queue, setQueue] = useState([])
    const [currentId, setCurrentId] = useState(null)
    const [isPlaying, setPlayingStatus] = useState(false)
    const [onLoop, setLoop] = useState(false)

    const audio = useMemo(() => {
        return new Audio()
    }, [])

    const play = (playlist, loop = false) => {
        const checked = playlist.every(item => item.hasOwnProperty('id') && item.hasOwnProperty('preview'))
        const isAllObjects = playlist.every(item => typeof item === 'object')

        if(!isAllObjects) {
            throw Error('Playlist item must be an object')
        }

        if(!checked) {
            throw Error('Playlist items must contain "id" and "preview" properties.')
        }
        
        setQueue(playlist)
        setLoop(loop)
        setCurrentId(playlist[0].id)
        setPlayingStatus(true)
    }

    const next = useCallback((e) => {
        setPlayingStatus(false)
        const currentIndex = queue.findIndex(item => item.id === currentId)

        if(currentIndex >= queue.length - 1 && onLoop) {
            setCurrentId(queue[0].id)
            setPlayingStatus(true)
        } else if(currentIndex >= queue.length - 1 && !onLoop) {
            setCurrentId(null)
        } else {
            setCurrentId(queue[currentIndex + 1].id)
            setPlayingStatus(true)
        }
    }, [currentId])

    useEffect(() => {
        if(queue.length <= 0) return
        if(!currentId) return

        const current = queue.find(item => item.id === currentId)
        audio.pause()
        audio.src = current.preview
        if(isPlaying) audio.play()
    }, [currentId])

    useEffect(() => {
        if(isPlaying && audio.paused) {
            audio.play()
        } else if(!isPlaying && !audio.paused) {
            audio.pause()
        }
    }, [isPlaying])

    useEffect(() => {
        audio.addEventListener('ended', next)
        return () => audio.removeEventListener('ended', next)
    }, [audio, next])

    return (
        <MusicPlayer.Provider value={{
            isPlaying, currentId, play, setPlayingStatus, queue
        }}>
            {children}
        </MusicPlayer.Provider>
    )
}