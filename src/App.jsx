// Componentes
import Nota from './componentes/Notas/Nota'

const App = ({ notas }) => {
  return (
    <div>
      <h1>Notas</h1>
      <ul>
        {notas.map(nota => 
        <Nota key={nota.id} nota={nota} />
        )}
      </ul>
    </div>
  )
}

export default App
