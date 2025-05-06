import { useState } from 'react'
import './App.css'
import Dashboard from './Pages/Dashboard'
import Header from './Pages/Header'
import ProductPage from './Components/NewProduct'; // your new page

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
        <Header/>
        <Dashboard/>
    </div>
  )
}

export default App
