// components/Functions/Functions.jsx
import React, { useState, useContext, useCallback } from 'react'
import { ClientContext } from '../../context/ClientContext'
import AddClient from '../AddClient/AddClient'
import Search from '../Search/Search'
import './Functions.css'

const Functions = ({ onSearchUpdate }) => {
    const { clients } = useContext(ClientContext)
    const [showModal, setShowModal] = useState(false)
    const [terminoBusqueda, setTerminoBusqueda] = useState("")
    const [estaBuscando, setEstaBuscando] = useState(false)
    const [clientesFiltrados, setClientesFiltrados] = useState([])

    const buscarClientes = useCallback((termino) => {
        if (!termino || termino.length < 3) {
            setEstaBuscando(false)
            setClientesFiltrados([])
            setTerminoBusqueda("")
            
            // Notificar al padre que se limpió la búsqueda
            if (onSearchUpdate) {
                onSearchUpdate({
                    terminoBusqueda: "",
                    estaBuscando: false,
                    clientesFiltrados: []
                })
            }
            return
        }
        
        const terminoLower = termino.toLowerCase().trim()
        
        // Filtrar clientes
        const filtrados = clients.filter(cliente => {
            if (cliente.nombre?.toLowerCase().includes(terminoLower)) return true
            if (cliente.apellido?.toLowerCase().includes(terminoLower)) return true
            if (cliente.dni?.toString().includes(termino)) return true
            if (cliente.disciplina?.toLowerCase().includes(terminoLower)) return true
            
            const nombreCompleto = `${cliente.nombre || ''} ${cliente.apellido || ''}`.toLowerCase()
            return nombreCompleto.includes(terminoLower)
        })
        
        // Actualizar estados locales
        setTerminoBusqueda(termino)
        setClientesFiltrados(filtrados)
        setEstaBuscando(true)
        
        // Notificar al padre sobre los resultados
        if (onSearchUpdate) {
            onSearchUpdate({
                terminoBusqueda: termino,
                estaBuscando: true,
                clientesFiltrados: filtrados
            })
        }
    }, [clients, onSearchUpdate])

    const limpiarBusqueda = useCallback(() => {
        setTerminoBusqueda("")
        setEstaBuscando(false)
        setClientesFiltrados([])
        
        // Notificar al padre que se limpió la búsqueda
        if (onSearchUpdate) {
            onSearchUpdate({
                terminoBusqueda: "",
                estaBuscando: false,
                clientesFiltrados: []
            })
        }
    }, [onSearchUpdate])

    const handleOpenModal = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleAddClient = (newClient) => {
        console.log('Cliente agregado:', newClient)
        setShowModal(false)
    }

    return (
        <div className="functions-container">
            <div className="functions-header">
                <button 
                    className="btn-add-client"
                    onClick={handleOpenModal}
                >
                    + Agregar Cliente
                </button>

                <Search 
                    onBuscar={buscarClientes}
                    onLimpiar={limpiarBusqueda}
                    estaBuscando={estaBuscando}
                    totalResultados={clientesFiltrados.length}
                />
            </div>

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