import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { PlaylistRow } from './PlaylistRow'

import '../styles/TableOfPlaylists.scss'

export class TableOfPlaylists extends Component {
    render = () => {
        return (
            <table className='TableOfPlaylists'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Playlist</th>
                        <th>Author</th>
                        <th>Tracks</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.data?.map((playlist, i) => <PlaylistRow key={playlist.id} data={playlist} index={i} />)}
                </tbody>
            </table>
        )
    }
}

TableOfPlaylists.propTypes = {
    data: PropTypes.array.isRequired,
    withAuthor: PropTypes.bool
}

TableOfPlaylists.defaultProps = {
    withAuthor: true
}