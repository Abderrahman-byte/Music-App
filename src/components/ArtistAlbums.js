import React from 'react'
import PropTypes from 'prop-types'

import '../styles/ArtistAlbums.scss'

export class ArtistAlbums extends React.Component {
    state = {
        data: [],
        isLoading: true,
        currentPage: 1,
        itemsPerPage: 5,
    }

    componentDidMount = () => {
        this.fetchAlbumsData()
    }

    fetchAlbumsData = async () => {
        const startIndex = (this.state.currentPage * this.state.itemsPerPage ) - this.state.itemsPerPage
        const url = `api/music/artist/${this.props.id}/albums`
        const req = await fetch(`${process.env.API_URL}/${url}`)

        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            console.log(data)
        } else {
            console.error(await req.json())
        }
    }

    render = () => {
        return (
            <div className='ArtistAlbums'>
                {this.state.isLoading ? (
                    <div className='loading'>
                        <div className='lds-ring big'>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                ) : null}
            </div>
        )
    }
}

ArtistAlbums.propTypes = {
    id: PropTypes.string.isRequired
}