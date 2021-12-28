import React from 'react'
import NavLink from "./NavLink.js"
import DarkModeToggle from "../DarkModeToggle.js"

const Nav = () => {
    return (
        <div className="relative flex flex-row justify-between items-center h-20 w-full bg-cyan-300 dark:bg-cyan-600 shadow-md px-6">
            {/* Left side of the nav bar. Holds links. */}
            <span>
                <NavLink to="/" text="Home" />
                <span className="relative inline-block w-4"></span>
                <NavLink to="/minecraft" text="Minecraft" />
            </span>
            {/* Right side of the nav bar. Contains the dark mode switch. */}
            <span>
                <DarkModeToggle />
            </span>
        </div>
    )
}

export default Nav