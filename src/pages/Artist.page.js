import React from 'react'

export class ArtistPage extends React.Component {
    
    render = () => {
        return (
            <div className='ArtistPage page'>
                Artist id {this.props.match?.params?.id}
            </div>
        )
    }
}