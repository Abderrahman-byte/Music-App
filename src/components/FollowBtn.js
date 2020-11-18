import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import '../styles/FollowBtn.scss'

export const FollowBtn = ({id}) => {
    const [isUserFollowing, setFollowingState] = useState(false)

    const clickHandler = e => {
        if(e.detail === 1) {
            
        }
    }
 
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
    id: PropTypes.string.isRequired
}