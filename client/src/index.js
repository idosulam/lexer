import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./components/Navbar/Navbar.css"
import { BrowserRouter } from "react-router-dom"

const root = ReactDOM.createRoot(document.getElementById("root"),     document.title = 'Code map')
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
