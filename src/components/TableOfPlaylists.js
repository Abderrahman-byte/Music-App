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
                        <th>Created date</th>
                        <th>Author</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.data?.map(playlist => <PlaylistRow key={playlist.id} data={playlist} />)}
                </tbody>
            </table>
        )
    }
}

TableOfPlaylists.propTypes = {
    data: PropTypes.array.isRequired
}