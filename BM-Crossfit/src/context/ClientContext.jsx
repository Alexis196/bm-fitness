import { createContext, useState } from "react"
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore"
import { db } from "../services/DataBase/database"

export const ClientContext = createContext()

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getClients = async () => {
    try {
      setLoading(true)
      setError(null)
      const ref = collection(db, "usuarios")
      const snapshot = await getDocs(ref)

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setClients(data)
    } catch (error) {
      console.error("Error al traer clientes:", error)
      setError("Error al cargar los clientes")
    } finally {
      setLoading(false)
    }
  }

  const agregarCliente = async (nuevoCliente) => {
    try {
      setLoading(true)
      setError(null)

      // Validar campos obligatorios
      if (!nuevoCliente.nombre || !nuevoCliente.apellido || !nuevoCliente.dni) {
        throw new Error("Nombre, apellido y DNI son obligatorios")
      }

      // Formatear fechas para Firebase
      const clienteFormateado = {
        ...nuevoCliente,
        // Convertir string de fecha a Timestamp de Firebase
        fechaInicio: nuevoCliente.fechaInicio 
          ? Timestamp.fromDate(new Date(nuevoCliente.fechaInicio))
          : null,
        fechaFin: nuevoCliente.fechaFin 
          ? Timestamp.fromDate(new Date(nuevoCliente.fechaFin))
          : null,
        // Agregar fecha de creación
        fechaCreacion: Timestamp.now(),
        // Agregar estado activo por defecto
        activo: true
      }

      // Remover el id temporal si existe
      delete clienteFormateado.id

      // Agregar a Firebase
      const docRef = await addDoc(collection(db, "usuarios"), clienteFormateado)
      
      // Actualizar estado local
      const clienteConId = {
        id: docRef.id,
        ...clienteFormateado,
        // Convertir Timestamps a formato legible para el estado
        fechaInicio: nuevoCliente.fechaInicio,
        fechaFin: nuevoCliente.fechaFin
      }

      setClients(prev => [...prev, clienteConId])
      
      return {
        success: true,
        message: "Cliente agregado exitosamente",
        id: docRef.id
      }
    } catch (error) {
      console.error("Error al agregar cliente:", error)
      setError(error.message || "Error al agregar el cliente")
      
      return {
        success: false,
        message: error.message || "Error al agregar el cliente"
      }
    } finally {
      setLoading(false)
    }
  }

  // Función para actualizar un cliente
  const actualizarCliente = async (id, datosActualizados) => {
    try {
      setLoading(true)
      setError(null)
      
      // Aquí iría la lógica para actualizar en Firebase
      // usando updateDoc(docRef, datosActualizados)
      
      // Actualizar estado local temporalmente
      setClients(prev => prev.map(cliente => 
        cliente.id === id ? { ...cliente, ...datosActualizados } : cliente
      ))
      
      return { success: true, message: "Cliente actualizado" }
    } catch (error) {
      console.error("Error al actualizar cliente:", error)
      setError(error.message)
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Función para eliminar un cliente
  const eliminarCliente = async (id) => {
    try {
      setLoading(true)
      setError(null)
      
      // Aquí iría la lógica para eliminar de Firebase
      // usando deleteDoc(docRef)
      
      // Actualizar estado local temporalmente
      setClients(prev => prev.filter(cliente => cliente.id !== id))
      
      return { success: true, message: "Cliente eliminado" }
    } catch (error) {
      console.error("Error al eliminar cliente:", error)
      setError(error.message)
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ClientContext.Provider
      value={{
        clients,
        loading,
        error,
        getClients,
        agregarCliente,
        actualizarCliente,
        eliminarCliente
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}

export default ClientProvider