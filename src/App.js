import React from 'react'
import Nav from "./components/nav/Nav.js"
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"
import Home from "./pages/Home.js"
import Minecraft from "./pages/Minecraft.js"
import DarkModeContextProvider from './components/DarkModeContext.js';

function App() {
  return (
    <DarkModeContextProvider>
      <Router>
        <div className="bg-redsand-50 dark:bg-redsand-900">
          <Nav />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/minecraft" element={<Minecraft />}></Route>
          </Routes>
        </div>
      </Router>
    </DarkModeContextProvider>
  );
}

export default App;
