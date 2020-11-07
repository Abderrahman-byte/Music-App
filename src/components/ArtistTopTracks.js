import React from 'react'
import PropTypes from 'prop-types'

import '../styles/ArtistTopTracks.scss'

import { PlaylistTable } from './PlaylistTable'

export class ArtistTopTracks extends React.Component {
    state = {
        currentPage: 1,
        itemsPerPage: 5,
        data: [...this.props.top?.data] || []
    }

    fetchTopTracks = async () => {
        if(this.state.data >= this.props.top.total) return

        const nextPage = this.state.currentPage + 1
        const startIndex = (nextPage * this.state.itemsPerPage) - this.state.itemsPerPage
        const url = `api/music/artist/${this.props.id}/top?index=${startIndex}&limit=${this.state.itemsPerPage}`
        const req = await fetch(`${process.env.API_URL}/${url}`)

        if(req.status >= 200 && req.status < 300) {
            const response = await req.json()
            this.setState({
                ...this.state,
                currentPage: nextPage,
                data: [...this.state.data, ...response.data]
            })
        } else {
            console.error(await req.json())
        }
    }

    render = () => {
        return (
            <div className='ArtistTopTracks'>
                <h6>Top Tracks</h6>
                <PlaylistTable items={this.state.data} small withAlbum />

                {this.state.data.length < this.props.max ? (
                    <button onClick={this.fetchTopTracks} className='more-btn'>load more</button>
                ) :null}
            </div>
        )
    }
}

ArtistTopTracks.propTypes = {
    top: PropTypes.shape({
        data: PropTypes.array.isRequired,
        total: PropTypes.number,
        next: PropTypes.string
    }).isRequired,
    id: PropTypes.string.isRequired,
    max: PropTypes.number
}

ArtistTopTracks.defaultProps = {
    max: 10
}