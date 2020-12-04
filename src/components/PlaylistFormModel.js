import React from 'react'
import PropTypes from 'prop-types'

import '../styles/PlaylistFormModel.scss'

export class PlaylistFormModel extends React.Component {
    render = () => {
        return (
            <form className='form model PlaylistFormModel'>
                <div className='form-div form-header'>
                    <h6 className='title'>Create Playlist</h6>
                </div>

                <div className='form-div'>
                    <input type='text' className='form-control' placeholder='Playlist title' required />
                </div>

                <div className='form-div'>
                    <textarea className='form-control' placeholder='Playlist description (optional)' />
                </div>

                <div className='form-div form-inline'>
                    <div className='checkbox'>
                        <input type='checkbox' />
                        <span className='checkmark' />
                    </div>
                    <label>Public ?</label>
                </div>

            </form>
        )
    }
}

// PlaylistFormModel.propTypes = {
//     callback: PropTypes.func.isRequired
// }