const mongoose = require('mongoose') // Libreria para objetos Mongo

mongoose.set('strictQuery', false)

// URI
const url = process.env.MONGODB_URI

console.log('Conectando a', url)

// Conexión a MongoDB
mongoose.connect(url)
.then(resultado => {
    console.log('Conectado a MongoDB')
})
.catch(error => {
    console.log('Error al intentar conectar con MongoDB', error.message)
})

// Esquema de las notas
const notaSchema = new mongoose.Schema({
    contenido: {
        type: String,
        minLength: 5,
        required: true
    },
    importante: Boolean
})

// Configuración de las notas en formato json
notaSchema.set('toJSON', {
    transform: (document, objetoDevuelto) => {
        objetoDevuelto.id = objetoDevuelto._id.toString()
        delete objetoDevuelto._id
        delete objetoDevuelto.__v
    }
})

module.exports= mongoose.model('Nota', notaSchema)