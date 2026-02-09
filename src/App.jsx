import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FilterableProductTable from './Users'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FilterableProductTable />
    </>
  )
}

export default App
