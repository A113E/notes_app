import ReactDOM from 'react-dom/client'
import App from './App'

const notas = [
  {
    id: 1,
    contenido: 'HTML is easy',
    importante: true
  },
  {
    id: 2,
    contenido: 'Browser can execute only JavaScript',
    importante: false
  },
  {
    id: 3,
    contenido: 'GET and POST are the most important methods of HTTP protocol',
    importante: true
  }
]

ReactDOM.createRoot(document.getElementById('root')).render(<App notas={notas}/>)