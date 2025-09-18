const express = require('express') // Importa el modulo express para crear el servidor
const app = express() // Llama a la función express
const cors = require('cors') // Libreria para las solicitudes de origen cruzadas

app.use(express.json()) // Acceder al json parse
app.use(cors()) // Acceder a cors
app.use(express.static('dist')) // Para llamar contenido estatico

// Middleware que imprime cada solicitud que se hace al servidor
const solicitudesInfo = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()
}

app.use(solicitudesInfo)

let notas = [
    {
      id: 1,
      contenido: "HTML is easy",
      importante: true
    },
    {
      id: 2,
      contenido: "Browser can execute only JavaScript",
      importante: false
    },
    {
      id: 3,
      contenido: "GET and POST are the most important methods of HTTP protocol",
      importante: true
    },
    {
      id: 4,
      contenido: "Nota de prueba",
      importante: true
    }
]

// Ruta para obtener las notas
app.get('/api/notas', (request, response) => {
    response.json(notas)
})

// Ruta para obtener una sola nota por id
app.get('/api/notas/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const nota = notas.find(nota => nota.id === id)
    console.log(nota)
    
    if (nota) {
        response.json(nota)
    } else {
        response.status(404).end()
    }
})

// Ruta para eliminar una nota por id
app.delete('/api/notas/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)

    if (!id) {
        response.status(404).end()
    }

    notas = notas.filter(nota => nota.id !== id) // Verifica que la nota ya no está
    response.status(204).end()
})

// Función para generar un Id por orden
const generarId = () => {
    const maxId = notas.length > 0
    ? Math.max(...notas.map(n => n.id))
    : 0

    return maxId + 1
}

// Ruta para crear una nota
app.post('/api/notas', (request, response) => {
    const body = request.body

    if (!body) {
        return response.status(400).json({ error: 'Falta el contenido de la nota' })
    }
    console.log(body)

    const nota = {
        contenido: body.contenido,
        importante: Boolean(body.importante) || false,
        id: generarId()
    }

    notas = notas.concat(nota)

    response.json(nota)
})

// Middleware que captura solicitudes a rutas inexistentes
const rutasInexistentes = (request, response) => {
    response.status(404).send({ error: 'Ruta inexistente' })
}

app.use(rutasInexistentes)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)