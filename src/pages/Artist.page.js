import React from 'react'

import { ModelsContext } from '../context/ModelsContext'
import { LoadingModel } from '../components/LoadingModel'
import { ArtistHeader } from '../components/ArtistHeader'
import { ArtistTopTracks } from '../components/ArtistTopTracks'
import { ArtistAlbums } from '../components/ArtistAlbums'
import { ArtistNotFound } from '../components/NotFound'

export class ArtistPage extends React.Component {
    static contextType = ModelsContext

    state = {
        data: null,
        topTracks: {},
        isLoading: true,
        error: false
    }

    componentDidMount = () => {
        this.fetchArtistData()
    }

    fetchArtistData = async () => {
        const { openModel, closeModel } = this.context
        openModel(<LoadingModel msg='Loading Album data' />, false)

        const id = this.props.match?.params?.id
        const req = await fetch(`${process.env.API_URL}/api/music/artist/${id}`)
        
        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            const topTracksData = {...data.top}
            delete(data.top)

            this.setState({
                data: {...data}, 
                topTracks: {...topTracksData}, 
                isLoading: false, 
                error: false
            })

        } else {
            const data = await req.json()
            console.error(data)
            this.setState({...this.state, error: true, isLoading: false})
        }

        closeModel()
    }

    render = () => {
        if(this.state.error && !this.state.isLoading) {
            return (
                <div className='ArtistPage page'>
                    <ArtistNotFound />
                </div>
            )
        } else {
            return (
                <div className='ArtistPage page'>
                    {!this.state.isLoading ? (
                        <>
                            <ArtistHeader 
                                id={this.state.data?.id}
                                name={this.state.data?.name} 
                                picture={this.state.data?.picture_medium}
                                nb_albums={this.state.data?.nb_album}
                                nb_tracks={this.state.topTracks?.total}
                            />
    
                            <ArtistTopTracks top={this.state.topTracks} id={this.state.data?.id} />
                            
                            <ArtistAlbums id={this.state.data?.id} />
                        </>
                    ) : null}
                </div>
            )
        }
    }
}