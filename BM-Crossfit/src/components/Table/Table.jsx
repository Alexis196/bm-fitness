import './Table.css'
import Tr from '../Tr/Tr'
import Th from '../Th/Th'
import Td from '../Td/Td'
import { useContext, useEffect } from "react"
import { ClientContext } from "../../context/ClientContext"

const Table = () => {
  const { clients, getClients } = useContext(ClientContext)

  useEffect(() => {
    getClients()
  }, [])

  return (
    <table className='table'>
      <thead>
        <Tr>
          <Th>Nombre</Th>
          <Th>Apellido</Th>
          <Th>Disciplina</Th>
          <Th>Inicio</Th>
          <Th>Fin</Th>
        </Tr>
      </thead>

      <tbody>
        {clients.map(client => (
          <Tr key={client.id}>
            <Td>{client.nombre}</Td>
            <Td>{client.apellido}</Td>
            <Td>{client.disciplina}</Td>
            <Td>
              {client.fechaInicio?.toDate().toLocaleDateString()}
            </Td>
            <Td>
              {client.fechaFin?.toDate().toLocaleDateString()}
            </Td>
          </Tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
