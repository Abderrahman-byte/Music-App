import React, { createContext, useContext } from 'react'

export const ClassWithMultipleContexts = (Component, contexts) => {   
    const MultipleContexts = createContext(null)
    Component.contextType = MultipleContexts

    const MultipleContextsProvider = (props) => {
        const contextMap = {}

        for(let i in contexts) {
            contextMap[i] = useContext(contexts[i])
        }

        return (
            <MultipleContexts.Provider value={contextMap}>
                <Component {...props} />
            </MultipleContexts.Provider>
        )
    }

    return MultipleContextsProvider
}