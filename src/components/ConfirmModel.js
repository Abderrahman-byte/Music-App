import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import '../styles/ConfirmModel.scss'
import { ModelsContext } from '../context/ModelsContext'

export const ConfirmModel = ({callback, msg, action}) => {
    const { closeModel } = useContext(ModelsContext)

    return (
        <div className='model ConfirmModel'>
            <h6 className='title'>Are You Sure?</h6>
            <p className='msg'>{msg}</p>
            
            <div className='btns-div'>
                <button onClick={closeModel} className='cancel-btn'>Cancel</button>
                <button onClick={callback} className='action-btn'>{action}</button>
            </div>
        </div>
    )
}

ConfirmModel.propTypes = {
    callback: PropTypes.func.isRequired,
    msg: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired
}