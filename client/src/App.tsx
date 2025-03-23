import { Suspense } from "react"
import { BrowserRouter, Routes,Route } from "react-router-dom"
import Dashboard from "./pages/dashboard"

function App() {

  return (
    <>
    <Suspense fallback={"loadinggg......"}>
      <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
      </BrowserRouter>
    </Suspense>
    </>
  )
}

export default App
