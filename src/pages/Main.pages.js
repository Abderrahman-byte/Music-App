import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { MusicPage } from './Music.page'

export const MainPages = () => {
    return (
        <Switch>
            <Route exact path='/' component={MusicPage} />
        </Switch>
    )
}