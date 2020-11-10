import React, { createRef } from 'react'
import PropTypes from 'prop-types'

import '../styles/ArtistAlbums.scss'

import { AlbumCard } from './AlbumCard'

export class ArtistAlbums extends React.Component {
    state = {
        data: [],
        isLoading: true,
        currentPage: 1,
        itemsPerPage: 5,
        total: null,
        containerRef: createRef(),
        itemsPerLine: null
    }

    componentDidMount = () => {
        this.fetchAlbumsData()
        this.getItemsPerLine()
        window.addEventListener('resize', this.getItemsPerLine)
    }
    
    componentWillUnmount = () => {
        window.removeEventListener('resize', this.getItemsPerLine)
    }

    getItemsPerLine = () => {
        const container = this.state.containerRef.current
        const itemsPerLine = Math.floor(parseFloat(getComputedStyle(container).width) / 170)
        this.setState({itemsPerLine: itemsPerLine})
    }

    fetchAlbumsData = async () => {
        const startIndex = (this.state.currentPage * this.state.itemsPerPage ) - this.state.itemsPerPage
        const url = `api/music/artist/${this.props.id}/albums?index=${startIndex}&limit=${this.state.itemsPerPage}`
        const req = await fetch(`${process.env.API_URL}/${url}`)

        if(req.status >= 200 && req.status < 300) {
            const response = await req.json()
            this.setState((prevState) => {
                return {
                    currentPage: prevState.currentPage + 1,
                    data: [...prevState.data, ...response.data],
                    total: response.total,
                    isLoading: false
                }
            })
        } else {
            console.error(await req.json())
        }
    }

    getAlbumCards = () => {
        if(this.state.data.length <= 0) return null
        return this.state.data.map(item => <AlbumCard itemsPerLine={this.state.itemsPerLine} data={item} key={item.id} />)
    }

    render = () => {
        return (
            <div className='ArtistAlbums' ref={this.state.containerRef}>
                {this.state.isLoading ? (
                    <div className='loading'>
                        <div className='lds-ring big'>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                ) : (
                    <>  
                        <h6>Albums</h6>
                        <div className='albums-container'>
                            {this.getAlbumCards()}
                        </div>

                        {this.state.total && this.state.data.length < this.state.total? (
                            <button onClick={this.fetchAlbumsData} className='add-more'>Load more</button>
                        ): (null) }
                    </>
                )}
            </div>
        )
    }
}

ArtistAlbums.propTypes = {
    id: PropTypes.string.isRequired
}