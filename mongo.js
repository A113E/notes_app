const mongoose = require('mongoose') // Libreria para objetos Mongo

if (process.env.length < 3) {
    console.log('Proporciona una contraseña valida')
    process.exit(1)
}

const password = process.argv[2]

// URI
const url =
`mongodb+srv://admin:${password}@cluster0.lm4im.mongodb.net/Notas_App?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

// Esquema de las notas
const notaSchema = new mongoose.Schema({
    contenido: String,
    importante: Boolean
})

const Nota = mongoose.model('Nota', notaSchema)

const nota = new Nota({
    contenido: 'HTML is easy',
    importante: true
})

nota.save().then(result => {
    console.log('Nota guardada')
    mongoose.connection.close()
})