import axios from 'axios';
const baseUrl = '/api/notas'

// Servicio para obtener todas las notas
const obtener = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

// Servicio para crear notas
const crear = (nuevaNota) => {
    const request = axios.post(baseUrl, nuevaNota)
    return request.then(response => response.data)
}

// Servicio para cambiar la importancia de una nota
const cambiar = (id, notaCambiada) => {
    const request = axios.put(`${baseUrl}/${id}`, notaCambiada)
    return request.then(response => response.data)
}

// Servicio para eliminar una nota
const eliminar = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

export default {
    obtener,
    crear,
    cambiar,
    eliminar
}