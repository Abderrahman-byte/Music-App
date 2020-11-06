import React from 'react'
import PropTypes from 'prop-types'

import '../styles/TrackRow.scss'

export const TrackRow = ({data, index, withAlbum, withArtist}) => {
    console.log(data)
    return (
        <tr className='TrackRow'>
            <td>{index}</td>
            <td className='btn-col'>
                <button className='play-btn'>
                    <i className='fas fa-play'></i>
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
}