const Nota = ({ nota, cambiarImportancia, onDelete }) => {
    const label = nota.importante
    ? 'Marcarla como importante' : 'Marcarla como no importante'
    return (
        <li className="nota"> 
            { nota.contenido } 
            <button onClick={cambiarImportancia}> {label} </button>
            <button onClick={() => onDelete(nota.id)}> Eliminar </button>
        </li>
    )
}

export default Nota