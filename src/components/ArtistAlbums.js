import React from 'react'

import '../styles/ArtistAlbums.scss'

export class ArtistAlbums extends React.Component {
    state = {
        data: [],
        isLoading: true,
        currentPage: 1,
        itemsPerPage: 5,
    }

    render = () => {
        return (
            <div className='ArtistAlbums'>
                {this.state.isLoading ? (
                    <div className='loading'>
                        <div className='lds-ring big'>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                ) : null}
            </div>
        )
    }
}