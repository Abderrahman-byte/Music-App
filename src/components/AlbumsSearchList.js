import React, { createRef } from 'react'
import PropTypes from 'prop-types'

import { AlbumCard } from './AlbumCard'
import { ModelsContext } from '../context/ModelsContext'
import { LoadingModel } from './LoadingModel'

export class AlbumsSearchList extends React.Component {
    static contextType = ModelsContext

    state = {
        data: [...this.props.data],
        currentPage: 1,
        itemsPerPage: 5,
        containerRef: createRef(),
        itemsPerLine: 5,
        total: undefined
    }

    componentDidMount = () => {
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

    fetchNextAlbumsData = async () => {
        const { openModel, closeModel } = this.context
        openModel(<LoadingModel msg='Load More Albums' />)
        const nextPage = this.state.currentPage + 1
        const index = (nextPage * this.state.itemsPerPage) - this.state.itemsPerPage
        const url = `api/music/search/albums?query=${this.props.query}&limit=${this.state.itemsPerPage}&index=${index}`
        const req = await fetch(`${process.env.API_URL}/${url}`)

        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            this.setState(prevState => {
                return {
                    data: [...prevState.data, ...data.data],
                    total: data.total,
                    currentPage: nextPage
                }
            })
        } else {
            console.error(await req.json())
        }
        closeModel()
    }

    render = () => {
        return (
            <div className='ArtistAlbums' ref={this.state.containerRef}>
                <div className='albums-container'>
                    {this.state.data.map(item => <AlbumCard itemsPerLine={this.state.itemsPerLine} key={item.id} data={item} />)}
                    <button onClick={this.fetchNextAlbumsData} className='add-more'>Load More</button>
                </div>
            </div>
        )
    }
}

AlbumsSearchList.propTypes = {
    data: PropTypes.array.isRequired,
    query: PropTypes.string.isRequired
}