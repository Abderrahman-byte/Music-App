import React from 'react'

import { Redirect } from 'react-router-dom'
import { ClassWithMultipleContexts } from '../components/ClassWithMultipleContexts'
import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'

export class UnAuthenticatedOnly extends React.Component {
    state = {
        isAuthenticated: false,
        isLoaded: false
    }

    componentDidMount = () => {
        this.checkAuthentication()
    }

    checkAuthentication = () => {
        if(this.context.AuthContext.isLoading) {
            setTimeout(this.checkAuthentication, 500)
        } else {
            if(this.context.AuthContext?.user && this.context.AuthContext?.user?.id) {
                this.setState({ isAuthenticated: true })
            }
            this.setState({ isLoaded: true })
            this.context.ModelsContext.closeModel()
        }
    }

    render = () => {
        if(!this.state.isLoaded) {
            return <></>
        } else if(this.state.isAuthenticated) {
            return <Redirect to={this.props.redirectTo || '/'}></Redirect>
        } else {
            return (
                <>{this.props.children}</>
            )
        }
    }
}

export default ClassWithMultipleContexts(UnAuthenticatedOnly, {AuthContext, ModelsContext})