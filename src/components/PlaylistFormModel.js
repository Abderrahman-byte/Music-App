import React from 'react'
import PropTypes from 'prop-types'

import '../styles/PlaylistFormModel.scss'

import { getCookie } from '../utils/http'

export class PlaylistFormModel extends React.Component {
    state = {
        data: {...this.props.initData},
        errors : []
    }

    componentDidMount = () => {
        if(this.props.edit && (!this.props.id || this.props.id === '')) {
            throw Error('Cannot edit playlist without providing its id')
        } 
    }

    handleChanges = (e) => {
        const data = {...this.state.data}
        
        if(e.target.type === 'checkbox') {
            data[e.target.name] = e.target.checked
        } else {
            data[e.target.name] = e.target.value
        } 

        this.setState({ data })
    }

    verifieData = () => {
        const data = this.state.data

        if(data.title === '') {
            this.setState({ errors: ['Playlist Title is required.']})
            return false
        }

        if(data.title.length < 6) {
            this.setState({ errors: ['Playlist Title must contain at least 6 characters.']})
            return false
        }

        this.setState({ errors: []})
        return true
    }

    savePlaylist = async () => {
        const data = JSON.stringify(this.state.data)
        const method = this.props.edit ? 'PUT' : 'POST'
        const path = this.props.edit ? `api/playlists/list/${this.props.id}` : `api/playlists/`

        const req = await fetch(`${process.env.API_URL}/${path}`, {
            method: method,
            credentials: 'include',
            body: data,
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken')}
        })

        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            data.tracks = []
            this.props.callback(data)
        } else {
            const response = await req.json()
            const detail = response.detail || 'Something went wrong'
            this.setState({ errors: [detail]})
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const dataVerified = this.verifieData()

        if(dataVerified) {
            this.savePlaylist()
        }
    } 

    render = () => {
        return (
            <form onSubmit={this.handleSubmit} className='form model PlaylistFormModel'>
                <div className='form-div form-header'>
                    <h6 className='title'>{this.props.edit ? 'Modifie Playlist' : 'Create Playlist'}</h6>
                </div>

                <div className='form-div'>
                    <input 
                        value={this.state.data.title}
                        onChange={this.handleChanges}
                        name='title' 
                        type='text' 
                        className='form-control' 
                        placeholder='Playlist title' 
                        required 
                    />
                </div>

                <div className='form-div'>
                    <textarea 
                        value={this.state.data.description}
                        onChange={this.handleChanges}
                        name='description' 
                        className='form-control' 
                        placeholder='Playlist description (optional)' 
                    />
                </div>

                <div className='form-div form-inline'>
                    <div className='checkbox'>
                        <input checked={this.state.data.is_public} onChange={this.handleChanges} name='is_public' type='checkbox' />
                        <span className='checkmark' />
                    </div>
                    <label>Public ?</label>
                </div>

                {this.state.errors && this.state.errors.length > 0 ? (
                    <div className='form-div errors-div'>
                        {this.state.errors.map((error, i) => (
                            <p className='error' key={i}>{error} </p>
                        ))}
                    </div>
                ) : null}

                <div className='form-div'>
                    <button className='submit-btn'>Save</button>
                </div>
            </form>
        )
    }
}

PlaylistFormModel.propTypes = {
    callback: PropTypes.func.isRequired,
    initData: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        is_public: PropTypes.bool,
    }),
    edit: PropTypes.bool,
    id: PropTypes.string
}

PlaylistFormModel.defaultProps = {
    initData : {
        title: '',
        description: '',
        is_public: false,
    },
    edit: false
}