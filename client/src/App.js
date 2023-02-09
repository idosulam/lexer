import Navbar from "./components/Navbar/Navbar"
import Home from "./components/Pages/Home"
import Projects from "./components/Pages/Projects"
import Show from "./components/Pages/Show"
import { Route, Routes } from "react-router-dom"
import React from "react"

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/show" element={<Show />} />
        </Routes>
      </div>
    </>
    
  )
}

export default App
