import React, { useState } from 'react'

import '../styles/SearchBar.scss'

export const SearchBar = () => {
    const [query, setQuery] = useState('')

    const handleSubmit = e => {
        if(query === '' || query === null || query === undefined) e.preventDefault()
    }

    return (
        <form className='SearchBar' onSubmit={handleSubmit} role='search' action='/search'>
            <input name='query' value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
            <button>
                <i className='fas fa-search'></i>
            </button>
        </form>
    )
}