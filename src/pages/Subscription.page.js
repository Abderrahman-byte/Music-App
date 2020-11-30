import React from 'react'

import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'
import { ClassWithMultipleContexts } from '../components/ClassWithMultipleContexts'

export class SubscriptionPage extends React.Component {
    state = {
        data: [],
        total: null,
        
    }

    componentDidMount = () => {
        this.getSubscriptions()
    }

    getSubscriptions = async () => {
        if(this.context.AuthContext.isLoading) {
            setTimeout(this.getSubscriptions, 200)
            return
        }

        const req = await fetch(`${process.env.API_URL}/api/playlists/following`, {
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
                SubscriptionPage
            </div>
        )
    }
}

export default ClassWithMultipleContexts(SubscriptionPage, { AuthContext, ModelsContext })