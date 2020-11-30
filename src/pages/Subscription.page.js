import React, { createRef } from 'react'

import '../styles/SubscriptionsPage.scss'

import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'
import { ClassWithMultipleContexts } from '../components/ClassWithMultipleContexts'
import { PageHeader } from '../components/PageHeader'
import { LoadingModel } from '../components/LoadingModel'
import { ArtistCard } from '../components/ArtistCard'

export class SubscriptionsPage extends React.Component {
    state = {
        data: [],
        total: null,
        currentPage: 0,
        itemsPerPage: 5,
        isLoading: true,
        itemsPerLine: undefined,
        containerRef: createRef(),
    }

    componentDidMount = () => {
        this.getSubscriptions()
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

    getSubscriptions = async () => {
        if(this.context.AuthContext.isLoading) {
            setTimeout(this.getSubscriptions, 200)
            return
        } 

        if(this.state.total && this.state.data.length >= this.state.total) return

        this.context.ModelsContext.openModel(<LoadingModel msg='Getting subscriptions' />)
        this.setState({ isLoading : false })

        const nextPage = this.state.currentPage + 1
        const index = (nextPage - 1) * this.state.itemsPerPage
        const req = await fetch(`${process.env.API_URL}/api/playlists/following?limit=${this.state.itemsPerPage}&index=${index}`, {
            credentials: 'include'
        })
        
        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            this.setState({ 
                data: [...this.state.data, ...data.artists], 
                total: data.subscriptions_count, 
                currentPage: nextPage ,
                isLoading: false
            })
        } else {
            console.error(await req.json())
        }

        this.context.ModelsContext.closeModel()
    }

    render = () => {
        return (
            <div className='SubscriptionsPage page'>
                <PageHeader title='Subscriptions' />
                <div className='cards-container' ref={this.state.containerRef}>
                    {this.state.data.map(artist => <ArtistCard 
                        key={artist.id} 
                        data={artist} 
                        itemsPerLine={this.state.itemsPerLine} 
                    />)}
                </div>
                
                {!this.state.isLoading && (!this.state.total || this.state.data.length < this.state.total) ? (
                    <button className='add-more' onClick={this.getSubscriptions}>Load More</button>
                ) : (null)}
            </div>
        )
    }
}

export default ClassWithMultipleContexts(SubscriptionsPage, { AuthContext, ModelsContext })