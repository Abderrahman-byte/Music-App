import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import '../styles/FollowBtn.scss'

import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'
import { getCookie } from '../utils/http'
import LoginFormManager from './LoginFormManager'

export const FollowBtn = ({id, callback}) => {
    const { user } = useContext(AuthContext)
    const { openModel } = useContext(ModelsContext)

    const [isUserFollowing, setFollowingState] = useState(false)
    const [isLoading, setLoadingState] = useState(false)

    const checkFollow = async () => {
        setLoadingState(true)
        if(!user) {
            setFollowingState(false)
            setLoadingState(false)
            return
        }

        const req = await fetch(`${process.env.API_URL}/api/playlists/subscription/${id}`, {
            credentials: 'include', redirect: 'manual'
        })

        if(req.status >= 200 && req.status < 300) {
            setFollowingState(true)
        }
        setLoadingState(false)
    }

    const toggleSubscription = async () => {
        if(!user || !user.id ) {
            openModel(<LoginFormManager isModel className='model' />, true)
            return
        }
        
        if(isLoading) {
            setTimeout(toggleSubscription, 500)
        } else {
            setLoadingState(true)
            const method = isUserFollowing ? 'DELETE': 'POST'
            const updater = isUserFollowing ? -1 : 1
            const req = await fetch(`${process.env.API_URL}/api/playlists/subscription/${id}`, {
                method,
                credentials: 'include', 
                redirect: 'manual',
                headers: {
                    'X-CSRFTOKEN': getCookie('csrftoken')
                }
            })

            if(req.status >= 200 && req.status < 300) {
                setFollowingState(!isUserFollowing)
                if(callback) callback(updater)
            }
            setLoadingState(false)
        }
    }

    const clickHandler = e => {
        if(e.detail === 1) {
            toggleSubscription()
        }
    }
            
    useEffect(() => {
        checkFollow()
    }, [user])

    return (
        <button 
            className={`FollowBtn${isUserFollowing ? ' active' : ''}`}
            onClick={clickHandler}
        >
            <p>{isUserFollowing ? null : (
                <i className='fas fa-plus'></i>
            )}</p>

            <p>{isUserFollowing ? 'following': 'follow'}</p>
        </button>
    )
}

FollowBtn.propTypes = {
    id: PropTypes.string.isRequired,
    callback: PropTypes.func
}