import React from "react";
import Nav from "./components/nav/Nav.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Minecraft from "./pages/Minecraft.js";
import Sunset from "./pages/sunset/Sunset.js";
import DarkModeContextProvider from "./components/DarkModeContext.js";

function App() {
    return (
        <DarkModeContextProvider>
            <Router>
                <div className="bg-fadedsky-50 dark:bg-fadedsky-900">
                    <Nav />
                    <Routes>
                        <Route path="/" element={<Home />}></Route>
                        <Route path="/minecraft" element={<Minecraft />}></Route>
                        <Route path="/sunset" element={<Sunset />}></Route>
                    </Routes>
                </div>
            </Router>
        </DarkModeContextProvider>
    );
}

export default App;
