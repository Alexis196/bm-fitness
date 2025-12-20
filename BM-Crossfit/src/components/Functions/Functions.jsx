import React, { useState } from 'react'
import AddClient from '../AddClient/AddClient'
import './Functions.css'

const Functions = () => {
    const [showModal, setShowModal] = useState(false)

    const handleOpenModal = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleAddClient = (newClient) => {
        // Esta función se llamará cuando se agregue un cliente exitosamente
        console.log('Cliente agregado:', newClient)
        setShowModal(false) // Cerrar modal después de agregar
    }

    return (
        <div className="functions-container">
            <div className="functions-buttons">
                <button 
                    className="btn-add-client"
                    onClick={handleOpenModal}
                >
                    + Agregar Cliente
                </button>
                {/* Puedes agregar más botones aquí */}
                {/* <button className="btn-export">Exportar</button> */}
            </div>

            {/* Modal para agregar cliente */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Agregar Nuevo Cliente</h2>
                            <button 
                                className="modal-close"
                                onClick={handleCloseModal}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <AddClient 
                                onSuccess={handleAddClient}
                                onClose={handleCloseModal}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Functions