import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from "./Pages/Register"
import Layout from "./Components/Utils/Layout"
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route element={<Layout />}>
          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
