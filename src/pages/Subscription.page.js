import React from 'react'

import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'
import { ClassWithMultipleContexts } from '../components/ClassWithMultipleContexts'
import { PageHeader } from '../components/PageHeader'

export class SubscriptionPage extends React.Component {
    state = {
        data: [],
        total: null,
        currentPage: 0,
        itemsPerPage: 5
    }

    componentDidMount = () => {
        this.getSubscriptions()
    }

    getSubscriptions = async () => {
        if(this.context.AuthContext.isLoading) {
            setTimeout(this.getSubscriptions, 200)
            return
        }

        const nextPage = this.state.currentPage + 1
        const index = (nextPage - 1) * this.state.itemsPerPage
        const req = await fetch(`${process.env.API_URL}/api/playlists/following?limit=${this.state.itemsPerPage}&index=${index}`, {
            credentials: 'include'
        })
        
        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            this.setState({ data: data.artists, total: data.subscriptions_count })
        } else {
            console.error(await req.json())
        }

        this.context.ModelsContext.closeModel()
    }

    render = () => {
        return (
            <div className='SubscriptionPage page'>
                <PageHeader title='Subscriptions' />
            </div>
        )
    }
}

export default ClassWithMultipleContexts(SubscriptionPage, { AuthContext, ModelsContext })