// Hooks
import { useState, useEffect } from 'react'
// Servicios
import notaServicio from './servicios/notas'
// Componentes
import Nota from './componentes/Notas/Nota'
import Notificacion from './componentes/Rutas/Notificacion'
import Footer from './componentes/Rutas/Footer'

const App = () => {
  // Estados
  const [notas, setNotas] = useState([])
  const [nuevaNota, setNuevaNota] = useState('')
  const [mostrar, setMostrar] = useState(true)
  const [mensajeError, setMensajeError] = useState(null)

  // Hooks
  useEffect(() => {
    console.log('effecto')
    notaServicio
    .obtener()
    .then(notasIniciales => {
      console.log('Promesa cumplida')
      setNotas(notasIniciales)
    })
  }, []) // Si la lista esta vacia el efecto se ejecuta con el primer renderizado
  console.log('Se muestran', notas.length, 'notas')

  // Funciones
  // Función para añadir una nota
  const addNota = (e) => {
    e.preventDefault() // Evita que se recargue la página

    // Verificamos si la nota existe ya
    const notaExiste = notas.find(nota => nota.contenido.trim().toLowerCase() === nuevaNota.trim().toLowerCase())

    if (notaExiste) {
      // Mostramos notificación y salimos de la función
      setNuevaNota('')
      setMensajeError(`La nota "${nuevaNota}" ya existe`)
      setTimeout(() => {
      setMensajeError(null)
        }, 5000)
       return
    }

    // Objeto con los valores de la nota
    const notaObjeto = {
      contenido: nuevaNota,
      importante: Math.random() < 0.5, // Probabilidad del 50% de que sea importante o no
    }

    notaServicio
    .crear(notaObjeto)
    .then(nuevaNota => {
      setNotas(notas.concat(nuevaNota))
      setNuevaNota('')
    })
    .catch(error => {
      setMensajeError(
        'Error al intentar añadir la nota'
      )
      setTimeout(() => {
        setMensajeError(null)
      }, 5000) // 5 segundos
    })
  }
  // Controlador de eventos para manejar la creación de una nota
  const handleNotaChange = (e) => {
    console.log(e.target.value)
    setNuevaNota(e.target.value)
  }

  // Función para mostrar solo las notas importantes
  const notasFiltradas = mostrar
  ? notas
  : notas.filter(nota => nota.importante)

  // Función para mostrar el boton de filtrado de notas
  const filtradoBtn = () => {
    return (
      <div>
        <button onClick={() =>setMostrar(!mostrar)}>
          Mostrar {mostrar ? 'Importantes' : 'Todas'}
        </button>
      </div>
    )
  }

  // Función para cambiar la importancia de una nota
  const cambiarImportancia = (id) => {
    console.log(`importancia de ${id} necesita ser cambiada`)
    const nota = notas.find(n => n.id === id) // Busca la nota a actualizar por id
    const notaCambioImportancia = {...nota, importante: !nota.importante} // Cambiar la importancia

    notaServicio
    .cambiar(id, notaCambioImportancia)
    .then(notaCambiada => {
      setNotas(notas.map(nota => nota.id !== id ? nota: notaCambiada))
    })
    .catch(error => {
      setMensajeError(
        `Nota ${nota.contenido} no se encuentra en el servidor`
      )
      setTimeout(() => {
        setMensajeError(null)
      }, 5000) // 5 segundos
      setNotas(notas.filter(n => n.id !== id))
    })
  }

  // Función para manejar la eliminación de una nota
  const handleEliminarNota = (id) => {
    console.log(`Nota ${id} desea ser eliminada`)
    const nota = notas.find(n => n.id === id) // Busca la nota a eliminar por id

    if (!nota) {
      return
    }

    if (window.confirm(`¿Está seguro que desea eliminar la nota ${nota.contenido}`)) {
      notaServicio
      .eliminar(id)
      .then(() => {
        setNotas(notas.filter(nota => nota.id !== id))
      })
      .catch(error => {
      setMensajeError(
        `No se pudo eliminar la nota "${nota.contenido}"`
      )
      setTimeout(() => {
        setMensajeError(null)
      }, 5000) // 5 segundos
      setNotas(notas.filter(n => n.id !== id))
    })
    }
  }

  return (
    <div>
      <h1>Notas</h1>
      <Notificacion mensaje={mensajeError} />
      <div>
        {filtradoBtn()}
      </div>
      <ul>
        {notasFiltradas.map(nota => 
        <Nota key={nota.id} nota={nota} 
        cambiarImportancia={() => cambiarImportancia(nota.id)}
        onDelete={() => handleEliminarNota(nota.id)}
        />
        )}
      </ul>
      <form onSubmit={addNota}>
        <input value={nuevaNota} onChange={handleNotaChange}/>
        <button type='submit'>añadir</button>
      </form>
      <Footer />
    </div>
  )
}

export default App
