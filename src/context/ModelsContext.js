import React, { createContext, useState } from 'react'

export const ModelsContext = createContext({})

export const ModelsProvider = ({children}) => {
    const [isOpen, setOpenStatus] = useState(false)
    const [model, setModel] = useState(null)
    const [isClosable, setClosableState] = useState(false)

    const openModel = (model, isClosable = false) => {
        setModel(model)
        setOpenStatus(true)
        setClosableState(isClosable)
    }

    const closeModel = () => {
        setModel(null)
        setOpenStatus(false)
        setClosableState(false)
    }

    return (
        <ModelsContext.Provider value={openModel, closeModel}>
            {children}
        </ModelsContext.Provider>
    )
}