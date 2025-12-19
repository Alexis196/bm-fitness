import { createContext, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../services/DataBase/database"

export const ClientContext = createContext()

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)

  const getClients = async () => {
    try {
      setLoading(true)
      const ref = collection(db, "usuarios")
      const snapshot = await getDocs(ref)

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setClients(data)
    } catch (error) {
      console.error("Error al traer clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ClientContext.Provider
      value={{
        clients,
        loading,
        getClients,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}

export default ClientProvider