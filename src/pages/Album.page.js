import React from 'react'

import { LoadingModel } from '../components/LoadingModel'
import { ModelsContext } from '../context/ModelsContext'

export class AlbumPage extends React.Component {
    static contextType = ModelsContext

    state = {
        data: null,
        isLoading: true,
        items: [],
        error: false
    }

    componentDidMount = () => {
        this.fetchAlbumData()
    }

    fetchAlbumData = async () => {
        const { openModel, closeModel } = this.context
        openModel(<LoadingModel msg='Loading Album data' />, false)

        const id = this.props?.match?.params?.id
        const req = await fetch(`${process.env.API_URL}/api/music/album/${id}`)

        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            const items = data.tracks || []
            const newState = { data, items, isLoading: false , error: false}
            this.setState({...this.state, ...newState})
        } else {
            console.log(await req.json())
            this.setState({...this.state, error: true})
        }
        closeModel()
    }

    render = () => {
        return (
            <div className='AlbumPage'>
                
            </div>
        )
    }
}