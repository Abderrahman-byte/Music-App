import React from 'react'

import '../styles/TracksCardsContainer.scss'

import { TrackCard } from './TrackCard'

export const TracksCardsContainer = ({data}) => {
    const TracksComponents = data.map(item => <TrackCard key={item.id} data={item} />) 

    return (
        <div className='TracksCardsContainer'>
            {TracksComponents}
        </div>
    )
} 