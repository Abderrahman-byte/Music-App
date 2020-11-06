import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { AlbumPage } from './Album.page'
import { ArtistPage } from './Artist.page'
import { MusicPage } from './Music.page'

export const MainPages = () => {
    return (
        <Switch>
            <Route exact path='/' component={MusicPage} />
            <Route exact path='/album/:id' component={AlbumPage} />
            <Route exact path='/artist/:id' component={ArtistPage} />
        </Switch>
    )
}