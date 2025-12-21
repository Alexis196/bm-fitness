// components/Buscador/Buscador.jsx
import { useState, useRef, useEffect } from 'react'
import './Search.css'

const Search = ({ onBuscar, onLimpiar, estaBuscando, totalResultados }) => {
  const [termino, setTermino] = useState("")
  const inputRef = useRef(null)
  const timeoutRef = useRef(null)

  const handleChange = (e) => {
    const nuevoTermino = e.target.value
    setTermino(nuevoTermino)

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Debounce de 300ms
    timeoutRef.current = setTimeout(() => {
      if (nuevoTermino.trim().length >= 3) {
        onBuscar(nuevoTermino.trim())
      } else if (nuevoTermino.trim() === "") {
        onLimpiar()
      }
    }, 300)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (termino.trim().length >= 3) {
        onBuscar(termino.trim())
      } else if (termino.trim() === "") {
        onLimpiar()
      }
    } else if (e.key === 'Escape') {
      handleLimpiar()
    }
  }

  const handleLimpiar = () => {
    setTermino("")
    onLimpiar()
    inputRef.current?.focus()
  }

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="barra-busqueda">
      <div className="buscador-container">
        <div className="buscador-input-wrapper">
          {/* Ícono de búsqueda con SVG (sin react-icons) */}
          <svg 
            className="icono-busqueda" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          
          <input
            ref={inputRef}
            type="text"
            className="buscador-input"
            placeholder="Buscar por nombre, apellido, DNI o disciplina..."
            value={termino}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          
          {termino && (
            <button 
              className="boton-limpiar-busqueda"
              onClick={handleLimpiar}
              aria-label="Limpiar búsqueda"
              title="Limpiar búsqueda"
            >
              {/* Ícono X con SVG */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18" strokeWidth="2" strokeLinecap="round"/>
                <path d="M6 6L18 18" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
        
        <div className="info-busqueda">
          {termino.length > 0 && termino.length < 3 && (
            <span className="mensaje-ayuda">
              Escribe al menos 3 caracteres para buscar...
            </span>
          )}
          {estaBuscando && termino.length >= 3 && (
            <span className="resultados-busqueda">
              {totalResultados} resultado{totalResultados !== 1 ? 's' : ''} encontrado{totalResultados !== 1 ? 's' : ''} para "{termino}"
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search