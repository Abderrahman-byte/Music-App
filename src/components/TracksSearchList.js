import React from 'react'
import PropTypes from 'prop-types'

import '../styles/TracksSearchList.scss'

import { PlaylistTable } from './PlaylistTable'

export class TracksSearchList extends React.Component {
    state = {
        data: [...this.props.data],
        currentPage: 1,
        itemsPerPage : this.props.max < 5 ? this.props.max : 5
    }

    getNextData = async () => {
        const nextPage = this.state.currentPage + 1
        const index = (nextPage * this.state.itemsPerPage) - this.state.itemsPerPage
        const url = `api/music/search/tracks?query=${this.props.query}&limit=${this.state.itemsPerPage}&index=${index}`
        const req = await fetch(`${process.env.API_URL}/${url}`)

        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            this.setState(prevState => {
                return { currentPage: nextPage, data: [...prevState.data, ...data.data] }
            })
        } else {
            console.error(await req.json())
        }
    }

    render = () => {
        return (
            <div className='TracksSearchList'>
                <h6 className='title'>Tracks</h6>
                <PlaylistTable items={this.state.data} withAlbum withArtist />
                {this.state.data.length < this.props.max && (this.props.total ? this.state.data.length < this.props.total : true) ? (
                    <button onClick={this.getNextData} className='add-more'>Load More</button>
                ) : null}
            </div>
        )
    }
}

TracksSearchList.propTypes = {
    data: PropTypes.array.isRequired,
    max: PropTypes.number,
    total: PropTypes.number,
    query: PropTypes.string.isRequired
}

TracksSearchList.defaultProps = {
    max: 10
}