import React, { useState } from 'react'

import '../styles/SearchBar.scss'

export const SearchBar = () => {
    const [query, setQuery] = useState('')

    return (
        <form className='SearchBar'>
            <input name='query' value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="false" />
            <button>
                <i className='fas fa-search'></i>
            </button>
        </form>
    )
}