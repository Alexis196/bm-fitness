import './Table.css'
import Tr from '../Tr/Tr'
import Th from '../Th/Th'
import Td from '../Td/Td'

const Table = () => {
  return (
    <table className='table'>
      <thead>
        <Tr>
          <Th>Producto</Th>
          <Th>Precio</Th>
        </Tr>
      </thead>
      <tbody>
        <Tr>
          <Td>Anillo</Td>
          <Td>$1500</Td>
        </Tr>
      </tbody>
    </table>
  )
}

export default Table
