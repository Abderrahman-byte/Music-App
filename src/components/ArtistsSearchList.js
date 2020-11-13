import React, { createRef } from 'react'
import PropTypes from 'prop-types'

import '../styles/ArtistsSearchList.scss'

import { ArtistCard } from './ArtistCard'

export class ArtistsSearchList extends React.Component {
    state = {
        data: [...this.props.data],
        currentPage: 1,
        itemsPerPage: 5,
        itemsPerLine: 1,
        containerRef: createRef()
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

    render = () => {
        return (
            <div className='ArtistsSearchList' ref={this.state.containerRef}>
                <h6 className='title'>Artists</h6>
                <div className='cards-container'>
                    {this.props.data.map(artist => <ArtistCard 
                        key={artist.id} 
                        data={artist} 
                        itemsPerLine={this.state.itemsPerLine} 
                    />)}
                </div>
            </div>
        )
    }
}

ArtistsSearchList.propTypes = {
    data: PropTypes.array.isRequired
}