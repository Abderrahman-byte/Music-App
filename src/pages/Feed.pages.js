import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { AuthencatedOnly } from '../components/AuthenticatedOnly'

export const FeedPages = (props) => {
    
    return (
        <Switch>
            {/* <Route path={}></Route> */}
        </Switch>
    )
}

export default AuthencatedOnly(FeedPages)