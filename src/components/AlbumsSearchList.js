import React, { createRef } from 'react'
import PropTypes from 'prop-types'

import '../styles/AlbumsSearchList.scss'

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
        itemsPerLine: 5
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
            <div className='ArtistAlbums AlbumsSearchList' ref={this.state.containerRef}>
                <h6 className='title'>Albums</h6>
                <div className='albums-container'>
                    {this.state.data.map(item => <AlbumCard itemsPerLine={this.state.itemsPerLine} key={item.id} data={item} />)}    
                </div>

                {this.state.data.length < this.props.max && (this.props.total ? this.state.data.length < this.props.total : true) ? (
                    <button onClick={this.fetchNextAlbumsData} className='add-more'>Load More</button>
                ): null }
            </div>
        )
    }
}

AlbumsSearchList.propTypes = {
    data: PropTypes.array.isRequired,
    query: PropTypes.string.isRequired,
    max: PropTypes.number.isRequired
}

AlbumsSearchList.defaultProps = {
    max: 15
}