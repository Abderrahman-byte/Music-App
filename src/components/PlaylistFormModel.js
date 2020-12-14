import React from 'react'
import PropTypes from 'prop-types'

import '../styles/PlaylistFormModel.scss'

export class PlaylistFormModel extends React.Component {
    state = {
        data: {
            title: '',
            description: '',
            is_public: false,
        },
        errors : []
    }

    handleChanges = (e) => {
        const data = {...this.state.data}
        
        if(e.target.type === 'text' || e.target.type === 'password') {
            data[e.target.name] = e.target.value
        } else if(e.target.type === 'checkbox') {
            data[e.target.name] = e.target.checked
        }

        this.setState({ data })
    }

    handleSubmit = (e) => {
        e.preventDefault()
    } 

    render = () => {
        return (
            <form onSubmit={this.handleSubmit} className='form model PlaylistFormModel'>
                <div className='form-div form-header'>
                    <h6 className='title'>Create Playlist</h6>
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

// PlaylistFormModel.propTypes = {
//     callback: PropTypes.func.isRequired
// }