// Buttons.js actualizado
import React, { useState, useContext } from 'react'
import { ClientContext } from '../../context/ClientContext'
import './Buttons.css'

const Buttons = ({ client, onClientUpdated }) => {
    const {
        actualizarCliente,
        eliminarCliente,
        extenderSuscripcion,
        loading
    } = useContext(ClientContext)

    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({
        nombre: client.nombre || '',
        apellido: client.apellido || '',
        dni: client.dni || '',
        disciplina: client.disciplina || '',
        fechaInicio: client.fechaInicio || '',
        fechaFin: client.fechaFin || ''
    })

    // Función auxiliar para formatear fecha
    const formatDateForInput = (dateString) => {
        if (!dateString) return ''
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return ''
            return date.toISOString().split('T')[0]
        } catch {
            return ''
        }
    }

    // Manejar cambios en el formulario
    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Iniciar edición
    const handleStartEdit = () => {
        setEditForm({
            nombre: client.nombre || '',
            apellido: client.apellido || '',
            dni: client.dni || '',
            disciplina: client.disciplina || '',
            fechaInicio: formatDateForInput(client.fechaInicio),
            fechaFin: formatDateForInput(client.fechaFin)
        })
        setIsEditing(true)
    }

    // Cancelar edición
    const handleCancelEdit = () => {
        setIsEditing(false)
    }

    // Guardar cambios
    const handleSaveEdit = async () => {
        if (!editForm.nombre || !editForm.apellido || !editForm.dni) {
            alert('Nombre, apellido y DNI son obligatorios')
            return
        }

        const resultado = await actualizarCliente(client.id, editForm)

        if (resultado.success) {
            setIsEditing(false)
            if (onClientUpdated) onClientUpdated()
        } else {
            alert(`Error: ${resultado.message}`)
        }
    }

    // En Buttons.js - actualizar handleExtendMonth
    const handleExtendMonth = async () => {
        if (!confirm(`¿Extender un mes la suscripción de ${client.nombre} ${client.apellido}?\n\nLa fecha de inicio se actualizará a hoy y la nueva fecha de vencimiento será dentro de 30 días.`)) {
            return
        }

        const resultado = await extenderSuscripcion(client.id, 1)

        if (resultado.success) {
            alert(`✅ Suscripción extendida 1 mes\n📅 Nueva fecha de inicio: ${resultado.nuevaFechaInicio}\n📅 Nueva fecha de vencimiento: ${resultado.nuevaFechaFin}`)
            if (onClientUpdated) onClientUpdated()
        } else {
            alert(`❌ Error: ${resultado.message}`)
        }
    }

    // O si prefieres extender desde la última fecha:
    const handleExtendFromLastDate = async () => {
        if (!confirm(`¿Extender un mes la suscripción de ${client.nombre} ${client.apellido} desde la última fecha de vencimiento?`)) {
            return
        }

        const resultado = await extenderDesdeUltimaFecha(client.id, 1)

        if (resultado.success) {
            alert(`✅ Suscripción extendida 1 mes\n📅 Nueva fecha de vencimiento: ${resultado.nuevaFechaFin}`)
            if (onClientUpdated) onClientUpdated()
        } else {
            alert(`❌ Error: ${resultado.message}`)
        }
    }

    // Eliminar cliente
    const handleDelete = async () => {
        if (!confirm(`¿Está seguro de eliminar a ${client.nombre} ${client.apellido}? Esta acción no se puede deshacer.`)) {
            return
        }

        const resultado = await eliminarCliente(client.id)

        if (resultado.success) {
            alert('Cliente eliminado correctamente')
            if (onClientUpdated) onClientUpdated()
        } else {
            alert(`Error: ${resultado.message}`)
        }
    }

    // Si está en modo edición
    if (isEditing) {
        return (
            <div className="edit-form-container">
                <div className="edit-form-grid">
                    <input
                        type="text"
                        name="nombre"
                        value={editForm.nombre}
                        onChange={handleEditChange}
                        className="edit-input"
                        placeholder="Nombre"
                        required
                        disabled={loading}
                    />
                    <input
                        type="text"
                        name="apellido"
                        value={editForm.apellido}
                        onChange={handleEditChange}
                        className="edit-input"
                        placeholder="Apellido"
                        required
                        disabled={loading}
                    />
                    <input
                        type="text"
                        name="dni"
                        value={editForm.dni}
                        onChange={handleEditChange}
                        className="edit-input"
                        placeholder="DNI"
                        required
                        disabled={loading}
                    />
                    <select
                        name="disciplina"
                        value={editForm.disciplina}
                        onChange={handleEditChange}
                        className="edit-select"
                        disabled={loading}
                    >
                        <option value="">Disciplina</option>
                        <option value="Musculación">Musculación</option>
                        <option value="Crossfit">Crossfit</option>
                        <option value="Funcional">Funcional</option>
                        <option value="Yoga">Yoga</option>
                        <option value="Pilates">Pilates</option>
                    </select>
                    <input
                        type="date"
                        name="fechaInicio"
                        value={editForm.fechaInicio}
                        onChange={handleEditChange}
                        className="edit-input"
                        disabled={loading}
                    />
                    <input
                        type="date"
                        name="fechaFin"
                        value={editForm.fechaFin}
                        onChange={handleEditChange}
                        className="edit-input"
                        disabled={loading}
                    />
                </div>
                <div className="edit-buttons">
                    <button
                        className="btn btn-save"
                        onClick={handleSaveEdit}
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                        className="btn btn-cancel"
                        onClick={handleCancelEdit}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        )
    }

    // Modo normal
    return (
        <div className="buttons-container">
            <button
                className="btn btn-edit"
                onClick={handleStartEdit}
                disabled={loading}
            >
                Editar
            </button>
            <button
                className="btn btn-extend"
                onClick={handleExtendMonth}
                disabled={loading}
                title="Extender 1 mes (fecha inicio = hoy, fin = hoy + 30 días)"
            >
                + 1 Mes
            </button>
            <button
                className="btn btn-delete"
                onClick={handleDelete}
                disabled={loading}
            >
                Eliminar
            </button>
        </div>
    )
}

export default Buttons