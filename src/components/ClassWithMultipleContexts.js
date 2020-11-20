import React, { createContext, useContext, useState } from 'react'

export const NestedProviders = ({Provider, others, children}) => {
    const [NextProvider, setNextProvider] = useState(() => {
        return others[0] || null
    })

    const [otherProviders, setOtherProviders] = useState(() => {
        return others.length > 1 ? others.slice(1) : [] 
    })

    return (
        <Provider>
            {NextProvider ? (
                <NextProvider otherProviders={otherProviders}>
                    {children}
                </NextProvider>
            ) : ({children})}
        </Provider>
    )
}

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

export const ClassWithMultipleContextsProvided = (Component, contexts) => {   
    const MultipleContexts = createContext(null)
    Component.contextType = MultipleContexts

    const MultipleContextsProvider = (props) => {
        const contextMap = {}

        contexts.forEach(contextObj => {
            contextMap[contextObj.context.displayName] = contextObj.context
        })

        return (
            <MultipleContexts.Provider value={contextMap}>
                <Component {...props} />
            </MultipleContexts.Provider>
        )
    }

    return (props) => {
        const [providers, setProviders] = useState(() => {
            return contexts.map(contextObj => contextObj.provider)
        })

        return (
            <NestedProviders Provider={providers[0]} others={providers.slice(1)}>
                <MultipleContextsProvider {...props} />
            </NestedProviders> 
        )
    }

    return MultipleContextsProvider
}