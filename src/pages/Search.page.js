import React from 'react'

import { parseQuery } from '../utils/generic'
import { ModelsContext } from '../context/ModelsContext'
import { LoadingModel } from '../components/LoadingModel'
import { ArtistDetailedCard } from '../components/ArtistDetailedCard'
import { TracksSearchList } from '../components/TracksSearchList'
import { AlbumsSearchList } from '../components/AlbumsSearchList'
import { ArtistsSearchList } from '../components/ArtistsSearchList'
import { UnknownError } from '../components/NotFound'
import { ClassWithMultipleContexts } from '../components/ClassWithMultipleContexts'
import { AuthContext } from '../context/AuthContext' 

export class SearchPage extends React.Component {
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
        if(this.state.query !== null && this.state.query !== undefined && prevState.query !== this.state.query) {
            this.getSearchData()
        }

        if(prevProps.location?.search !== this.props.location?.search) {
            this.getQuery()
            this.resetState()
        }
    }

    resetState = () => {
        this.setState({
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
        })
    }

    getSearchData = async () => {
        if(this.state.error || !this.state.query) return
        const { openModel, closeModel } = this.context.ModelsContext
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

    closeIfAuthLoaded = () => {
        const { closeModel } = this.context.ModelsContext
        let AuthIsLoading = this.context.AuthContext?.isLoading || false
         
        if(AuthIsLoading) {
            setTimeout(this.closeIfAuthLoaded, 1000)
        } else {
            closeModel()
        }
    }

    getQuery = () => {
        const queryString = this.props.location?.search
        const parsed = parseQuery(queryString)
        let query

        if(parsed.query === null || parsed.query === undefined || parsed.query === '') {
            this.setState({query: null, isLoading: false, error: true})
            this.closeIfAuthLoaded()
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
        if(this.state.error && !this.state.isLoading) {
            return (
                <div className='SearchPage page'>
                    <UnknownError />
                </div>
            )
        } else if(!this.state.isLoading && 
        this.state.artists.data.length <= 0 &&
        this.state.tracks.data.length <= 0 &&
        this.state.albums.data.length <= 0 &&
        !this.state.artist ) {
            return (
                <div className='SearchPage page'>
                    <div className='MessageAlert'>
                        <h6 className='text'>No Results Provided For "{this.state.query || ''}"</h6>
                    </div>
                </div>
            )   
        } else {
            return (
                <div className='SearchPage page'>
                    {this.state.artist ? (
                        <>
                        <ArtistDetailedCard data={this.state.artist} />
                        <div className='border' />
                        </>
                    ) : null}
    
                    {this.state.tracks.data.length > 0 && this.state.query ? (
                        <TracksSearchList 
                            data={this.state.tracks.data} 
                            max={10}
                            total={this.state.tracks.total}
                            query={this.state.query}
                        />
                    ) : null}
    
                    {this.state.artists.data.length > 0 && this.state.tracks.data.length > 0 ? (
                        <div className='border' />
                    ) : null}
    
                    {this.state.artists.data.length > 0 && this.state.query ? (
                        <ArtistsSearchList
                            total={this.state.artists.total}
                            query={this.state.query}
                            data={this.state.artists.data}
                        />
                    ) : null}
    
                    {(this.state.artists.data.length > 0 || this.state.tracks.data.length > 0) &&
                    this.state.albums.data.length > 0 ? (
                        <div className='border' />
                    ) : null}
    
                    {this.state.albums.data.length > 0 && this.state.query ? (
                        <AlbumsSearchList 
                            data={this.state.albums.data} 
                            query={this.state.query}
                            total={this.state.albums.total}
                            max={15}
                        />
                    ) : null}
                </div>
            )
        }
    }
}

export default ClassWithMultipleContexts(SearchPage, {ModelsContext, AuthContext})