import React, { createRef } from 'react'
import PropTypes from 'prop-types'

import '../styles/ArtistsSearchList.scss'

import { ArtistCard } from './ArtistCard'
import { ModelsContext } from '../context/ModelsContext'
import { LoadingModel } from './LoadingModel'

export class ArtistsSearchList extends React.Component {
    static contextType = ModelsContext

    state = {
        data: [...this.props.data],
        currentPage: 1,
        itemsPerPage: 5,
        itemsPerLine: 1,
        containerRef: createRef(),
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

    fetchNextArtistsData = async () => {
        const { openModel, closeModel } = this.context
        openModel(<LoadingModel msg='Loading More Artists' />)
        const nextPage = this.state.currentPage + 1
        const index = (nextPage * this.state.itemsPerPage) - this.state.itemsPerPage
        const url = `api/music/search/artists?query=${this.props.query}&limit=${this.state.itemsPerPage}&index=${index}`
        const req = await fetch(`${process.env.API_URL}/${url}`)

        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            
            this.setState(prevState => {
                return {
                    data: [...prevState.data, ...data.data],
                    currentPage: nextPage,
                    total: data.total
                }
            })
        } else {
            console.error(await req.json())
        }
        closeModel()
    }

    render = () => {
        return (
            <div className='ArtistsSearchList' ref={this.state.containerRef}>
                <h6 className='title'>Artists</h6>
                <div className='cards-container'>
                    {this.state.data.map(artist => <ArtistCard 
                        key={artist.id} 
                        data={artist} 
                        itemsPerLine={this.state.itemsPerLine} 
                    />)}
                </div>

                {(this.state.total ? this.state.data.length < this.state.total : true) ? (
                    <button onClick={this.fetchNextArtistsData} className='add-more'>Load More</button>
                ): null }
            </div>
        )
    }
}

ArtistsSearchList.propTypes = {
    data: PropTypes.array.isRequired,
    query: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired
}