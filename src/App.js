import React from 'react'

class App extends React.Component {
    state = {
        title: 'Abderrahmane'
    }

    render = () => {
        console.log('we good')
        return (
            <div className={styles.App}>
                <h1>{this.state.title}</h1>
            </div>
        )
    }
}

export default App ;
