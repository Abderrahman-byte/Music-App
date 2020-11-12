import React from 'react'

import { parseQuery } from '../utils/generic'
import { ModelsContext } from '../context/ModelsContext'
import { LoadingModel } from '../components/LoadingModel'

export class SearchPage extends React.Component {
    static contextType = ModelsContext

    state = {
        query: null,
        isLoading: true,
        error: false,
        artist: null,
        artists: {
            data: [],
            total: undefined,
            currentPage: 1,
            itemsPerReq: 5
        },
        albums: {
            data: [],
            total: undefined,
            currentPage: 1,
            itemsPerReq: 5
        },
        tracks: {
            data: [],
            total: undefined,
            currentPage: 1,
            itemsPerReq: 5
        }
    }

    componentDidMount = () => {
        this.getQuery()
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(!prevState.query && this.state.query !== null && this.state.query !== undefined) this.getSearchData()
    }

    getSearchData = async () => {
        if(this.state.error || !this.state.query) return
        const { openModel, closeModel } = this.context
        openModel(<LoadingModel msg='Sync search data' />)

        const req = await fetch(`${process.env.API_URL}/api/music/search?query=${this.state.query}`)
        
        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            this.setState((prevState) => {
                return {
                    ...prevState,
                    artist: data.artist || null,
                    artists: {
                        ...prevState.artists,
                        data: [...(data.artists?.data||[])],
                        total: data.artists.total
                    },
                    albums: {
                        ...prevState.albums,
                        data: [...(data.albums?.data||[])],
                        total: data.albums.total
                    },
                    tracks: {
                        ...prevState.tracks,
                        data: [...(data.tracks?.data||[])],
                        total: data.tracks.total
                    },
                    isLoading: false  
                }
            })
        } else {
            console.error(await req.json())
            this.setState({error: false})
        }

        closeModel()
    }

    getQuery = () => {
        const queryString = this.props.location?.search
        const parsed = parseQuery(queryString)
        let query

        if(parsed.query === null || parsed.query === undefined || parsed.query === '') {
            this.setState({query: null, isLoading: false, error: true})
            return
        } 
        
        if(Array.isArray(parsed.query)) {
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