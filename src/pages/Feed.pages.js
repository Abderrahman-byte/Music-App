import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import { AuthencatedOnly } from '../components/AuthenticatedOnly'
import PlaylistsPage from './UserPlaylists.page'
import SubscriptionPage from './Subscription.page'

export const FeedPages = (props) => {

    return (
        <Switch>
            <Route path={`${props.match.path}/subscriptions`} component={SubscriptionPage} />
            <Route path={`${props.match.path}/playlists`} component={PlaylistsPage} />
            <Redirect exact from={`${props.match.path}`}  to={`${props.match.path}/subscriptions`} />
        </Switch>
    )
}

export default AuthencatedOnly(FeedPages)