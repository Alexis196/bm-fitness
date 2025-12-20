import './Table.css'
import Tr from '../Tr/Tr'
import Th from '../Th/Th'
import Td from '../Td/Td'
import { useContext, useEffect, useState, useMemo } from "react"
import { ClientContext } from "../../context/ClientContext"

const Table = () => {
  const { clients, getClients } = useContext(ClientContext)
  const [clientesOrdenados, setClientesOrdenados] = useState([])

  useEffect(() => {
    getClients()
  }, [])

  // Función para formatear fecha
  const formatearFecha = (fechaString) => {
    if (!fechaString) return ''
    
    try {
      const fecha = new Date(fechaString)
      
      if (isNaN(fecha.getTime())) return ''
      
      const dia = String(fecha.getDate()).padStart(2, '0')
      const mes = String(fecha.getMonth() + 1).padStart(2, '0')
      const año = fecha.getFullYear()
      
      return `${dia}-${mes}-${año}`
    } catch (error) {
      console.error('Error formateando fecha:', error)
      return ''
    }
  }

  // Función para determinar el estado de la suscripción
  const getEstadoSuscripcion = (fechaFinString) => {
    if (!fechaFinString) return 'normal'
    
    const hoy = new Date()
    const fechaFin = new Date(fechaFinString)
    
    // Si la fecha es inválida
    if (isNaN(fechaFin.getTime())) return 'normal'
    
    // Diferencia en días
    const diffTime = fechaFin - hoy
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return 'vencido' // Fecha pasada
    } else if (diffDays <= 5) {
      return 'por-vencer' // 5 días o menos para vencer
    }
    
    return 'normal'
  }

  // Función para ordenar clientes (vencidos primero, luego por vencer, luego normales)
  const ordenarClientes = useMemo(() => {
    return [...clients].sort((a, b) => {
      const estadoA = getEstadoSuscripcion(a.fechaFin)
      const estadoB = getEstadoSuscripcion(b.fechaFin)
      
      // Prioridad: vencido > por-vencer > normal
      const prioridad = {
        'vencido': 0,
        'por-vencer': 1,
        'normal': 2
      }
      
      if (prioridad[estadoA] !== prioridad[estadoB]) {
        return prioridad[estadoA] - prioridad[estadoB]
      }
      
      // Si mismo estado, ordenar por fecha de vencimiento más próxima
      const fechaA = new Date(a.fechaFin)
      const fechaB = new Date(b.fechaFin)
      return fechaA - fechaB
    })
  }, [clients])

  // Obtener clase CSS según estado
  const getClaseEstado = (estado) => {
    switch(estado) {
      case 'vencido':
        return 'fila-vencida'
      case 'por-vencer':
        return 'fila-por-vencer'
      default:
        return ''
    }
  }

  return (
    <table className='table'>
      <thead>
        <Tr>
          <Th>#</Th>
          <Th>Nombre</Th>
          <Th>Apellido</Th>
          <Th>DNI</Th>
          <Th>Disciplina</Th>
          <Th>Inicio</Th>
          <Th>Fin</Th>
          <Th>Estado</Th>
        </Tr>
      </thead>

      <tbody>
        {ordenarClientes.map((client, index) => {
          const estado = getEstadoSuscripcion(client.fechaFin)
          const claseFila = getClaseEstado(estado)
          
          return (
            <Tr key={client.id} className={claseFila}>
              <Td>{index + 1}</Td>
              <Td>{client.nombre}</Td>
              <Td>{client.apellido}</Td>
              <Td>{client.dni || 'N/A'}</Td>
              <Td>{client.disciplina}</Td>
              <Td>{formatearFecha(client.fechaInicio)}</Td>
              <Td>{formatearFecha(client.fechaFin)}</Td>
              <Td>
                <span className={`badge-estado estado-${estado}`}>
                  {estado === 'vencido' ? 'Vencido' : 
                   estado === 'por-vencer' ? 'Por vencer' : 'Activo'}
                </span>
              </Td>
            </Tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default Table