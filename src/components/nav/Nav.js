import React from 'react'
import NavLink from "./NavLink.js"

const Nav = () => {
    return (
        <div className="relative flex flex-row justify-start items-center h-20 w-full bg-orange-500 shadow-md px-6">
            <NavLink to="/" text="Home" />
            <span className="relative inline-block w-4"></span>
            <NavLink to="/minecraft" text="Minecraft" />
        </div>
    )
}

export default Nav