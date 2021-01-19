import React from 'react'
import { ClassWithMultipleContexts } from '../components/ClassWithMultipleContexts'

import { ModelsContext } from '../context/ModelsContext'
import { AuthContext } from '../context/AuthContext'

export class PlaylistPage extends React.Component {
    componentDidMount = () => {
        this.closeOnAuthLoaded()
    }

    closeOnAuthLoaded = () => {
        if(this.context.AuthContext.isLoading) {
            setTimeout(this.closeOnAuthLoaded, 300)
        } else {
            this.context.ModelsContext.closeModel()
        }
    }

    render = () => {
        return (
            <div className=''>
                {this.props.match.params.id}
            </div>
        )
    }
}

export default ClassWithMultipleContexts(PlaylistPage, { ModelsContext, AuthContext })