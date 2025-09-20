require('dotenv').config() // Para llamar a la variable de entorno
const express = require('express') // Importa el modulo express para crear el servidor
const app = express() // Llama a la función express
const cors = require('cors') // Libreria para las solicitudes de origen cruzadas
const Nota = require('./models/nota') // Modelo Nota

// Middleware que imprime cada solicitud que se hace al servidor
const solicitudesInfo = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()
}

app.use(solicitudesInfo)
app.use(express.static('dist')) // Para llamar contenido estatico
app.use(express.json()) // Acceder al json parse
app.use(cors()) // Acceder a cors

// Ruta para obtener las notas
app.get('/api/notas', (request, response) => {
    Nota.find({}).then(notas => {
        response.json(notas)
    })
})

// Ruta para obtener una sola nota por id
app.get('/api/notas/:id', (request, response, next) => {
    Nota.findById(request.params.id).then(nota => {
        if (nota) {
            response.json(nota)
        } else {
            response.status(404).json({ error: 'Nota no encontrada' })
        }
    })
    .catch(error => next(error))
})

// Ruta para eliminar una nota por id
app.delete('/api/notas/:id', (request, response, next) => {
    Nota.findByIdAndDelete(request.params.id).then(nota => {
        if (nota) {
        response.status(204).end()  // Eliminada
      } else {
        response.status(404).json({ error: 'Nota no encontrada' })
      }
    })
    .catch(error => next(error))
})

// Ruta para crear una nota
app.post('/api/notas', (request, response, next) => {
    const body = request.body

    if (!body) {
        return response.status(400).json({ error: 'Falta el contenido de la nota' })
    }
    console.log(body)

    // Verificar si la nota existe
    Nota.findOne({ contenido: body.contenido })
    .then(notaExiste => {
        if (notaExiste) {
            return response.status(400).json({ error: 'La nota ya existe' })
        }
    })

    const nota = new Nota ({
        contenido: body.contenido,
        importante: body.importante || false
    })

    nota.save().then(notaGuardada => {
        response.json(notaGuardada)
    })
    .catch(error => next(error))
})

// Ruta para cambiar la importancia de una nota
app.put('/api/notas/:id', (request, response, next) => {
    const { contenido, importante } = request.body

    Nota.findByIdAndUpdate(
        request.params.id, 
        {contenido, importante},
        {new: true, runValidators: true, context: 'query'}
    )
    .then(notaCambiada => {
        response.json(notaCambiada)
    })
    .catch(error => next(error))
})

// Middleware que captura solicitudes a rutas inexistentes
const rutasInexistentes = (request, response) => {
    response.status(404).send({ error: 'Ruta inexistente' })
}

app.use(rutasInexistentes)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server ejecutándose en el puerto ${PORT}`)
})