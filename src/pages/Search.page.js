import React from 'react'

import { parseQuery } from '../utils/generic'

export class SearchPage extends React.Component {
    state = {
        query: null
    }

    componentDidMount = () => {
        this.getQuery()
    }

    getQuery = () => {
        const queryString = this.props.location?.search
        const parsed = parseQuery(queryString)
        let query

        if(parsed.query === null || parsed.query === undefined) {
            throw Error('parsed query is null or undefined')
        } else if(Array.isArray(parsed.query)) {
            query = parsed.query[0]
        } else {
            query = parsed.query
        }

        this.setState({query})
    }
    
    render = () => {
        return (
            <div className='SearchPage page'></div>
        )
    }
}